import Chat from './Chat'
import Chatbox from './Chatbox'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

function MessageLayout(props){

    var [msgClicked, setMsgClicked] = useState(false)
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 850px)' })

    function displayChatBox(data){
        const element = <Chatbox {...data} backClick = {backClick}/>
        setMsgClicked(element)
    }

    function backClick(){
        setMsgClicked()
    }

    return(
        <>
            {(!isTabletOrMobile || !msgClicked) && <div id = 'messages'>
                <div id = 'msgTextHeader'>Messages</div>
                {props.messages && props.messages.map(msg => <Chat key = {msg.id} clicked = {props.messageClicked} uid = {props.uid} {...msg} displayChatBox = {displayChatBox}/>)}
            </div>}
            {(!isTabletOrMobile || msgClicked) && (msgClicked ? msgClicked : <div id = 'chatbox'></div>)}
        </>
    )
}

export default MessageLayout