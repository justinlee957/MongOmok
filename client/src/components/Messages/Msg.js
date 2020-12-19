import { auth } from '../../firebase'

function Msg(props){
    const text = props.text
    const msgClass = props.uid === auth.currentUser.uid ? 'sent' : 'received';
    return(
        <div id = "bubble" className = {msgClass}>
            <p id = "msgTxt" className = {msgClass+"Text"}>{text}</p>
        </div>
    )
}
export default Msg