import '../css/fak.css'
import logo2 from '../images/icecat.jpg'
import { firestore, FieldValue } from '../firebase'
import ChatMessage from './ChatMessage'
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect } from 'react'

function Chat(props){
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

        var msgid = document.getElementById('chatarea')
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
            <div id = "turninfo">
                <img id = "game-pic" src={props.photo} alt = "profile pic"/>
                <img id = "game-pic" src={logo2} alt = "profile pic"/>
                <div>{props.name}</div>
                <div>Player 2</div>
            </div>
            <div id = "chatMessages">
                {messages && messages.map(msg => <ChatMessage uid = {msg.uid} key = {msg.id} message = {msg.text}/>)}
            </div>
            <div id="msginput">
                <textarea id='chatarea' className="browser-default" type="text" autoComplete="off"></textarea>
            </div>
        </div>
    )
}




export default Chat