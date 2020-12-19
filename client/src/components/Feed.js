import '../css/fak.css'
import Post from './Post'
import { firestore, FieldValue } from '../firebase'

function Feed(props){
    function sendPost(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            const msg = e.target.value
            if(msg !== ''){
                post(msg)
            }
            e.target.value = ''
        }
    }

    async function post(msg){
        const postsRef = firestore.collection('posts')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const current = new Date()
        const today = months[current.getMonth()] + ' ' + current.getDate()
        const data = {
            uid: props.uid,
            name: props.name,
            photo: props.photo,
            text: msg,
            createdAt: FieldValue.serverTimestamp(),
            time: today
        }
        await postsRef.add(data)
    }   

    
    return(
        <div id = "feed">
            <div id = "postInput">
                <textarea id='postArea' onKeyDown = {sendPost} className="browser-default" type="text" autoComplete="off"></textarea>
            </div>
            {props.posts && props.posts.map(post => <Post key = {post.id} name = {post.name} photo = {post.photo} text = {post.text} time = {post.time}/>)}
        </div>
    )
}

export default Feed