import { firestore, FieldValue } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Msg from './Msg'

function Chatbox(props){
    const messagesRef = firestore.collection('chats').doc(props.id).collection('messages')
    const query = messagesRef.orderBy('createdAt').limit(25)
    const [messages] = useCollectionData(query, { idField: 'id'})

    console.log(messages)

    function sendMsg(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            const msg = e.target.value
            if(msg !== ''){
                sendMsgToDb(msg)
            }
            e.target.value = ''
        }
    }

    async function sendMsgToDb(msg){
        await messagesRef.add({
            text: msg,
            createdAt: FieldValue.serverTimestamp(),
            uid: props.uid
        })
    }

    return(
        <>
            <div id = 'msgTextHeader' style = {{ paddingTop: '5px'}}>
                <img className = "chatBox-Pic" src={props.photo} alt = "profile pic"/> 
                {props.name}
            </div>
            <div id = 'msgArea'>
                {messages && messages.map(message => <Msg key = {message.id} text = {message.text} uid = {message.uid}/>)}
            </div>
            <div className = 'msgInputWrapper'>
                <div className = 'msgInput'>
                    <textarea id='chatInputArea' onKeyDown = { sendMsg } className="browser-default" type="text" autoComplete="off"></textarea>
                </div>
            </div>
        </>
    )
}

export default Chatbox