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
  databaseURL: "https://omok-77b55.firebaseio.com"
});
const db = admin.firestore()

app.use(express.static(path.join(__dirname, 'client/build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'))
})

var users = new Map()


io.on('connection', socket =>{
    var uid = socket.handshake.query['uid']
    var opponentUid
    console.log(uid, 'connected')
    db.collection('users').doc(uid).update({status: 'online'})

    if(uid && !users.has(uid)){
        users.set(uid, socket.id);
    }

    socket.on('acceptGame', otherUid =>{
        db.collection('users').doc(otherUid).get().then(doc => {
            var inGame = doc.data().inGame
            var players = [uid, otherUid]
            console.log(otherUid, inGame)
            if(users.has(otherUid) && (inGame === "no" || inGame === undefined)){
                opponentUid = otherUid
                db.collection('users').doc(uid).update({inGame: 'yes'})
                db.collection('users').doc(otherUid).update({inGame: 'yes'})
                db.collection('games').add({players}).then(doc =>{
                    socket.emit('startGame', {otherUid, docID: doc.id, color: 'red', turn: 'first'})
                    io.to(users.get(otherUid)).emit('startGame', {otherUid: uid, docID: doc.id, color: 'black', turn: 'second' })  
                })
            }
            db.collection('users').doc(uid).collection('challenges').doc(otherUid).delete()
        })
    })

    socket.on('wonGame', otherUid =>{
        if(users.has(otherUid)){
            io.to(users.get(otherUid)).emit('lostGame')
        }else{
            socket.emit('opponentDc')
        }
    })

    socket.on('requestRematch', otherUid => {
        if(users.has(otherUid)){
            io.to(users.get(otherUid)).emit('rematchRequested')
        }else{
            socket.emit('opponentDc')
        }
    })

    socket.on('acceptRematch', otherUid =>{
        if(users.has(otherUid)){
            io.to(users.get(otherUid)).emit('startRematch')
        }else{
            socket.emit('opponentDc')
        }
    })

    socket.on('leftMatch', otherUid => {
        if(users.has(otherUid)){
            io.to(users.get(otherUid)).emit('opponentDc')
        }
    })

    socket.on('disconnect', () => {
        console.log(uid, 'dced')
        db.collection('users').doc(uid).update({inGame: 'no', status: 'offline'})
        if(users.has(uid)){
            users.delete(uid)
            if(opponentUid && users.has(opponentUid)){
                io.to(users.get(otherUid)).emit('opponentDc')
            }
        }
    })
})

http.listen(app.get('port'), () => {
    console.log('server running on ' + app.get('port'))
})