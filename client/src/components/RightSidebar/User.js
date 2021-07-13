import { useState } from 'react'
import { auth } from '../../firebase'
import dog from '../../images/defaultPic.png'
import { useMediaQuery } from 'react-responsive'

function User(props){
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 700px)'
    })
    var [isHovering, setHovering] = useState(false)
    var photo = props.photo ? props.photo : dog
    var status = props.status === 'online' ? 'onlineDot' : null
    var userWrapper = props.uid === auth.currentUser.uid ? 'myUserWrapper' : 'userInfoWrapper'

    function handleMouseHover(){
        if(isDesktopOrLaptop){
            setHovering(!isHovering)
        }
    } 

    function handleChallengeClick(){
        setHovering(false)
        props.challenge(props.uid)
    }


    return(
        <>
        <div className = {userWrapper} onMouseEnter = {handleMouseHover} onMouseLeave = {handleMouseHover}>
            <img id = "onlinePic" src={photo} alt = "profile pic"/>
            {status && <div className = {status}></div>}
            <div className = "onlineUsername">{props.name}</div>

            {isHovering && userWrapper ==='userInfoWrapper' && 
            <div className = "userOptions">
                <button className = "userOptionsBtn" onClick = {() => props.showChat(props)}>Message</button>
                <button className = "userOptionsBtn" onClick = {handleChallengeClick}>Challenge</button>
            </div>}
        </div>
        </>
    )
}

export default User