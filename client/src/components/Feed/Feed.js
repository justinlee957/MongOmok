import Post from './Post'
import { firestore, storage } from '../../firebase'
import picture from '../../images/picture1.png'
import cancel from '../../images/cancel.png'
import { useState } from 'react'

function Feed(props){
    var [postImage, setPostImage] = useState()
    function autoGrow() {
        let element = document.getElementById('postArea')
        element.style.height = "5px";   
        element.style.height = (element.scrollHeight)+"px";
    }
    function sendPost(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            post(e)
        }
    }   

    async function post(e){
        var msg = e.target.value
        if(msg.replace(/ /g,'') === '' && !postImage){
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
        var res = await postsRef.add(data)
        if(postImage){
            await storage.ref().child(res.id).put(postImage)
            firestore.collection('posts').doc(res.id).update({photo: 'yes'}) 
            removeImage()
        }
    }   

    function showUploadedImage(e){
        const f = e.target.files[0]
        if(f && f['type'].split('/')[0] === 'image'){
            setPostImage(f)
        }
    }

    function removeImage(){
        setPostImage()
    }

    function homeClick(){
        document.getElementById('content').scrollTop = 0
    }
    
    return(
        <div id = "feedWrapper">
            <div id = "homeHeader" style = {{position: props.position}}>
                <p style = {{cursor: 'pointer', width: '60px', fontSize: '22px'}} onClick = {homeClick}>Home</p>
            </div>
            <div id = "feed">
                <div id = "postInput">
                    <div id = "postInputResp">
                        <form>
                            <label>
                                <img id = "uploadPic" src={picture} alt = "uploadPic"/> 
                                <input id = "postImage" onChange={showUploadedImage} type="file" style = {{display:"none"}}/>
                            </label>
                        </form>
                        <textarea id='postArea' placeholder='post something!' onInput={autoGrow} onKeyDown = {sendPost} type="text" autoComplete="off" maxLength="162"></textarea>
                    </div>  
                    {postImage && 
                        <div id = 'postImageWrapper'>
                            <img id = "removeImageBtn" src = {cancel} onClick = {removeImage} alt = 'removeImage'/>
                            <img id = "uploadedPic" src = {URL.createObjectURL(postImage)} alt = "uploadPic"/>
                            <button id = 'postBtn' onClick = {post}>Post</button>
                        </div>}
                </div>
                {!props.posts ? <div id = "loader"></div> : props.posts.map( (post, index, self) => {
                    return <Post key = {post.id} name = {post.name} profilePhoto = {post.profilePic} text = {post.text} time = {post.time} photo = {post.photo ? post.photo: undefined} uid = {post.uid} docId = {post.id}/>
                })}
            </div>
        </div>
    )
}

export default Feed