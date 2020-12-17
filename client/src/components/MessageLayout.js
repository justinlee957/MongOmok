import Msgs from './Msgs'

function MessageLayout(props){

    return(
        <>
            <div id = 'messages'>
                <div id = 'msgTextHeader'>Messages</div>
                <Msgs {...props}/>
            </div>

            <div id = 'chatbox'>

            </div>
        </>
    )
}

export default MessageLayout