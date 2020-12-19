function Chat(props){
    return(
        <div className = 'msg' onClick = {() => props.displayChatBox(props)}>
            <img className = "msgProfile-pic" src={props.photo} alt = "profile pic"/> 
            <div className = 'msgUserInfo'>
                <div style = {{ fontWeight: "600"}}>{props.name}</div>
                <div style = {{ color: "grey"}}>Dec 16</div>
            </div>
        </div>
    )
}

export default Chat