import React, { Component } from 'react'
import Board from './Board'
import Chat from './Chat'
import OnlineSidebar from './OnlineSidebar'
import Feed from './Feed'
import M from 'materialize-css'
import '../css/fak.css'
//import io from 'socket.io-client'


class Layout extends Component{
    constructor(props){
        super(props)
        this.homeClick = this.homeClick.bind(this)
        this.messagesClick = this.messagesClick.bind(this)
        this.playClick = this.playClick.bind(this)
        this.state = {home: true, messages: false, play: false}
    }

    homeClick(){
        this.setState({home: true})
    }

    playClick(){
        this.setState({play: true})
        this.setState({home: false})
        this.setState({messages: false})
    }

    messagesClick(){
        this.setState({messages: true})
        this.setState({home: false})
        this.setState({play: false})
    }

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
      //const socket = io({query: `uid=${props.uid}`});
    }

    render(){
        const home = this.state.home
        const messages = this.state.messages
        const play = this.state.play
        let content
        if(home){
            content = <Feed {...this.props}/>
        }else if(messages){
            content = <Chat {...this.props}/>
        }else if(play){
            content = <Board/>
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
                        <button className = "sidebar-btn">Profile</button>
                    </div>
                    {content}
                    <OnlineSidebar/>
                </div>  
            </div>
        )
    }
}
export default Layout