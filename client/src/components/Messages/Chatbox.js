import { firestore, FieldValue } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect} from 'react'
import Msg from './Msg'
import { useMediaQuery } from 'react-responsive'
import back from '../../images/back.png'
import dog from '../../images/defaultPic.png'

function Chatbox(props){
    var photo = props.photo ? props.photo : dog
    const messagesRef = firestore.collection('chats').doc(props.id).collection('messages')
    const query = messagesRef.orderBy('createdAt').limit(25)
    const [messages] = useCollectionData(query, { idField: 'id'})

    const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 700px)'
    })

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

    useEffect( ()=> {
        var objDiv = document.getElementById("msgArea")
        if(objDiv){
            objDiv.scrollTop = objDiv.scrollHeight
        }
    })

    return(
        <div id = 'chatbox'>
            <div id = 'msgTextHeader' style = {{ paddingTop: '5px'}}>
                {isTabletOrMobileDevice && <img onClick = {props.backClick} id = "backMsgBtn" src={back} alt = "backMsgBtn"/> }
                <img className = "chatBox-Pic" src={photo} alt = "profile pic"/> 
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
        </div>
    )
}

export default Chatbox