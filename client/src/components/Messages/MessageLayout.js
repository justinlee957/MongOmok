import Chat from './Chat'
import Chatbox from './Chatbox'
import ReactDOM from 'react-dom'
import { useEffect } from 'react'

function MessageLayout(props){
    function displayChatBox(data){
        const element = <Chatbox {...data}/>
        ReactDOM.render(element, document.getElementById('chatbox')) 
    }

    useEffect(()=>{
        document.getElementById('onlineSidebar').style.display = 'block'
    })
    return(
        <>
            <div id = 'messages'>
                <div id = 'msgTextHeader'>Messages</div>
                {props.messages && props.messages.map(msg => <Chat key = {msg.id} uid = {props.uid} {...msg} displayChatBox = {displayChatBox}/>)}
            </div>

            <div id = 'chatbox'>
            </div>
        </>
    )
}

export default MessageLayout