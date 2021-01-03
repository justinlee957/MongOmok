import ChallengeBox from './ChallengeBox'
import { useState, useEffect } from 'react'
import Board from './Board'
import BoardChat from './BoardChat'

function Play(props){
    var [challenges, setChallenges] = useState(true)
    var [board, setBoard] = useState(false)
    var [headerStyle, setHeader] = useState({width: '100%'})

    function accept(otherUid){
        props.socket.emit('acceptGame', otherUid)
    }

    useEffect(()=>{
        let isMounted = true
        props.socket.on('startGame', () => {
            if(isMounted){
                setBoard(true)
                setChallenges(false)
                document.getElementById('onlineSidebar').style.display = 'none'
                setHeader({width: 'calc(100% - 400px)'})
            }
        })
        return () => { isMounted = false }
    })

    return(
        <div id = 'playWrapper'>
            <div id = 'playHeaderWrapper'>
                <div id = 'playHeader' style = {headerStyle}>Play</div>
                {board && <div id = 'playOpponentHeader'>User</div>}
            </div>
            <div id = 'playContent'>
                {challenges && <ChallengeBox {...props} accept = {accept}/>}
                {board && <Board {...props}/>}
            </div>
        </div>
    )
}

export default Play