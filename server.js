const app = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
})

var admin = require("firebase-admin");
var serviceAccount = require("./adminKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://omok-77b55.firebaseio.com"
});
const db = admin.firestore();
users = []
// test()
// async function test(){
//     const onlineUsersRef = db.collection('users');
//     const snapshot = await onlineUsersRef.where('status', '==', 'online').get()
//     snapshot.forEach(doc => {
//         console.log(doc.id, '=>', doc.data());
//       });
// }


io.on('connection', socket =>{
    console.log('connected')
    var uid = socket.handshake.query['uid']

    if(uid !== "undefined" && !users.includes(uid)){
        users.push(uid);
    }

    socket.on('test', (otherUid) =>{
        if(users.indexOf(otherUid) != -1){
            socket.emit('startGame')
        }else{
            deleteChallenge(uid, otherUid)
        }
    })

    socket.on('disconnect', () => {
        console.log(uid, 'dced')
        const index = users.indexOf(uid)
        if(index != -1){
            users.splice(index, 1);
        }
        console.log(users)
    })
})

async function deleteChallenge(uid, otherUid){
    db.collection('users').uid(uid).collection('challenges').doc(otherUid).delete()
}

const port = 5000;
http.listen(port, () =>{
    console.log('server started on port 5000')
})