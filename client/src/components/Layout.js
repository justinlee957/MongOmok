import React, { Component, useRef } from 'react'
import Board from './Board'
import Chat from './Chat'
import M from 'materialize-css'
import '../css/fak.css'
import io from 'socket.io-client'


class Layout extends Component{
    componentDidMount(){
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
      const socket = io({query: `uid=${this.props.uid}`});
    }    
    
    render(){
        return(
            <div>
                <ul id="sidenav" className="sidenav sidenav-fixed">
                    <a className = "modal-trigger" href="#profile-modal"><img id = "profile-pic" src={this.props.photo} alt = "profile pic"/></a>                    
                    <i id = "profile-icon" className = "material-icons">person</i>
                    <ul id = "menu" className="collapsible">
                    <li>
                        <button id = 'play-btn' className="collapsible-header .noselect">Play</button>
                        <div className="collapsible-body">
                            <ul>
                                <li><a style = {{fontSize: 17}} href="#!">matchmaking</a></li>
                                <li><a style = {{fontSize: 17}} href="#!">friend</a></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <button id = 'social-btn' className="collapsible-header .noselect">Social</button>
                        <div className="collapsible-body">
                            <ul>
                                <li><a style = {{fontSize: 17}} href="#!">idk :3</a></li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <button data-target="profile-modal" id = 'profile-btn' className="modal-trigger">Profile</button>
                    </li>
                    </ul>
                </ul>
                <div id = "content">
                    <div id="profile-modal" className="modal">
                        <form>
                            <label>
                                <img id = "change-pic" src={this.props.photo} alt = "profile pic"/>
                                <i id = "upload-icon" className = "material-icons">cloud_upload</i>
                                <input id = "image-file" type="file" style = {{display:"none"}}/>
                            </label>
                        </form>
                        <div id = "change-name">
                            <label>Name</label>
                            <input className = "input-field" defaultValue = {this.props.name} id="changeName-input" maxLength="15" type="text" autoComplete = "off"/>
                        </div>
                        <button id = "profile-submit"  onClick={this.props.updateProfile} className="modal-close waves-effect waves-green btn-flat">Apply</button>
                    </div>
                    <Board/>
                    <Chat uid = {this.props.uid} name = {this.props.name} photo = {this.props.photo}/>
                </div>  
            </div>
        )
    }
}

export default Layout