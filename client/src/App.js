import Layout from './components/Layout'
import SignIn from './components/SignIn/SignIn'
import './css/App.css'
import './css/styles.css'
import { firestore, auth } from './firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useState, useEffect } from 'react'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { getPosts, setUserProfile, setChatsData, updateProfile } from './utils/firestoreFunctions'
import { useRecoilState } from 'recoil'
import { postsAtom } from './utils/atoms'

function App() {
  const [user] = useAuthState(auth)
  let [username, setUsername] = useState()
  let [photoLink, setPhoto] = useState()
  let [privateChats, setChats] = useState()
  let [posts, setPosts] = useRecoilState(postsAtom)
  let chatsQuery

  if(user){
    chatsQuery = firestore.collection('chats').where('users', 'array-contains-any', [user.uid]).limit(25)
  }
  const [chats] = useCollectionData(chatsQuery, { idField: 'id' })
  // sets username, photo, and posts
  useEffect(()=>{
    if(user){
      setUserProfile(user, setUsername, setPhoto)
      getPosts().then(postsArr => setPosts(postsArr))
    }
  }, [user]) 

  //sets the messages data with the other user's name and photo
  useEffect(() => {
    if(user && chats && chats.length){
      setChatsData(setChats, chats, user.uid)
    }
  }, [chats, user])

  async function updateProfilePasser(){
    updateProfile(user, setPhoto, setUsername)
  }

  return (
    <div className="App">
        {user ? <Layout messages = {privateChats} updateProfile = {updateProfilePasser} name = {username} photo = {photoLink} uid = {user.uid}/> : <SignIn/>}
    </div>
  );
}

export default App;