import { firestore, FieldValue } from '../../firebase'
import BoardMsg from './BoardMsg'
import { useCollectionData } from 'react-firebase-hooks/firestore'   

function BoardChat(props){
    const messagesRef = firestore.collection('games').doc(props.gameData.docID).collection('msgs')
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, { idField: 'id' })

    function sendMsg(e){
        var msg = e.target.value
        if(e.key === "Enter"){
            e.preventDefault()
            if (msg !== ''){
                messagesRef.add({
                    text: msg,
                    createdAt: FieldValue.serverTimestamp(),
                    uid: props.uid
                })
            }     
            e.target.value = '';
        }
    }


    return(
        <div id = "boardChatField">
            <div id = "chatMessages">
                {messages && messages.map(msg => <BoardMsg uid = {msg.uid} key = {msg.id} message = {msg.text}/>)}
            </div>
            <div id = "boardMsgWrapper">
                <div id="boardMsgInput">
                    <textarea id='boardChatArea' onKeyPress = {sendMsg} className="browser-default" type="text" autoComplete="off"></textarea>
                </div>
            </div>
        </div>
    )
}




export default BoardChat