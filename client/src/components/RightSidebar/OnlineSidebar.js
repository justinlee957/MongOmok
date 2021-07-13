import User from './User'
import { firestore, FieldValue } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function OnlineSidebar(props){
    var usersQuery =  firestore.collection('users').orderBy("status", "desc").limit(10)
    var [users] = useCollectionData(usersQuery, { idField: 'id' })

    function showChat(otherUser){
        props.displayMsgs(otherUser.uid) 
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
        firestore.collection('users').doc(otherUid).collection('challenges').doc(props.uid).set({played: 'no', name: props.name})
    }

    return(
        <div id = "onlineSidebar">
            <div id = "usersTitle">Users</div>
             {users && users.map(user => <User key = {user.id} uid = {user.id} photo = {user.photo} name = {user.name} status = {user.status} showChat = {showChat} challenge = {challenge}/>)} 
        </div>
    )
}

export default OnlineSidebar