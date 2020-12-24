import Post from './Post'
import { firestore, FieldValue } from '../firebase'
import sunset from '../images/sunset.jpg'
import picture from '../images/picture1.png'
import cancel from '../images/cancel.png'
import { useState } from 'react'

function Feed(props){
    var [postImage, setPostImage] = useState()
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
                            <button id = 'postBtn'>Post</button>
                        </div>)
        }, false)
    }

    function removeImage(){
        setPostImage()
    }
    
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
            <Post name = {props.name} profilePhoto = {props.photo} text = {'gawd damn'} time = 'Dec 22' photo = {sunset}/>
            {props.posts && props.posts.map(post => <Post key = {post.id} name = {post.name} profilePhoto = {post.photo} text = {post.text} time = {post.time}/>)}
        </div>
    )
}

export default Feed