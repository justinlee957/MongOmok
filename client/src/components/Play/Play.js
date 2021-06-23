import ChallengeBox from './ChallengeBox'
import { useState, useEffect } from 'react'
import Board from './Board'
import TestBoard from './TestBoard'
import { firestore } from '../../firebase'
import defaultPic from '../../images/defaultPic.png'
import { turnAtom } from '../../utils/atoms'
import { useSetRecoilState } from 'recoil'
function Play(props){
    var [playerData, setPlayerData] = useState()
    var content
    var headerStyle = {width: '100%'}
    const setTurn = useSetRecoilState(turnAtom)
    //show board
    if(props.gameData){
        content = <TestBoard {...props}/>
        props.gameData.turn === 'first' ? setTurn(true) : setTurn(false)
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

    var opponentPhoto =  props.gameData && props.gameData.opponentPhoto ? props.gameData.opponentPhoto : defaultPic

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
                    <img id = "opponentPhoto" src={opponentPhoto} alt = "opponentPhoto"/> 
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