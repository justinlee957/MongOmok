import { firestore, storage } from '../firebase'

export async function getPosts(){
    let posts = []
    let snap = await firestore.collection('posts').orderBy('createdAt', 'desc').limit(25).get()
    for(let doc of snap.docs){
        let postObj = doc.data()
        let user = await firestore.collection('users').doc(postObj.uid).get()  
        postObj.name = user.data().name
        postObj.profilePic = user.data().photo
        postObj.id = doc.id
        if(postObj.photo){
            let url = await storage.ref().child(doc.id).getDownloadURL()
            postObj.photo = url
        }
        posts.push(postObj)
    }
    return posts
}