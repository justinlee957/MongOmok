import { useEffect, useRef, useState } from 'react'
import BoardChat from './BoardChat'
import { firestore, FieldValue } from '../../firebase'
import { initBoard, reInitBoard, drawPiece, handleClick, setColor } from './BoardFuncs'
import { coordinates, turnAtom, winAtom } from '../../utils/atoms'
import { useRecoilState } from 'recoil'

export default function TestBoard(props){
    const canvas = useRef()
    const [coords, setCoords] = useRecoilState(coordinates)
    const [turn, setTurn] = useRecoilState(turnAtom)
    const [win, setWin] = useRecoilState(winAtom)
    const [gameResult, setGameResult] = useState()
    const [rematch, setRematch] = useState(false)
    const [showRematch, setShowRematch] = useState(true)
    let color = setColor(win, props.gameData.color)
    
    useEffect(() => {
        initBoard(canvas.current, coords, color)
        props.socket.on('opponentPlaced', data => {
            drawPiece(data.x, data.y, data.color, canvas.current, true)
            setTurn(true)
            setCoords([...coords, {x:data.x, y:data.y, color}])
        })
        props.socket.on('lostGame', () =>{
            setWin(false)
            setTurn(false)
            setGameResult(props.gameData.opponentName + ' wins!')
        })
        props.socket.on('rematchRequested', () => {
            setGameResult(props.gameData.opponentName + ' wants to rematch!')
            setRematch(true)
        })
        props.socket.on('startRematch', () => {
            setGameResult()
            reInitBoard(canvas.current)
            win ? setTurn(false) : setTurn(true)
            setRematch(false)
            setShowRematch(true)
            setCoords([])
        })
        props.socket.on('opponentDc', () => {
            setGameResult(props.gameData.opponentName + ' left')
            setShowRematch(false)
        })
        return () => {
            props.socket.off('opponentPlaced')  
            props.socket.off('lostGame')  
            props.socket.off('rematchRequested')  
            props.socket.off('startRematch') 
            props.socket.off('opponentDc') 
        }
    }, [])

    function click(e){
        if(!turn) return
        let {x, y, win, alreadyPlaced} = handleClick(e, canvas.current, true, color)
        if(alreadyPlaced) return 
        //send piece to opponent 
        props.socket.emit('placePiece', {x, y, color, otherUid: props.gameData.otherUid})
        setTurn(!turn)
        setCoords([...coords, {x, y, color}])
        if(win){
            setWin(true)
            setTurn(false)
            props.socket.emit('wonGame', props.gameData.otherUid)
            setGameResult(props.name + ' wins!')
        }
    }

    function requestRematch(){
        if(rematch){
            reInitBoard(canvas.current)
            win ? setTurn(false) : setTurn(true)
            setGameResult()
            setRematch(false)
            setShowRematch(true)
            setCoords([])
            props.socket.emit('acceptRematch', props.gameData.otherUid)
        }else{
            props.socket.emit('requestRematch', props.gameData.otherUid)
            setGameResult('Rematch Requested')
            setShowRematch(false)
        }
    }
    function leave(){
        setCoords([])
        props.leaveMatch()
    }
    return(
        <div id = 'gameWrapper'>
            <div>
                {gameResult &&
                    <div id = 'gameResultWrapper'> 
                        <p id = 'gameResult'>{gameResult}</p>
                        {showRematch && <button id = 'rematchBtn' onClick = {requestRematch}>rematch</button>}
                        <button id = 'leaveBtn' onClick = {leave}>leave</button>
                    </div>
                }
                <canvas ref = {canvas} onClick = { click } id = "omokcanvas" width = "700" height="700" />
            </div>
            <BoardChat {...props}/>
        </div> 
    )
}
