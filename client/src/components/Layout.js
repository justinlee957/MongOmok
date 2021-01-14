import React, { Component } from 'react'
import Play from './Play/Play'
import OnlineSidebar from './OnlineSidebar'
import MessageLayout from './Messages/MessageLayout'
import Feed from './Feed'
import Modal from 'react-modal'
import openSocket from 'socket.io-client'
import { firestore } from '../firebase'
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
        this.state = {home: true, messages: false, play: false, gameData: undefined, modalIsOpen: false, position: 'sticky'}
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
        this.setState({modalIsOpen: true, position: 'none'})
    }

    closeModal(){
        this.setState({modalIsOpen: false, position: 'sticky'})
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
      //used for heroku
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
        let content
        if(home){
            content = <Feed {...this.props} position = {this.state.position}/>
        }else if(messages){
            content = <MessageLayout messages = {this.props.messages} uid = {this.props.uid}/>
        }else if(play){
            content = <Play name = {this.props.name} uid = {this.props.uid} photo = {this.props.photo} socket = {this.socket} gameData = {this.state.gameData} leaveMatch = {this.leaveMatch}/>
            //content = <Board {...this.props}/>
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
                    <div id = "sidebar">
                        <img id = "profile-pic" onClick={this.openModal} src={this.props.photo} alt = "profile pic"/>                   
                        <i id = "profile-icon" className = "material-icons">person</i>
                        <button onClick = {this.homeClick} className = "sidebar-btn">Home</button>
                        <button onClick = {this.playClick} className = "sidebar-btn">Play</button>
                        <button onClick = {this.messagesClick} className = "sidebar-btn">Messages</button>
                        <button onClick = {this.openModal} className = "sidebar-btn">Profile</button>
                    </div>
                    {content}
                    <OnlineSidebar {...this.props} displayMsgs = {this.messagesClick}/>
                </div>  
            </div>
        )
    }
}
export default Layout