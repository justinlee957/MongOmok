const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http)

var admin = require("firebase-admin");
var serviceAccount = require("./adminKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omok-77b55.firebaseio.com"
});
const db = admin.firestore();

users = []

io.on('connection', socket =>{
    console.log('connected')
    var uid = socket.handshake.query['uid']

    if(uid !== "undefined" && !users.includes(uid)){
        users.push(uid);
        db.collection('users').doc(uid).update({
            status: 'online',
        })
    }

    socket.on('disconnect', () => {
        console.log('dced')
        const index = users.indexOf('test')
        if(index != -1){
            users.splice(index, 1);
        }
        db.collection('users').doc(uid).update({
            status: 'offline',
        })
    });
})

const port = 5000;
http.listen(port, () =>{
    console.log('server started on port 5000')
})