import '../css/fak.css'
import Post from './Post'
import { firestore, FieldValue } from '../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect, useState } from 'react'

function Feed(props){
    var [posts, setPosts] = useState(false);        
    const postsRef = firestore.collection('posts')
    const query = postsRef.orderBy('createdAt', 'desc').limit(25)
    //array of post objects
    const [initalPosts] = useCollectionData(query, { idField: 'id' })
    
    useEffect(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        async function setPostsData(){
            var usersRef = firestore.collection('users')
            for(var i = 0; i < initalPosts.length; i++){
                var user = await usersRef.doc(initalPosts[i].uid).get()
                var date
                try{
                    date = new Date(initalPosts[i].createdAt.seconds*1000)
                }catch{
                    return
                }   
                var time = months[date.getMonth()] + ' ' + date.getDate()
    
                initalPosts[i].name = user.data().name
                initalPosts[i].photo = user.data().photo
                initalPosts[i].time = time
            }
            setPosts(initalPosts)
        }
        if(initalPosts !== undefined && initalPosts.length > 0){
            setPostsData()
        }
        async function post(msg){
            await postsRef.add({
                text: msg,
                createdAt: FieldValue.serverTimestamp(),
                uid: props.uid
            })
        }

        var msgid = document.getElementById('postArea')
        msgid.addEventListener('keydown', function(e){
            if(e.key === "Enter"){
                e.preventDefault();
                if (msgid.value !== ''){
                    post(msgid.value);
                }     
                msgid.value = '';
            }
        })

    }, [postsRef, props.uid, initalPosts])
    
    return(
        <div id = "feed">
            <div id = "postInput">
                <textarea id='postArea' className="browser-default" type="text" autoComplete="off"></textarea>
            </div>
            {posts && posts.map(post => <Post key = {post.id} name = {post.name} photo = {post.photo} text = {post.text} time = {post.time}/>)}
        </div>
    )
}

export default Feed