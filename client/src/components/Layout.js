import React, { Component } from 'react'
import Play from './Play/Play'
import Board from './Play/Board'
import OnlineSidebar from './OnlineSidebar'
import MessageLayout from './Messages/MessageLayout'
import Feed from './Feed'
import Profile from './Profile'
import M from 'materialize-css'
import '../css/fak.css'
import openSocket from 'socket.io-client'

class Layout extends Component{
    constructor(props){
        super(props)
        this.homeClick = this.homeClick.bind(this)
        this.messagesClick = this.messagesClick.bind(this)
        this.playClick = this.playClick.bind(this)
        this.profileClick = this.profileClick.bind(this)
        this.state = {home: true, messages: false, play: false, profile: false, gameData: undefined}
    }

    homeClick(){
        this.setState({home: true})
        document.getElementById('content').scrollTop = 0
    }

    playClick(){
        this.setState({play: true, home: false, messages: false, profile: false})
    }

    messagesClick(){
        this.setState({messages: true, home: false, play: false, profile: false})
    }

    profileClick(){
        this.setState({profile: true, messages: false, home: false, play: false})
    }

    componentDidMount(){
      M.AutoInit()
      let isMounted = true
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
      this.socket = openSocket("http://localhost:5000",{query: `uid=${this.props.uid}`})
      this.socket.on('startGame', (data) =>{
          if(isMounted){
            this.setState({gameData: data})
            this.playClick()
          }
      })
      return () => { isMounted = false }
    }

    render(){
        const home = this.state.home
        const messages = this.state.messages
        const play = this.state.play
        const profile = this.state.profile
        let content
        if(home){
            content = <Feed {...this.props}/>
        }else if(messages){
            content = <MessageLayout messages = {this.props.messages} uid = {this.props.uid}/>
        }else if(play){
            content = <Play name = {this.props.name} uid = {this.props.uid} photo = {this.props.photo} socket = {this.socket} gameData = {this.state.gameData}/>
            //content = <Board {...this.props}/>
        }else if(profile){
            content = <Profile {...this.props}/>
        }

        return(
            <div>
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
                <div id = "content">
                    <div id = "sidebar">
                        <a className = "modal-trigger" href="#profile-modal"><img id = "profile-pic" src={this.props.photo} alt = "profile pic"/></a>                    
                        <i id = "profile-icon" className = "material-icons">person</i>
                        <button onClick = {this.homeClick} className = "sidebar-btn">Home</button>
                        <button onClick = {this.playClick} className = "sidebar-btn">Play</button>
                        <button onClick = {this.messagesClick} className = "sidebar-btn">Messages</button>
                        <button onClick = {this.profileClick} className = "sidebar-btn">Profile</button>
                    </div>
                    {content}
                    <OnlineSidebar {...this.props} displayMsgs = {this.messagesClick}/>
                </div>  
            </div>
        )
    }
}
export default Layout