import SignOut from './SignIn/SignOut'

export default function Sidebar(props){
    return(
        <div id = "sidebar">
            <img id = "profile-pic" onClick={props.openModal} src={props.photo} alt = "profile pic"/>                   
            <i id = "profile-icon" className = "material-icons">person</i>
            <button onClick = {props.homeClick} className = "sidebar-btn">Home</button>
            <button onClick = {props.playClick} className = "sidebar-btn">Play</button>
            <button onClick = {props.messagesClick} className = "sidebar-btn">Messages</button>
            <button onClick = {props.openModal} className = "sidebar-btn">Profile</button>
            <SignOut socket = {props.socket}/>
        </div>
    )
}