import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/analytics'
import 'firebase/storage'
// const config = {
//     apiKey: "AIzaSyDS-A0cw26s47ra6HoDkJqDbvebpvltWgo",
//     authDomain: "omok-77b55.firebaseapp.com",
//     databaseURL: "https://omok-77b55.firebaseio.com",
//     projectId: "omok-77b55",
//     storageBucket: "omok-77b55.appspot.com",
//     messagingSenderId: "658119935119",
//     appId: "1:658119935119:web:2c790660a0afcaf2e2dcfa",
//     measurementId: "G-111CH2C0D9"
// }
const config = {
    apiKey: "AIzaSyBlIoSQfMBVD9aUeElvuRONeZrEmAOBrgM",
    authDomain: "omok-7511f.firebaseapp.com",
    projectId: "omok-7511f",
    storageBucket: "omok-7511f.appspot.com",
    messagingSenderId: "620688302381",
    appId: "1:620688302381:web:b368b82c4639d6a7a873a4"
};
firebase.initializeApp(config);

export default firebase;

export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const analytics = firebase.analytics();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const FieldValue = firebase.firestore.FieldValue;