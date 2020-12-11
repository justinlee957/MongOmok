import React from 'react'

function User(props){
    return(
        <div className = "userWrapper">
            <img id = "onlinePic" src={props.photo} alt = "profile pic"/>
            <div className = "onlineUsername">{props.name}</div>
        </div>
    )
}

export default User