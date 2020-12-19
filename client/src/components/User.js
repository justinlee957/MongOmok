import React from 'react'
import { firestore } from '../firebase'

function User(props){
    return(
        <div className = "userWrapper" onClick = {() => props.showChat(props)}>
            <img id = "onlinePic" src={props.photo} alt = "profile pic"/>
            <div className = "onlineUsername">{props.name}</div>
        </div>
    )
}

export default User