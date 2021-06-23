import defaultPic from '../../images/defaultPic.png'
function Comment(props){
    var photo = props.photo ? props.photo : defaultPic
    return(
        <div className = 'commentWrapper'>
            <img className = "postCommentPhoto" src={photo} alt = "postCommentPhoto"/>
            <div className = 'commentTextWrapper'>
                <p className = 'commentName'>{props.name}</p>
                <p>{props.text}</p>
            </div> 
        </div>
    )
}

export default Comment