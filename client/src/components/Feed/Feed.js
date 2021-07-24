import Post from './Post'
import { firestore, storage } from '../../firebase'
import picture from '../../images/picture1.png'
import cancel from '../../images/cancel.png'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { postsAtom } from '../../utils/atoms'

function Feed(props){
    var [postImage, setPostImage] = useState()
    const [posts, setPosts] = useRecoilState(postsAtom)

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
        document.getElementById('postArea').style.height = '30px'
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
        data.id = res.id
        data.name = props.name
        data.profilePic = props.photo
        if(postImage){
            data.photo = URL.createObjectURL(postImage)
        }
        setPosts([data, ...posts])
        if(postImage){
            await storage.ref().child(res.id).put(postImage)
            firestore.collection('posts').doc(res.id).update({photo: 'yes'}) 
            removeImage()
        }
        props.socket.emit('newPost', data)
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

    useEffect(() => {
        if(props.socket){
            props.socket.on('newPost', data => {
                setPosts([data, ...posts])
            })
            return () => {
                props.socket.off('newPost')
            }
        }
    }, [props.socket])
    
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
                {posts ?  posts.map(post => {
                    return <Post key = {post.id} {...post} docId = {post.id}/>
                }): <div id = "loader"></div>}
                
            </div>
        </div>
    )
}

export default Feed