import Chat from './Chat'
import Chatbox from './Chatbox'
import ReactDOM from 'react-dom'
import { useState } from 'react'
import { useMediaQuery } from 'react-responsive'

function MessageLayout(props){

    var [msgClicked, setMsgClicked] = useState(false)
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 700px)'
    })
    const isTabletOrMobileDevice = useMediaQuery({
        query: '(max-device-width: 700px)'
    })

    function displayChatBox(data){
        const element = <Chatbox {...data} backClick = {backClick}/>
        if(isTabletOrMobileDevice){
            setMsgClicked(element)
        }else{
            ReactDOM.render(element, document.getElementById('chatbox')) 
        }
    }

    function backClick(){
        setMsgClicked()
    }

    return(
        <>
            {!msgClicked && <div id = 'messages'>
                <div id = 'msgTextHeader'>Messages</div>
                {props.messages && props.messages.map(msg => <Chat key = {msg.id} clicked = {props.messageClicked} uid = {props.uid} {...msg} displayChatBox = {displayChatBox}/>)}
            </div>}
            {isDesktopOrLaptop && <div id = 'chatbox'></div>}

            {msgClicked}
        </>
    )
}

export default MessageLayout