function Comment(props){
    return(
        <div className = 'commentWrapper'>
            <img className = "postCommentPhoto" src={props.photo} alt = "postCommentPhoto"/>
            <div className = 'commentTextWrapper'>
                <p className = 'commentName'>{props.name}</p>
                <p>{props.text}</p>
            </div> 
        </div>
    )
}

export default Comment