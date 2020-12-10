import '../css/fak.css'
import heart from '../images/heart.png'
import comment from '../images/comment.png'

function Post(props){
    return(
        <div className = "post">
            <div className = "postUserInfoWrapper">
                <img className = "postProfile-pic" src={props.photo} alt = "profile pic"/> 
                <div className = "postTextWrapper">
                    <div style = {{display: "flex", gap: "10px"}}>
                        <b className = "postName">{props.name}</b>
                        <div style = {{color: "grey"}}>{props.time}</div>
                    </div>
                    <p className = "postText">{props.text}</p>
                </div>
            </div>  
            <div className = "postIconWrapper">
                <img className = "likeBtn" src={heart} alt = "heartIcon"/> 
                <img className = "commentBtn" src={comment} alt = "commentIcon"/> 
            </div>
        </div>
    )
}

export default Post