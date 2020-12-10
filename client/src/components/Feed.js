import '../css/fak.css'
import Post from './Post'
import { firestore, FieldValue } from '../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect, useState } from 'react'

function Feed(props){
    var [posts, setPosts] = useState();        
    const postsRef = firestore.collection('posts')
    const query = postsRef.orderBy('createdAt', 'desc').limit(25)
    const [initalPosts] = useCollectionData(query, { idField: 'id' })
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    if(initalPosts !== undefined){
        setPostsData()
    }
    async function setPostsData(){
        var usersRef = firestore.collection('users')
        for(var i = 0; i < initalPosts.length; i++){
            var user = await usersRef.doc(initalPosts[i].uid).get()   
            const date = new Date(initalPosts[i].createdAt.seconds*1000)
            var time = months[date.getMonth()] + ' ' + date.getDate()

            initalPosts[i].name = user.data().name
            initalPosts[i].photo = user.data().photo
            initalPosts[i].time = time
        }
        setPosts(initalPosts)
    }
    
    useEffect(() => {
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

    }, [postsRef, props.uid])
    
    return(
        <>
        <div id = "postInput">
            <textarea id='postArea' className="browser-default" type="text" autoComplete="off"></textarea>
        </div>
        {posts && posts.map(post => <Post key = {post.id} name = {post.name} photo = {post.photo} text = {post.text} time = {post.time}/>)}
        </>
    )
}

export default Feed