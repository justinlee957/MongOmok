import dog from '../../images/defaultPic.png'

function Chat(props){
    var photo = props.photo ? props.photo : dog
    var date = props.lastSent ? dateToYMD(props.lastSent.toDate()) : ''
    return(
        <div className = 'msg' onClick = {() => props.displayChatBox(props)}>
            <img className = "msgProfile-pic" src={photo} alt = "profile pic"/> 
            <div className = 'msgUserInfo'>
                <div style = {{ fontWeight: "600"}}>{props.name}</div>
                <div style = {{ color: "grey"}}>{date}</div>
            </div>
        </div>
    )
}

function dateToYMD(date) {
    var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var d = date.getDate()
    var m = strArray[date.getMonth()]
    var y = date.getFullYear()
    return '' + m + ' ' + (d <= 9 ? '0' + d : d)
}

export default Chat