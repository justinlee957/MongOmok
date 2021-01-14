import React, {useState, useEffect} from 'react'
import User from './User'
import { firestore, FieldValue } from '../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function OnlineSidebar(props){
    var usersQuery =  firestore.collection('users')
    var [users] = useCollectionData(usersQuery, { idField: 'id' })

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

    function challenge(otherUid){
        firestore.collection('users').doc(otherUid)
            .collection('challenges').doc(props.uid).set({played: 'no', name: props.name})
    }

    return(
        <div id = "onlineSidebar">
            <div id = "usersTitle">Users</div>
             {users && users.map(user => <User key = {user.id} uid = {user.id} photo = {user.photo} name = {user.name} status = {user.status} showChat = {showChat} challenge = {challenge}/>)} 
        </div>
    )
}

export default OnlineSidebar