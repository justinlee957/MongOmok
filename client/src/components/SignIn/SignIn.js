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
    auth.signInWithPopup(provider);
  }

  function tryLogIn(){
    auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('signedIn')
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage)
    });
  }
  
  return(
    <div id = 'loginSection'>
      <div id = 'loginWrapper'>
        <p id = 'loginHeader'>MongOmok</p>
        <p id = 'emailInputInfo'>Email</p>
        <input className = 'loginInput' onInput={e => setEmail(e.target.value)} type="email" style = {{marginBottom: '10px'}}/>
        <p id = 'passwordInputInfo'>Password</p>
        <input className = 'loginInput' onInput={e => setPassword(e.target.value)} type="password" name="password" />
        <button className = 'loginBtn' onClick = {tryLogIn} style = {{top: '7%'}}>Sign In</button>
        <img id = 'googleLogin' src={google} onClick={signInWithGoogle} alt = "google icon"/>
        <button className = 'loginBtn' style = {{top: '12%'}} 
          onClick = {()=> props.setContent(<LogInAnonymous setContent = {props.setContent}/>)}>Sign In Anonymously</button>
        <p onClick = {()=> props.setContent(<Register setContent = {props.setContent}/>)} style = {{position: 'relative', top: '18%', cursor: 'pointer'}}>Create Account</p>
      </div>
    </div>
  )
}

function Register(props){
  var [email, setEmail] = useState()
  var [password, setPassword] = useState()
  var [username, setUsername] = useState()

  function tryRegister(){
    if(EmailValidator.validate(email) && password && password.length > 3){
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
    }
  }

  return(
    <div id = 'loginSection'>
      <div id = 'loginWrapper'>
        <p id = 'loginHeader'>MongOmok</p>
        <p id = 'emailInputInfo'>Email</p>
        <input className = 'loginInput' onInput={e => setEmail(e.target.value)} type="email" style = {{marginBottom: '10px'}}/>
        <p id = 'usernameInputInfo'>Username</p>
        <input className = 'loginInput' onInput={e => setUsername(e.target.value)} type = "name" style = {{marginBottom: '10px'}}/>
        <p id = 'passwordInputInfo'>Password</p>
        <input className = 'loginInput' onInput={e => setPassword(e.target.value)} type="password"/>
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
        <p id = 'loginHeader' style = {{paddingBottom: '33px'}}>MongOmok</p>
        <p id = 'usernameInputInfo'>Username</p>
        <input className = 'loginInput' onInput={e => setUsername(e.target.value)} type="name" style = {{marginBottom: '10px'}}/>
        <button className = 'loginBtn' onClick = {tryLogInAnon} style = {{top: '7%'}}>Enter</button>
        <p onClick = {()=> props.setContent(<SignIn/>)} style = {{position: 'relative', top: '28%', cursor: 'pointer'}}>Go Back</p>
      </div>
    </div>
  )
}

export default SignIn