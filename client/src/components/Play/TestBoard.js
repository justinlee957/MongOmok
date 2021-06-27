import { useEffect, useRef, useState } from 'react'
import BoardChat from './BoardChat'
import { initBoard, reInitBoard, drawPiece, handleClick, setColor, updateWinLoss } from './BoardFuncs'
import { coordinates, turnAtom, winAtom, canvasImageAtom } from '../../utils/atoms'
import { useRecoilState } from 'recoil'

export default function TestBoard(props){
    const canvas = useRef()
    const [coords, setCoords] = useRecoilState(coordinates)
    const [turn, setTurn] = useRecoilState(turnAtom)
    const [win, setWin] = useRecoilState(winAtom)
    const [gameResult, setGameResult] = useState()
    const [rematch, setRematch] = useState(false)
    const [showRematch, setShowRematch] = useState(true)
    const [canvasImage, setCanvasImage] = useState(null)
    let color = setColor(win, props.gameData.color)

    useEffect(() => {
        initBoard(canvas.current, coords, color)
    }, [])

    useEffect(() => {
        const ctx = canvas.current.getContext('2d')
        props.socket.on('opponentPlaced', data => {
            if(canvasImage){
                ctx.putImageData(canvasImage, 0, 0)
            }
            drawPiece(data.x, data.y, data.color, canvas.current, true)
            setTurn(true)
            setCoords([...coords, {x:data.x, y:data.y, color}])
            setCanvasImage(ctx.getImageData(0,0,canvas.current.width,canvas.current.height))
            ctx.strokeStyle = "purple"
            ctx.strokeRect(data.x-7, data.y-7, 30, 30)
        })
        props.socket.on('lostGame', () => {
            updateWinLoss(false, props.uid)
            setWin(false)
            setTurn(false)
            setGameResult(props.gameData.opponentName + ' wins!')
        })
        props.socket.on('rematchRequested', () => {
            setGameResult(props.gameData.opponentName + ' wants to rematch!')
            setRematch(true)
        })
        props.socket.on('startRematch', () => {
            setCoords([])
            setCanvasImage()
            setGameResult()
            reInitBoard(canvas.current)
            win ? setTurn(false) : setTurn(true)
            setRematch(false)
            setShowRematch(true)
        })
        props.socket.on('opponentDc', () => {
            if(gameResult){
                updateWinLoss(true, props.uid)
            }
            setGameResult(props.gameData.opponentName + ' left')
            setShowRematch(false)
        })
        props.socket.on('resign', () => {
            updateWinLoss(true, props.uid)
            setWin(true)
            setTurn(false)
            setGameResult(props.gameData.opponentName + ' resigned')
        })
        return () => {
            props.socket.off('opponentPlaced')  
            props.socket.off('lostGame')  
            props.socket.off('rematchRequested')  
            props.socket.off('startRematch') 
            props.socket.off('opponentDc') 
            props.socket.on('resign')
        }
    }, [canvasImage])

    function click(e){
        const ctx = canvas.current.getContext('2d')
        if(!turn) return
        let {x, y, win, alreadyPlaced} = handleClick(e, canvas.current, true, color, canvasImage)
        if(alreadyPlaced) return 
        setCanvasImage(ctx.getImageData(0,0,canvas.current.width,canvas.current.height))
        ctx.strokeStyle = 'purple'
        ctx.strokeRect(x-7, y-7, 30, 30)
        //send piece to opponent 
        props.socket.emit('placePiece', {x, y, color, otherUid: props.gameData.otherUid})
        setTurn(!turn)
        setCoords([...coords, {x, y, color}])
        if(win){
            updateWinLoss(true, props.uid)
            setWin(true)
            setTurn(false)
            props.socket.emit('wonGame', props.gameData.otherUid)
            setGameResult(props.name + ' wins!')
        }
    }

    function requestRematch(){
        if(rematch){
            setCoords([])
            setCanvasImage()
            reInitBoard(canvas.current)
            win ? setTurn(false) : setTurn(true)
            setGameResult()
            setRematch(false)
            setShowRematch(true)
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
    function resign(){
        updateWinLoss(false, props.uid)
        setWin(false)
        setTurn(false)
        props.socket.emit('resign', props.gameData.otherUid)
        setGameResult(props.gameData.opponentName + ' wins!')
    }
    return(
        <div id = 'gameWrapper'>
            <div style = {{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                {gameResult &&
                    <div id = 'gameResultWrapper'> 
                        <p id = 'gameResult'>{gameResult}</p>
                        {showRematch && <button id = 'rematchBtn' onClick = {requestRematch}>rematch</button>}
                        <button id = 'leaveBtn' onClick = {leave}>leave</button>
                    </div>
                }
                <canvas ref = {canvas} onClick = { click } id = "omokcanvas" width = "700" height="700" />
                <button id = "resignBtn" onClick = {resign}>RESIGN</button>
            </div>
            <BoardChat {...props}/>
        </div> 
    )
}
