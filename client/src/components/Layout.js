import React, { useEffect } from 'react'
import Board from './Board'
import Chat from './Chat'
import OnlineSidebar from './OnlineSidebar'
import Feed from './Feed'
import M from 'materialize-css'
import '../css/fak.css'
import io from 'socket.io-client'
import { firestore } from '../firebase'


function Layout(props){
    useEffect(()=>{
      M.AutoInit();
      document.getElementById('image-file').addEventListener('change', function(){
        const reader = new FileReader();
        const file = document.querySelector('#image-file').files[0];
        reader.addEventListener("load", function () {
            // convert image file to base64 string
            document.getElementById('change-pic').src = reader.result;
        }, false);
        if(file){
            reader.readAsDataURL(file);
        }
      })
      //const socket = io({query: `uid=${props.uid}`});
    })   

    return(
        <div>
            <div id="profile-modal" className="modal">
                    <form>
                        <label>
                            <img id = "change-pic" src={props.photo} alt = "profile pic"/>
                            <i id = "upload-icon" className = "material-icons">cloud_upload</i>
                            <input id = "image-file" type="file" style = {{display:"none"}}/>
                        </label>
                    </form>
                    <div id = "change-name">
                        <label>Name</label>
                        <input className = "input-field" defaultValue = {props.name} id="changeName-input" maxLength="15" type="text" autoComplete = "off"/>
                    </div>
                    <button id = "profile-submit"  onClick={props.updateProfile} className="modal-close waves-effect waves-green btn-flat">Apply</button>
            </div>
            <div id = "content">
                <div id = "sidebar">
                    <a className = "modal-trigger" href="#profile-modal"><img id = "profile-pic" src={props.photo} alt = "profile pic"/></a>                    
                    <button id = "play-btn" className = "btn-flat">Play</button>
                    <button id = "social-btn" className = "btn-flat">Social</button>
                    <button id = "profile-btn" className = "btn-flat">Profile</button>
                </div>
                {/* <Board/>
                <Chat uid = {props.uid} name = {props.name} photo = {props.photo}/> */}
                <Feed uid = {props.uid} name = {props.name} photo = {props.photo}/>
                <OnlineSidebar/>
            </div>  
        </div>
    )
}
// async function onlineUsers(){
//     const onlineUsersRef = firestore.collection('users');
//     const snapshot = await onlineUsersRef.where('status', '==', 'online').get()
//     snapshot.forEach(doc => {
        
//     });
// }
export default Layout