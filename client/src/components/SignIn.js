import React, { Component } from 'react'
import { auth, googleAuthProvider } from '../firebase'

class SignIn extends Component{
    signInWithGoogle = () => {
        const provider = googleAuthProvider;
        auth.signInWithPopup(provider);
    }

    render(){
        return (
            <>
              <button className="sign-in" onClick={this.signInWithGoogle}>Sign in with Google</button>
            </>
          )
    }
}

export default SignIn