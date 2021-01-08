import ChallengeBox from './ChallengeBox'
import { useState, useEffect } from 'react'
import Board from './Board'
import { firestore } from '../../firebase'

function Play(props){
    var [gameData, setGameData] = useState()

    var headerStyle = {width: '100%'}
    var content

    //show board
    if(props.gameData){
        content = <Board {...props} {...gameData}/>
        document.getElementById('onlineSidebar').style.display = 'none'
        headerStyle = {width: 'calc(100% - 400px)'}
    //show challenges
    }else{
        content = <ChallengeBox {...props} accept = {accept}/>
    }

    useEffect(()=>{
        if(props.gameData){
            firestore.collection('users').doc(props.gameData.otherUid).get().then(doc => {
                setGameData({
                    opponentName: doc.data().name,
                    opponentPhoto: doc.data().photo,
                })
            })
        }
    }, [props.gameData])

    function accept(otherUid){
        props.socket.emit('acceptGame', otherUid)
    }
    return(
        <div id = 'playWrapper'>
            <div id = 'playHeaderWrapper'>
                <div id = 'playHeader' style = {headerStyle}>Play</div>
                {props.gameData && gameData &&
                <div>
                    <img id = "opponentPhoto" src={gameData.opponentPhoto} alt = "opponentPhoto"/> 
                    <div id = 'playOpponentHeader'>{gameData.opponentName}</div>
                </div>}
            </div>
            <div id = 'playContent'>
                {content}
            </div>
        </div>
    )
}

export default Play