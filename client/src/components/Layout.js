import React, { Component } from 'react'
import Play from './Play/Play'
import OnlineSidebar from './RightSidebar/OnlineSidebar'
import MessageLayout from './Messages/MessageLayout'
import Feed from './Feed/Feed'
import Modal from 'react-modal'
import openSocket from 'socket.io-client'
import { firestore } from '../firebase'
import SignOut from './SignIn/SignOut'
import MediaQuery from 'react-responsive'
import homeIcon from '../images/home.png'
import playIcon from '../images/play.png'
import envelopeIcon from '../images/envelope.png'
import userIcon from '../images/user.png'

Modal.setAppElement('#root')

const customStyles = {
    content : {
      top                   : '30%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      borderRadius          : '15px'
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
}

class Layout extends Component{
    constructor(props){
        super(props)
        this.homeClick = this.homeClick.bind(this)
        this.messagesClick = this.messagesClick.bind(this)
        this.playClick = this.playClick.bind(this)
        this.leaveMatch= this.leaveMatch.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.inputChange = this.inputChange.bind(this)
        this.usersClick = this.usersClick.bind(this)
        this.state = {home: true, users: false, messages: false, play: false, gameData: undefined, modalIsOpen: false, position: 'sticky'}
    }

    homeClick(){
        this.setState({home: true})
        document.getElementById('content').scrollTop = 0
    }

    playClick(){
        this.setState({play: true, home: false, messages: false})
    }

    messagesClick(){
        this.setState({messages: true, home: false, play: false})
    }


    leaveMatch(){
        firestore.collection('users').doc(this.props.uid).update({inGame: 'no'})
        firestore.collection('users').doc(this.state.gameData.otherUid).update({inGame: 'no'})
        this.socket.emit('leftMatch', this.state.gameData.otherUid)
        this.setState({gameData: undefined, play: true})
    }

    openModal(){
        this.setState({modalIsOpen: true, position: 'inherit'})
    }

    closeModal(){
        this.setState({modalIsOpen: false, position: 'sticky'})
    }

    usersClick(){
        this.setState({users: true, play: false, home: false, messages: false})
    }

    inputChange(){
        const reader = new FileReader();
        const file = document.querySelector('#image-file').files[0];
        reader.addEventListener("load", function () {
            // convert image file to base64 string
            document.getElementById('change-pic').src = reader.result;
        }, false);
        if(file){
            reader.readAsDataURL(file);
        }
    }

    componentDidMount(){
      let isMounted = true
      //used for server
      this.socket = openSocket({query: `uid=${this.props.uid}`})
      //this.socket = openSocket("http://localhost:5000",{query: `uid=${this.props.uid}`})
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
        const users = this.state.users
        let content
        if(home){
            content = <Feed posts = {this.props.posts} position = {this.state.position} uid = {props.uid}/>
        }else if(messages){
            content = <MessageLayout messages = {this.props.messages} uid = {this.props.uid}/>
        }else if(play){
            content = <Play name = {this.props.name} uid = {this.props.uid} photo = {this.props.photo} socket = {this.socket} gameData = {this.state.gameData} leaveMatch = {this.leaveMatch}/>
        }else if(users){
            content = <MediaQuery maxDeviceWidth = {700} onChange={this.homeClick}>
                        <OnlineSidebar name = {this.props.name} uid = {this.props.uid} photo = {this.props.photo} displayMsgs = {this.messagesClick}/>
                    </MediaQuery>
        }

        return(
            <div>
                <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} id ='profile-modal' style = {customStyles}>
                    <form>
                        <label>
                            <img id = "change-pic" src={this.props.photo} alt = "profile pic"/>
                            <i id = "upload-icon" className = "material-icons">cloud_upload</i>
                            <input id = "image-file" onChange = {this.inputChange} type="file" style = {{display:"none"}}/>
                        </label>
                    </form>
                    <div id = "change-name">
                        <p id = 'changeNameHeader'>Name</p>
                        <input className = "input-field" defaultValue = {this.props.name} id="changeNameInput" maxLength="15" type="text" autoComplete = "off"/>
                    </div>
                    <button id = "profile-submit"  onClick={this.props.updateProfile}>Apply</button>
                </Modal>
                <div id = "content">
                    <MediaQuery minDeviceWidth={700}>
                        <div id = "sidebar">
                            <img id = "profile-pic" onClick={this.openModal} src={this.props.photo} alt = "profile pic"/>                   
                            <i id = "profile-icon" className = "material-icons">person</i>
                            <button onClick = {this.homeClick} className = "sidebar-btn">Home</button>
                            <button onClick = {this.playClick} className = "sidebar-btn">Play</button>
                            <button onClick = {this.messagesClick} className = "sidebar-btn">Messages</button>
                            <button onClick = {this.openModal} className = "sidebar-btn">Profile</button>
                            <SignOut/>
                        </div>
                    </MediaQuery>
                    {content}
                    <MediaQuery minDeviceWidth={1000}>
                    <OnlineSidebar name = {this.props.name} uid = {this.props.uid} photo = {this.props.photo} displayMsgs = {this.messagesClick}/>
                    </MediaQuery>
                </div>
                <MediaQuery maxDeviceWidth = {700}>
                    <div id = 'bottomSidebar'>
                        <img onClick = {this.homeClick} className = "bottomSidebarBtn" src={homeIcon} alt = "homeIcon"/>
                        <img onClick = {this.playClick} className = "bottomSidebarBtn" src={playIcon} alt = "playIcon"/>
                        <img onClick = {this.messagesClick} className = "bottomSidebarBtn" src={envelopeIcon} alt = "envelopeIcon"/>
                        <img onClick = {this.usersClick} className = "bottomSidebarBtn" src={userIcon} alt = "userIcon"/>
                    </div>
                </MediaQuery>  
            </div>
        )
    }
}
export default Layout