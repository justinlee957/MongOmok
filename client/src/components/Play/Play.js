import ChallengeBox from './ChallengeBox'
import { useState, useEffect } from 'react'
import Board from './Board'
import { firestore } from '../../firebase'

function Play(props){
    var [playerData, setPlayerData] = useState()
    var content
    var headerStyle = {width: '100%'}

    //show board
    if(props.gameData){
        content = <Board {...props}/>
        headerStyle = {width: 'calc(100% - 400px)'}
    //show challenges
    }else{
        content = <div id = 'challengeBoxWrapper'>
                    <ChallengeBox {...props} accept = {accept} decline = {decline}/>
                    {playerData && 
                        <div id = 'playerDataBox'>
                            <p style = {{paddingTop: '5px'}}>win: {playerData.win}</p>
                            <p>lose: {playerData.loss}</p>
                        </div>}
                    <div id = 'challengeHelper'>Challenge players on the right!</div>
                  </div>
    }

    useEffect(()=>{
        firestore.collection('users').doc(props.uid).get().then(doc => {
            var data = {win: doc.data().win, loss: doc.data().loss}
            setPlayerData(data)
        })
    }, [])

    
    function accept(otherUid){
        props.socket.emit('acceptGame', {otherUid, name: props.name, photo: props.photo})
    }

    function decline(otherUid){
        firestore.collection('users').doc(props.uid).collection('challenges').doc(otherUid).delete()
    }

    return(
        <div id = 'playWrapper'>
            <div id = 'playHeaderWrapper'>
                <div id = 'playHeader' style = {headerStyle}>Play</div>
                {props.gameData  &&
                <div style = {{paddingTop: '4px'}}>
                    <img id = "opponentPhoto" src={props.gameData.opponentPhoto} alt = "opponentPhoto"/> 
                    <div id = 'playOpponentHeader'>{props.gameData.opponentName}</div>
                </div>}
            </div>
            <div id = 'playContent'>
                {content}
            </div>
        </div>
    )
}

export default Play