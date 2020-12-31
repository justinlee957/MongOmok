import { useState } from 'react'
import { firestore, auth } from '../firebase'

function User(props){
    var [isHovering, setHovering] = useState(false)

    function handleMouseHover(){
        if(props.uid !== auth.currentUser.uid){
            setHovering(!isHovering)
        }
    }

    return(
        <div className = "userInfoWrapper" onMouseEnter = {handleMouseHover} onMouseLeave = {handleMouseHover}>
            <img id = "onlinePic" src={props.photo} alt = "profile pic"/>
            <div className = "onlineUsername">{props.name}</div>
                {isHovering && 
                <div className = "userOptions">
                    <button className = "userOptionsBtn" onClick = {() => props.showChat(props)}>Message</button>
                    <button className = "userOptionsBtn" onClick = {() => props.challenge(props.uid)}>Challenge</button>
                </div>}
        </div>
    )
}

export default User