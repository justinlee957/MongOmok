import { auth, firestore } from '../../firebase'

function SignOut() {
  async function signOut(){
    if(auth.currentUser.isAnonymous){
      await firestore.collection('users').doc(auth.currentUser.uid).delete()
    }
    await auth.signOut()
  }
  return auth.currentUser && (
    <button id = 'signOutBtn' onClick={signOut}>Log Out</button>
  )
}

export default SignOut