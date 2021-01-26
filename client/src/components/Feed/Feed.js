import Post from './Post'
import { firestore, storage } from '../../firebase'
import picture from '../../images/picture1.png'
import cancel from '../../images/cancel.png'
import { useState } from 'react'

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
            createdAt: Date.now(),
            time: today,
            likes: 0,
            comments: 0
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
        //if file is image
        if(file && file['type'].split('/')[0] === 'image'){
            reader.readAsDataURL(file)
        }
        reader.addEventListener("load", function () {
            // convert image file to base64 string
            setPostImage(<div id = 'postImageWrapper'>
                            <img id = "removeImageBtn" src = {cancel} onClick = {removeImage} alt = 'removeImage'/>
                            <img id = "uploadedPic" src = {reader.result}alt = "uploadPic"/>
                            <button id = 'postBtn' onClick = {post}>Post</button>
                        </div>)
        }, false)
    }

    function removeImage(){
        document.getElementById('postImage').value = "";
        setPostImage()
    }

    function homeClick(){
        document.getElementById('content').scrollTop = 0
    }
    
    return(
        <div id = "feedWrapper">
            <div id = "homeHeader" style = {{position: props.position}}>
                <p style = {{cursor: 'pointer', width: '60px', fontSize: '22px'}}onClick = {homeClick}>Home</p>
            </div>
            <div id = "feed">
                <div id = "postInput">
                    <div style = {{display: 'flex', alignItems: 'center', width: '100%', height: '43px'}}>
                        <form>
                            <label>
                                <img id = "uploadPic" src={picture} alt = "uploadPic"/> 
                                <input id = "postImage" onChange={showUploadedImage} type="file" style = {{display:"none"}}/>
                            </label>
                        </form>
                        <textarea id='postArea' placeholder='post something!' onKeyDown = {sendPost} type="text" autoComplete="off"></textarea>
                    </div>  
                    {postImage}
                </div>
                {!props.posts ? <div id = "loader"></div> : props.posts.map( (post, index, self) => {
                    return <Post key = {post.id} name = {post.name} profilePhoto = {post.profilePic} text = {post.text} time = {post.time} photo = {post.photo ? post.photo: undefined} uid = {post.uid} docId = {post.id}/>
                })}
            </div>
        </div>
    )
}

export default Feed