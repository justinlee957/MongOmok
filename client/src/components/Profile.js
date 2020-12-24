function Profile(props){
    return(
        <div id = 'profile'>
            <div id = 'profileHeader'>
                <img id = "profilePagePic" src={props.photo} alt = "profile pic"/> 
                <div style = {{fontWeight: '600', fontSize: '30px'}}>{props.name}</div>
                <div id = 'profileBio'>i am good dog</div>
            </div>
        </div>
    )
}

export default Profile