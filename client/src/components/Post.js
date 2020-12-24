import '../css/fak.css'
import heart from '../images/heart1.png'
import comment from '../images/comment1.png'

function Post(props){
    var photo
    if(props.photo){
        photo = <img className = "postPic" src={props.photo} alt = "post pic"/> 
    }
    return(
        <div className = "post">
            <div className = "postUserInfoWrapper">
                <img className = "postProfile-pic" src={props.profilePhoto} alt = "profile pic"/> 
                <div className = "postTextWrapper">
                    <div style = {{display: "flex", gap: "10px"}}>
                        <b className = "postName">{props.name}</b>
                        <div style = {{color: "grey"}}>{props.time}</div>
                    </div>
                    <p className = "postText">{props.text}</p>
                </div>
            </div>  
            {photo}
            <div className = "postIconWrapper">
                <img className = "commentBtn" src={comment} alt = "commentIcon"/> 
                <img className = "likeBtn" src={heart} alt = "heartIcon"/> 
            </div>
        </div>
    )
}

export default Post