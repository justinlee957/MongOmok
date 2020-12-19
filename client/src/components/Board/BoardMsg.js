import { auth } from '../../firebase'

function BoardMsg(props){
    const text = props.message
    const msgClass = props.uid === auth.currentUser.uid ? 'sent' : 'received';
    return(
        <div id = "bubble" className = {msgClass}>
            <p id = "msgTxt" className = {msgClass+"Text"}>{text}</p>
        </div>
    )
}
export default BoardMsg