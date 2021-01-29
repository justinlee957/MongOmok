import ChallengeBox from './ChallengeBox'
import { useState, useEffect, useRef } from 'react'
import Board from './Board'
import { firestore } from '../../firebase'

function Play(props){
    var [playerData, setPlayerData] = useState()
    var content
    var headerStyle = {width: '100%'}

    console.log('render from play')
    // //show board
    if(props.gameData){
        console.log('if')
        content = <Board {...props}/>
        document.getElementById('onlineSidebar').style.display = 'none'
        headerStyle = {width: 'calc(100% - 400px)'}
    //show challenges
    }else{
        console.log('else')
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
        firestore.collection('users').doc(props.uid).get().then(doc => {
            var data = {win: doc.data().win, loss: doc.data().loss}
            setPlayerData(data)
        })
    }, [])

    function accept(otherUid){
        props.socket.emit('acceptGame', {otherUid, name: props.name, photo: props.photo})
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