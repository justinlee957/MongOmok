import React, { Component } from 'react'
import { auth, googleAuthProvider } from '../firebase'
import pikachu from '../images/pikachu.jpg'

class SignIn extends Component{
    signInWithGoogle = () => {
        const provider = googleAuthProvider;
        auth.signInWithPopup(provider);
    }

    render(){
        return (
            <div id = 'loginPage' style = {{backgroundImage: `url(${pikachu})`}}>
              <div id = 'loginSection'>
                <div id = 'loginWrapper'>
                  <p id = 'loginHeader'>MongOmok</p>
                  <p id = 'emailInputInfo'>Email</p>
                  <input className = 'loginInput' type="email" name="email" style = {{marginBottom: '10px'}}/>
                  <p id = 'passwordInputInfo'>Password</p>
                  <input className = 'loginInput' type="password" name="password" />
                  <button className = 'loginBtn' style = {{top: '7%'}}>Sign In</button>
                  <button className = 'loginBtn' style = {{top: '12%'}}onClick={this.signInWithGoogle}>Sign In with Google</button>
                </div>
              </div>
            </div>
          )
    }
}

export default SignIn