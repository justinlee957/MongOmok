import { useState } from 'react'
import { auth } from '../../firebase'
import dog from '../../images/defaultPic.png'
function User(props){
    var [isHovering, setHovering] = useState(false)
    
    var photo = props.photo ? props.photo : dog
    var status = props.status === 'online' ? 'onlineDot' : null

    function handleMouseHover(){
        if(props.uid !== auth.currentUser.uid){
            setHovering(!isHovering)
        }
    }

    return(
        <>
        <div className = "userInfoWrapper" onMouseEnter = {handleMouseHover} onMouseLeave = {handleMouseHover}>
            <img id = "onlinePic" src={photo} alt = "profile pic"/>
            <div className = "onlineUsername">{props.name}</div>
                {isHovering && 
                <div className = "userOptions">
                    <button className = "userOptionsBtn" onClick = {() => props.showChat(props)}>Message</button>
                    <button className = "userOptionsBtn" onClick = {() => props.challenge(props.uid)}>Challenge</button>
                </div>}
        </div>
        <div className = {status}></div>
        </>
    )
}

export default User