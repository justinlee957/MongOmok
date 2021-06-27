import '../../css/fak.css'
import heart from '../../images/heart.png'
import filledHeart from '../../images/filledHeart.png'
import comment from '../../images/comment.png'
import defaultPic from '../../images/defaultPic.png'
import Comment from './Comment'
import { useState, useEffect } from 'react'
import { firestore, storage, auth, FieldValue } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import Modal from 'react-modal'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: 'none',
      background: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0',
      padding: '0'
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
  };

function Post(props){
    var [options, setOptions] = useState()
    var [numLikes, setNumLikes] = useState()
    var [numComments, setNumComments] = useState()
    var [liked, setLiked] = useState(heart)
    var [displayComment, setDisplayComment] = useState(false)

    var postsQuery = firestore.collection('posts').doc(props.docId)
    var [likes] = useCollectionData(postsQuery.collection('likes'), { idField: 'id' })
    var [initalComments] = useCollectionData(postsQuery.collection('comments').orderBy('createdAt', 'asc').limit(10))
    var [comments, setComments] = useState()
    const photoStyle = props.photo ? {
        backgroundImage: `url(${props.photo})`
    }: ''

    var profilePic = props.profilePhoto ? props.profilePhoto : defaultPic
    var optionsBtn
    if(props.uid === auth.currentUser.uid){
        optionsBtn = <div className = 'postOptionsBtn noselect' onClick = {showOptions}>&#10247;</div>
    }

    function showOptions(){
        if(options === undefined){
            setOptions(<div className = 'postOptions'>
                            <button className = 'deletePostBtn' onClick = {deletePost}>Delete</button>
                        </div>)
        }else{
            setOptions(undefined)
        }
    }

    function closeOptions(){
        setOptions()
    }

    async function deletePost(){
        await firestore.collection('posts').doc(props.docId).delete()
        if(props.photo){
            await storage.ref().child(props.docId).delete();
        }
    }

    function likePost(){
        postsQuery.collection('likes').doc(auth.currentUser.uid).get().then(doc => {
            if(!doc.exists){
                postsQuery.collection('likes').doc(auth.currentUser.uid).set({liked: 'yes'})
                postsQuery.get().then(doc => {
                    setNumLikes(doc.data().likes + 1)
                    postsQuery.update({likes: doc.data().likes+1})
                })
            }else{
                postsQuery.collection('likes').doc(auth.currentUser.uid).delete()
                postsQuery.get().then(doc => {
                    if(doc.data().likes > 1){
                        setNumLikes(doc.data().likes - 1)
                    }else{
                        setNumLikes()
                    }
                    postsQuery.update({likes: doc.data().likes -1})
                })
                setLiked(heart)
            }
        })
    }

    function sendComment(e){
        if(e.key === 'Enter' && e.target.value !== ''){
            e.preventDefault()
            postsQuery.collection('comments').add({
                text: e.target.value,
                uid: auth.currentUser.uid,
                createdAt: FieldValue.serverTimestamp(),
            }).then(() => {
                e.target.value = ''
            })
        }
    }


    useEffect(() => {
        if(likes && likes.length > 0){
            setNumLikes(likes.length)
        }
        if(liked !== filledHeart){
            firestore.collection('posts').doc(props.docId).collection('likes').doc(auth.currentUser.uid).get().then(doc => {
                if(doc.exists){
                    setLiked(filledHeart)
                }
            })
        }
    }, [likes, liked, props.docId])

    useEffect(() => {
        if(initalComments && initalComments.length > 0){
            setNumComments(initalComments.length)
            var itemsProcessed = 0
            initalComments.forEach( (item, i, self) => {
                firestore.collection('users').doc(item.uid).get().then(doc => {
                    itemsProcessed++
                    self[i].name = doc.data().name
                    self[i].photo = doc.data().photo
                    if(itemsProcessed === self.length){
                        setComments(initalComments)
                    }
                })
            })
        }
    }, [initalComments])

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        document.getElementById('homeHeader').style.position = 'inherit'
        setIsOpen(true);
    }
  
    function closeModal() {
        document.getElementById('homeHeader').style.position = 'sticky'
        setIsOpen(false);
    }

    return(
        <div style = {{position: 'relative', width: '100%'}}>
            <div className = "post" onClick = {closeOptions}>
                <div className = "postUserInfoWrapper">
                    <div style = {{display: 'flex', flexDirection: 'row'}}>
                        <img className = "postProfile-pic" src={profilePic} alt = "profile pic"/> 
                        <div className = "postTextWrapper">
                            <div style = {{display: "flex", gap: "10px"}}>
                                <b className = "postName">{props.name}</b>
                                <div style = {{color: "grey"}}>{props.time}</div>
                            </div>
                            <p className = "postText">{props.text}</p>
                        </div>
                    </div>
                </div>  
                {options}
                {props.photo && <div className = "postPic" onClick = {openModal} style = {photoStyle}></div> }
                <div className = "postIconWrapper">
                    <div className = "likeAndCommentWrapper" onClick = {likePost}>
                        <img className = "likeBtn"  src={liked} alt = "heartIcon"/> 
                        <p className = 'numLikesAndPosts'>{numLikes}</p>
                    </div>
                    <div className = 'likeAndCommentWrapper' onClick = {() => setDisplayComment(!displayComment)}>
                        <img className = "commentBtn" src={comment} alt = "commentIcon"/> 
                        <p className = 'numLikesAndPosts'>{numComments}</p>
                    </div>
                </div>
            </div>
            {optionsBtn}
            {displayComment &&
                <div className = 'postComments'>
                    {comments && comments.map(comment => <Comment key = {comment.id} {...comment}/>)}
                    {numComments && <div className = 'commentInputLine'></div>}
                    <input className = 'postCommentInput' onKeyDown = {sendComment} placeholder = "Write a comment!" type="text" name="name" autoComplete = "off"/>
                </div>
            }
            <div onClick={closeModal}>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                >
                <img class = "fullPostPhoto" src = {props.photo}/>
            </Modal>
            </div>
        </div>
    )
}

export default Post