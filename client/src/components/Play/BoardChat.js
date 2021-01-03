import logo2 from '../../images/icecat.jpg'
import { firestore, FieldValue } from '../../firebase'
import BoardMsg from './BoardMsg'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect } from 'react'   

function BoardChat(props){
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, { idField: 'id' });

    useEffect(() => {
        async function sendMessage(msg){
            await messagesRef.add({
                text: msg,
                createdAt: FieldValue.serverTimestamp(),
                uid: props.uid
            })
        }

        var msgid = document.getElementById('boardChatArea')
        msgid.addEventListener('keydown', function(e){
            if(e.key === "Enter"){
                e.preventDefault();
                if (msgid.value !== ''){
                    sendMessage(msgid.value);
                }     
                msgid.value = '';
            }
        })

    }, [messagesRef, props.uid]);


    return(
        <div id = "chatfield">
            <div id = "chatMessages">
                {messages && messages.map(msg => <BoardMsg uid = {msg.uid} key = {msg.id} message = {msg.text}/>)}
            </div>
            <div id = "boardMsgWrapper">
                <div id="msgInput">
                    <textarea id='boardChatArea' className="browser-default" type="text" autoComplete="off"></textarea>
                </div>
            </div>
        </div>
    )
}




export default BoardChat