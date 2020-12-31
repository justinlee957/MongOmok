import Post from './Post'
import { firestore, FieldValue, storage } from '../firebase'
import picture from '../images/picture1.png'
import cancel from '../images/cancel.png'
import { useState, useEffect } from 'react'

function Feed(props){
    var [postImage, setPostImage] = useState()

    function sendPost(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            post()
        }
    }

    async function post(){
        const msg = document.getElementById('postArea').value
        if(msg === ''){
            return
        }
        document.getElementById('postArea').value = ''

        const postsRef = firestore.collection('posts')
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const current = new Date()
        const today = months[current.getMonth()] + ' ' + current.getDate()
        const data = {
            uid: props.uid,
            text: msg,
            createdAt: FieldValue.serverTimestamp(),
            time: today
        }
        const res = await postsRef.add(data)

        const image = new Promise(resolve => {
            if(document.querySelector("#postImage").files[0] !== undefined){
                resolve()
            }
        })

        image.then(()=>{
            const file = document.querySelector("#postImage").files[0]
            const ref = storage.ref()
            const task = ref.child(res.id).put(file)
            task.then(() => {
                firestore.collection('posts').doc(res.id)
                .update({                    
                    photo: 'yes'
                }) 
            })
            removeImage()
        })
    }   

    function showUploadedImage(){
        const reader = new FileReader()
        const file = document.querySelector('#postImage').files[0]
        if(file){
            reader.readAsDataURL(file)
        }
        reader.addEventListener("load", function () {
            // convert image file to base64 string
            setPostImage(<div id = 'postImageWrapper'>
                            <img id = "uploadedPic" src = {reader.result}alt = "uploadPic"/>
                            <img id = "removeImageBtn" src = {cancel} onClick = {removeImage} alt = 'removeImage'/>
                            <button id = 'postBtn' onClick = {post}>Post</button>
                        </div>)
        }, false)
    }

    function removeImage(){
        document.getElementById('postImage').value = "";
        setPostImage()
    }

    useEffect(()=>{
        document.getElementById('onlineSidebar').style.display = 'block'
    })
    
    return(
        <div id = "feed">
            <div id = "homeHeader">Home</div>
            <div id = "postInput">
                <div style = {{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <form>
                        <label>
                            <img id = "uploadPic" src={picture} alt = "uploadPic"/> 
                            <input id = "postImage" onChange={showUploadedImage} type="file" style = {{display:"none"}}/>
                        </label>
                    </form>
                    <textarea id='postArea' placeholder='post something!' onKeyDown = {sendPost} className="browser-default" type="text" autoComplete="off"></textarea>
                </div>
                {postImage}
            </div>
            {props.posts && props.posts.map(post => <Post key = {post.id} name = {post.name} profilePhoto = {post.profilePic} text = {post.text} time = {post.time} photo = {post.photo ? post.photo: undefined} uid = {post.uid} docId = {post.id}/>)}
        </div>
    )
}

export default Feed