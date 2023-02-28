var express = require('express')
var app = express()
var path = require('path')
var cors = require("cors")
app.set('port', (process.env.PORT || 5000))
app.use(cors())
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
      }
})

var admin = require("firebase-admin")
var serviceAccount = require("./adminKey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omok-7511f.firebaseio.com"
});
const db = admin.firestore()
const FieldValue = require('firebase-admin').firestore.FieldValue

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'))
})

const usersRef = db.collection('users')

var users = new Map()

io.on('connection', socket => {
    var uid = socket.handshake.query['uid']
    var opponentUid
    console.log(uid, 'connected')
    usersRef.doc(uid).set({status: 'online'}, {merge: true})

    if(uid && !users.has(uid)){
        users.set(uid, {socket: socket.id, inGame: false});
    }

    socket.on('acceptGame', data =>{
        var inGame = users.get(data.otherUid).inGame
        // if the user is online and currently isn't in a game
        if(users.has(data.otherUid) && !inGame){
            console.log("setting up game")
            opponentUid = data.otherUid
            var players = [uid, opponentUid]
            users.get(uid).inGame = true
            users.get(opponentUid).inGame = true
            db.collection('games').add({players}).then(doc => {
                usersRef.doc(data.otherUid).get().then(opponent => {
                    socket.emit('startGame', {otherUid: data.otherUid, docID: doc.id, color: 'red', turn: 'first', opponentName: opponent.data().name, opponentPhoto: opponent.data().photo})
                })
                io.to(users.get(data.otherUid).socket).emit('startGame', {otherUid: uid, docID: doc.id, color: 'black', turn: 'second', opponentName: data.name, opponentPhoto: data.photo })  
            })
        }
        usersRef.doc(uid).collection('challenges').doc(data.otherUid).delete()
    })

    socket.on('setOpponnentUid', otherUid =>{
        opponentUid = otherUid
    })

    socket.on('placePiece', data => {
        opponentUid = data.otherUid
        if(users.has(data.otherUid)){
            io.to(users.get(data.otherUid).socket).emit('opponentPlaced' , data)
        }
    })

    socket.on('wonGame', otherUid =>{
        if(users.has(otherUid)){
            io.to(users.get(otherUid).socket).emit('lostGame')
        }else{
            socket.emit('opponentDc')
        }
    })

    socket.on('requestRematch', otherUid => {
        if(users.has(otherUid)){
            io.to(users.get(otherUid).socket).emit('rematchRequested')
        }else{
            socket.emit('opponentDc')
        }
    })

    socket.on('acceptRematch', otherUid =>{
        if(users.has(otherUid)){
            io.to(users.get(otherUid).socket).emit('startRematch')
        }else{
            socket.emit('opponentDc')
        }
    })

    socket.on('leftMatch', otherUid => {
        users.get(uid).inGame = false
        if(users.has(otherUid)){
            io.to(users.get(otherUid).socket).emit('opponentDc')
        }
    })

    socket.on('resign', otherUid => {
        console.log("resigned", otherUid)
        if(users.has(otherUid)){
            console.log("sent IO update to: ", users.get(otherUid).socket)
            io.to(users.get(otherUid).socket).emit('resign')
        }
    })

    socket.on('newPost', postData => {
        socket.broadcast.emit('newPost', postData)
    })

    socket.on('disconnect', () => {
        console.log(uid, 'dced')
        usersRef.doc(uid).update({inGame: 'no', status: 'offline', lastOnline: FieldValue.serverTimestamp()})
        if(users.has(uid)){
            users.delete(uid)
            if(opponentUid && users.has(opponentUid)){
                io.to(users.get(opponentUid).socket).emit('opponentDc')
            }
        }
    })
})

http.listen(app.get('port'), () => {
    console.log('server running on ' + app.get('port'))
})

//app.listen(process.env.PORT || 3000, () => console.log(`App running on port 3000`))