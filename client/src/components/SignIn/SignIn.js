import { useState } from 'react'
import { auth, googleAuthProvider, firestore } from '../../firebase'
import pikachu from '../../images/pikachu.jpg'
import google from '../../images/googleicon.png'
import * as EmailValidator from 'email-validator'

function SignIn(){
    var [content, setContent] = useState(<LogIn setContent = {childSetContent}/>)
    function childSetContent(component){
      setContent(component)
    }
    return (
        <div id = 'loginPage' style = {{backgroundImage: `url(${pikachu})`}}>
          {content}
        </div>
      )
}

function LogIn(props){
  var [email, setEmail] = useState()
  var [password, setPassword] = useState()

  function signInWithGoogle(){
    const provider = googleAuthProvider;
    auth.signInWithPopup(provider).then(res => {
    }).catch(err => {
      console.log(err.message)
    })
  }

  function tryLogIn(){
    auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('signedIn')
    })
    .catch((error) => {
      alert("Invalid Login")
    });
  }

  function enterLogin(e){
    if(e.key === "Enter"){
      e.preventDefault()
      tryLogIn()
    }
  }
  
  return(
    <div id = 'loginSection'>
      <div id = 'loginWrapper'>
        <p id = 'loginHeader'>LOGIN</p>
        <input className = 'loginInput' onInput={e => setEmail(e.target.value)} onKeyPress = {enterLogin}
               type="email" style = {{marginBottom: '10px'}} placeholder = "Email"/>
        <input className = 'loginInput' onInput={e => setPassword(e.target.value)} onKeyPress = {enterLogin} 
               type="password" name="password" placeholder = "Password"/>
        <button className = 'loginBtn' onClick = {tryLogIn} style = {{top: '7%'}}>LOGIN</button>
        {/* <img id = 'googleLogin' src={google} alt = "google icon"/> */}
        <button className = 'loginBtn' style = {{top: '9.5%'}} 
          onClick = {()=> props.setContent(<LogInAnonymous setContent = {props.setContent}/>)}>ENTER AS GUEST</button>
        <button id = "googleBtn" className = 'loginBtn' onClick={signInWithGoogle}>LOGIN WITH GOOGLE</button>
        <p onClick = {()=> props.setContent(<Register setContent = {props.setContent}/>)} style = {{position: 'relative', top: '21%', cursor: 'pointer'}}>Or Sign Up Here</p>
      </div>
    </div>
  )
}

function Register(props){
  var [email, setEmail] = useState()
  var [password, setPassword] = useState()
  var [username, setUsername] = useState()

  async function tryRegister(){
    if(!EmailValidator.validate(email)){
      alert("Invalid Email")
      return
    }
    const snap = await firestore.collection('users').where('name', '==', username).get()
    if(snap.docs.length > 0){
      alert('Username taken!')
      return
    }
    if(password && password.length > 3){
      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          firestore.collection('users').doc(auth.currentUser.uid).set({
            name: username,
            win: 0, 
            loss: 0,
            status: 'online',
          })
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage)
        });
    }else{
      alert('Password has to be at least 4 characters!')
    }
  }

  function enterRegister(e){
    if(e.key === "Enter"){
      tryRegister()
    }
  }

  return(
    <div id = 'loginSection' style = {{height: '528px'}}>
      <div id = 'loginWrapper'>
        <p id = 'loginHeader'>REGISTER</p>
        <input className = 'loginInput' onInput={e => setEmail(e.target.value)} onKeyPress = {enterRegister} type="email" style = {{marginBottom: '10px'}} placeholder = "Email"/>
        <input className = 'loginInput' onInput={e => setUsername(e.target.value)} onKeyPress = {enterRegister} type = "name" style = {{marginBottom: '10px'}} placeholder = "Username"/>
        <input className = 'loginInput' onInput={e => setPassword(e.target.value)} onKeyPress = {enterRegister} type="password" placeholder = "Password"/>
        <button className = 'loginBtn' onClick = {tryRegister} style = {{top: '7%'}}>Register</button>
        <p onClick = {()=> props.setContent(<SignIn/>)} style = {{position: 'relative', top: '14%', cursor: 'pointer'}}>Log In</p>
      </div>
    </div>
  )
}

function LogInAnonymous(props){
  var [username, setUsername] = useState()
  function tryLogInAnon(){
    auth.signInAnonymously()
    .then(() => {console.log(username)
      firestore.collection('users').doc(auth.currentUser.uid).set({
        name: username,
        win: 0, 
        loss: 0,
        status: 'online',
        anonymous: 'true'
      })
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage)
    });
  }
  return(
    <div id = 'loginSection' style = {{height: '360px'}}>
      <div id = 'loginWrapper'>
        <p id = 'loginHeader' style = {{paddingBottom: '33px'}}>Enter Username</p>
        <input className = 'loginInput' onInput={e => setUsername(e.target.value)} type="name" style = {{marginBottom: '10px'}} placeholder = "Username"/>
        <button className = 'loginBtn' onClick = {tryLogInAnon} style = {{top: '7%'}}>Enter</button>
        <p onClick = {()=> props.setContent(<SignIn/>)} style = {{position: 'relative', top: '17%', cursor: 'pointer'}}>Go Back</p>
      </div>
    </div>
  )
}

export default SignIn