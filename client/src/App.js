import Layout from './components/Layout'
import SignIn from './components/SignIn'
import './css/App.css'
import 'materialize-css/dist/css/materialize.min.css'

import { firestore, auth, storage } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useState, useEffect } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function App() {
  const [user] = useAuthState(auth)
  var [username, setUsername] = useState()
  var [photoLink, setPhoto] = useState()
  var [privateChats, setChats] = useState()
  var [posts, setPosts] = useState()
  var chatsQuery, postsQuery

  if(user){
    var postsRef = firestore.collection('posts')
    var chatsRef = firestore.collection('chats')
    chatsQuery = chatsRef.where('users', 'array-contains-any', [user.uid]).limit(25)
    postsQuery = postsRef.orderBy('createdAt', 'desc').limit(25)
  }

  //listen for any updates in these queries and update accordingly
  const [chats] = useCollectionData(chatsQuery, { idField: 'id' })
  const [initalPosts] = useCollectionData(postsQuery, { idField: 'id' })

  async function setPostsData(){
    var usersRef = firestore.collection('users')
    for(var i = 0; i < initalPosts.length; i++){
      var user = await usersRef.doc(initalPosts[i].uid).get()  
      initalPosts[i].name = user.data().name
      initalPosts[i].profilePic = user.data().photo

      if(initalPosts[i].photo !== undefined){
        var url = await storage.ref().child(initalPosts[i].id).getDownloadURL()
        initalPosts[i].photo = url
      }
    }
    setPosts(initalPosts)
  }

  //set the messages data with the other user's name and photo
  async function setChatsData(thisUser){
    var usersRef = firestore.collection('users')
    for(var i = 0; i < chats.length; i++){
      var otherUid
      if(chats[i].users[0] === thisUser.uid){
        otherUid = chats[i].users[1]
      }else{
        otherUid = chats[i].users[0]
      }
      var user = await usersRef.doc(otherUid).get()  
      chats[i].name = user.data().name
      chats[i].photo = user.data().photo
      chats[i].otherUid = otherUid
    }
    setChats(chats)
  }

  useEffect(()=>{
    if(user){
      //set the name and photo of current user
      var usersRef = firestore.collection('users');
      usersRef.doc(user.uid).get().then(function(doc){
        if(doc.exists){
          setUsername(doc.data().name);
          setPhoto(doc.data().photo);
        }else{
          setUsername(user.displayName);
          setPhoto(user.photoURL);
          usersRef.doc(user.uid).set({
            name: user.displayName,
            photo: user.photoURL,
            status: 'online'
          })
        }
      })
    } 
    if(chats !== undefined && chats.length > 0){
      setChatsData(user)
    }
  
    if(initalPosts !== undefined && initalPosts.length > 0){
      setPostsData()
    }
  })  

  async function updateProfile(){
    const image = new Promise(resolve => {
      if(document.querySelector("#image-file").files[0] !== undefined){
        resolve();
      }
    })

    image.then(() => {
      const file = document.querySelector("#image-file").files[0];
      const ref = storage.ref();
      const name = user.uid;
      //insert image into storage
      const task = ref.child(name).put(file);
      task.then(snapshot => {
          snapshot.ref.getDownloadURL().then(url =>{
              setPhoto(url)
              //update user's photo in 'users' collection
              firestore.collection('users').doc(user.uid)
              .update({                    
                  photo: url
              }); 
          })
      })
    })

    const inputName = document.getElementById('changeName-input').value
    if(inputName !== user.displayName && inputName !== ''){
      setUsername(inputName);
      //update user's name in 'users' collection
      firestore.collection('users').doc(user.uid)
      .update({
        name: inputName
      })
    }
  }
  return (
    <div className="App">
      <header>
        <SignOut/>
      </header>
      {user ? <Layout posts = {posts} messages = {privateChats} updateProfile = {updateProfile} name = {username} photo = {photoLink} uid = {user.uid}/> : <SignIn/>}
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