import ReactDOM from 'react-dom'
import { useEffect } from 'react'
import { firestore } from '../firebase'

function Msgs(props){

    useEffect(()=>{
        // const element = <div>SADBOJBOAUDS</div>
        // ReactDOM.render(element, document.getElementById('chatbox'))  
    }, [])

    function displayChat(){
        console.log(props)
    }

    return(
        <div className = 'msg' onClick = {displayChat}>
            <img className = "msgProfile-pic" src={props.photo} alt = "profile pic"/> 
            <div className = 'msgUserInfo'>
                <div style = {{ fontWeight: "600"}}>{props.name}</div>
                <div style = {{ color: "grey"}}>Dec 16</div>
            </div>
        </div>
    )
}

export default Msgs