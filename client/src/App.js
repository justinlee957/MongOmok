import Layout from './components/Layout'
import SignIn from './components/SignIn'
import './css/App.css'
import 'materialize-css/dist/css/materialize.min.css'

import { firestore, auth, storage } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useState } from 'react'

function App() {
  const [user] = useAuthState(auth);
  var [username, setUsername] = useState();
  var [photoLink, setPhoto] = useState();
  if(user){
    var docRef = firestore.collection('users');
    docRef.doc(user.uid).get().then(function(doc){
      if(doc.exists){
        setUsername(doc.data().name);
        setPhoto(doc.data().photo);
      }else{
        setUsername(user.displayName);
        setPhoto(user.photoURL);
        docRef.doc(user.uid).set({
          name: user.displayName,
          photo: user.photoURL,
          status: 'online'
        })
      }
    })
  }  

  async function updateProfile(){
    const found = await new Promise(resolve =>{
      if(document.querySelector("#image-file").files[0] !== undefined){
        resolve(true);
      }
    })

    if(found){
      const file = document.querySelector("#image-file").files[0];
      const ref = storage.ref();
      const name = user.uid;
      //insert image into storage
      const task = ref.child(name).put(file);
      task.then(snapshot => {
          snapshot.ref.getDownloadURL().then(url =>{
              //update user's photo in firestore
              firestore.collection('users').doc(user.uid)
              .update({                    
                  photo: url
              }); 
              setPhoto(url);
          })
      });
    }

    const inputName = document.getElementById('changeName-input').value
    if(inputName != user.displayName && inputName != ''){
      setUsername(inputName);
      firestore.collection('users').doc(user.uid).update({
        name: inputName
      })
    }
    
  }

  return (
    <div className="App">
      <header>
        <SignOut/>
      </header>
      {user ? <Layout updateProfile = {updateProfile} name = {username} photo = {photoLink} uid = {user.uid}/> : <SignIn/>}
    </div>
  );
}

function SignOut() {
  const mystyle = {
    position: "absolute",
    left: "0",
    zIndex: "1000",
    bottom: "2%",
    marginLeft: "7px",
  };
  return auth.currentUser && (
    <button style = {mystyle} className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;