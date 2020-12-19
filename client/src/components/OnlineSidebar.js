import React, {useState, useEffect} from 'react'
import User from './User'
import { firestore, FieldValue } from '../firebase'

function OnlineSidebar(props){
    var [users, setUsers] = useState()

    useEffect(() =>{
        getUsers()
    }, [])

    async function getUsers(){
        var usersRef = firestore.collection('users')
        var usersInit = []
        const snapshot = await usersRef.get()
        var i = 0
        snapshot.forEach(doc => {
            var user = {...doc.data(), id: i, uid: doc.id}
            usersInit.push(user)
            i++
        });
        setUsers(usersInit)
    }

    async function showChat(otherUser){
        if(otherUser.uid === props.uid){
            return
        }
        props.displayMsgs() 
        var docid
        var users = [props.uid, otherUser.uid]
        if(props.uid < otherUser){
            docid = props.uid + '+' + otherUser.uid
        }else{
            docid = otherUser.uid + '+' + props.uid
        }

        var chatRef = firestore.collection('chats')
        chatRef.doc(docid).get()
            .then(doc =>{
                if(!doc.exists){
                    chatRef.doc(docid).set({
                        users,
                        lastSent: FieldValue.serverTimestamp(),
                    })
                }
            })
    }

    return(
        <div id = "onlineSidebar">
            <div id = "usersTitle">Users</div>
             {users && users.map(user => <User key = {user.id} {...user} showChat = {showChat}/>)} 
        </div>
    )
}

export default OnlineSidebar