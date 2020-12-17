import React from 'react'
import { firestore } from '../firebase'

function User(props){

    function msg(){
        console.log(props.name)
    }   

    return(
        <div className = "userWrapper" onClick = {msg}>
            <img id = "onlinePic" src={props.photo} alt = "profile pic"/>
            <div className = "onlineUsername">{props.name}</div>
        </div>
    )
}

export default User