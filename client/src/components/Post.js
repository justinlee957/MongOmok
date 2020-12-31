import '../css/fak.css'
import heart from '../images/heart1.png'
import comment from '../images/comment1.png'
import { useState } from 'react'
import { firestore, storage, auth } from '../firebase'

function Post(props){
    var optionsBtn
    var [options, setOptions] = useState()

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

    async function deletePost(){
        await firestore.collection('posts').doc(props.docId).delete()
        if(props.photo){
            await storage.ref().child(props.docId).delete();
        }
    }

    return(
        <div className = "post">
            <div className = "postUserInfoWrapper">
                <div style = {{display: 'flex', flexDirection: 'row'}}>
                    <img className = "postProfile-pic" src={props.profilePhoto} alt = "profile pic"/> 
                    <div className = "postTextWrapper">
                        <div style = {{display: "flex", gap: "10px"}}>
                            <b className = "postName">{props.name}</b>
                            <div style = {{color: "grey"}}>{props.time}</div>
                        </div>
                        <p className = "postText">{props.text}</p>
                    </div>
                </div>
                {optionsBtn}
            </div>  
            {options}
            {props.photo && <img className = "postPic" src={props.photo} alt = "post pic"/> }
            <div className = "postIconWrapper">
                <img className = "commentBtn" src={comment} alt = "commentIcon"/> 
                <img className = "likeBtn" src={heart} alt = "heartIcon"/> 
            </div>
        </div>
    )
}

export default Post