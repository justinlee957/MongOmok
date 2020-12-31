import ChallengeBox from './ChallengeBox'
import { useState, useEffect } from 'react'
import Board from './Board'

function Play(props){
    var [challenges, setChallenges] = useState(true)
    var [board, setBoard] = useState(false)

    function accept(otherUid){
        props.socket.emit('test', otherUid)
        setBoard(true)
        setChallenges(false)
        document.getElementById('onlineSidebar').style.display = 'none'
    }

    useEffect(()=>{
        props.socket.on('startGame', () => {
            setBoard(true)
            setChallenges(false)
        })
    })

    return(
        <div id = 'playWrapper'>
            <div id = 'playHeader'>Play</div>
            <div id = 'playContent'>
                {challenges && challenges.length > 0 && <ChallengeBox {...props} accept = {accept}/>}
                {board && <Board {...props}/>}
            </div>
        </div>
    )
}

export default Play