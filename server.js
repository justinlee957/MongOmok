var express = require('express')
var app = express()
var path = require('path')
var cors = require("cors")
app.use(cors())
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
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
    console.log(uid, 'connected')

    if(uid && !users.has(uid)){
        users.set(uid, socket.id);
    }

    socket.on('acceptGame', otherUid =>{
        db.collection('users').doc(otherUid).get().then(doc => {
            var inGame = doc.data().inGame
            console.log(otherUid, inGame)
            if(true/*users.has(otherUid) && (inGame === "no" || inGame === undefined)*/){
                //socket.emit('startGame', otherUid)
                //work on layout emit
                db.collection('users').doc(uid).update({inGame: 'yes'})
                db.collection('users').doc(otherUid).update({inGame: 'yes'})
                // db.collection('games').add({users}).then(doc =>{
                //     socket.emit('startGame', {otherUid, docid: doc.id})
                // })
                db.collection('games').doc('HgsUL62Zvo2AJjHzklce').get().then(doc => {
                    socket.emit('startGame', {otherUid, docID: doc.id, color: 'red', turn: 'first'})
                    io.to(users.get(otherUid)).emit('startGame', {otherUid: uid, docID: doc.id, color: 'black', turn: 'second' })
                })
            }
        })
        //db.collection('users').doc(uid).collection('challenges').doc(otherUid).delete()     
    })

    socket.on('wonGame', otherUid =>{
        io.to(users.get(otherUid)).emit('lostGame')
    })

    socket.on('requestRematch', otherUid => {
        io.to(users.get(otherUid)).emit('rematchRequested')
    })

    socket.on('acceptRematch', otherUid =>{
        io.to(users.get(otherUid)).emit('startRematch')
    })

    socket.on('disconnect', () => {
        console.log(uid, 'dced')
        if(users.has(uid)){
            users.delete(uid)
        }
    })
})

http.listen(process.env.PORT || 5000)