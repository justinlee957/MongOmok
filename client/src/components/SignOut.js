import { auth } from '../firebase'

function SignOut() {

    return auth.currentUser && (
      <button id = 'signOutBtn' onClick={() => auth.signOut()}>Log Out</button>
    )
}

export default SignOut