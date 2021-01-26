import ChallengeBox from './ChallengeBox'
import { useState, useEffect, useRef } from 'react'
import Board from './Board'
import { firestore } from '../../firebase'

function Play(props){
    var [gameData, setGameData] = useState()
    var [playerData, setPlayerData] = useState()
    var content
    var [headerStyle, setHeaderStyle] = useState({width: '100%'})

    //show board
    if(props.gameData && gameData){
        content = <Board {...props} {...gameData}/>
        document.getElementById('onlineSidebar').style.display = 'none'
        setHeaderStyle({width: 'calc(100% - 400px)'})
    //show challenges
    }else{
        content = <div id = 'challengeBoxWrapper'>
                    <ChallengeBox {...props} accept = {accept}/>
                    {playerData && 
                        <div id = 'playerDataBox'>
                            <p style = {{paddingTop: '5px'}}>win: {playerData.win}</p>
                            <p>lose: {playerData.loss}</p>
                        </div>}
                    <div id = 'challengeHelper'>Challenge players on the right!</div>
                  </div>
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
        firestore.collection('users').doc(props.uid).get().then(doc => {
            var data = {win: doc.data().win, loss: doc.data().loss}
            setPlayerData(data)
        })
    }, [props.gameData, props.uid])

    function accept(otherUid){
        props.socket.emit('acceptGame', otherUid)
    }
    return(
        <div id = 'playWrapper'>
            <div id = 'playHeaderWrapper'>
                <div id = 'playHeader' style = {headerStyle}>Play</div>
                {props.gameData && gameData &&
                <div style = {{paddingTop: '4px'}}>
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