import { useEffect, useRef, useState } from 'react'
import BoardChat from './BoardChat'
import { firestore, FieldValue } from '../../firebase'
import { useGameContext } from '../../GameProvider'
import GameLogic from './GameLogic'

function Board(props){
  var [gameInfo, setGameInfo] = useState()
  var [isNewGame, setIsNewGame] = useState(false)
  var [turn, setTurn] = useState()
  var [opponentLeft, setOpponentLeft] = useState(false)
  var canvasRef = useRef()
  const [placed, setPlaced, xcoord, ycoord, requestedRematch, setRequestedRematch] = useGameContext()
  
  function handleClick(e){
    console.log('clicked', turn)
    if(turn){
      const rect = canvasRef.current.getBoundingClientRect()
      var x = e.clientX - rect.left
      var y = e.clientY - rect.top
      x-=7.5
      y-=7.5
      plotclosestpoint(x,y)
    }
  }

  function plotclosestpoint(x,y){
    if(x > 656){
      x = 656
    }else if(x < 26){
      x = 26
    }else{
      for(var i = 0; i < 20; i++){
        if(xcoord[i] <= x && xcoord[i+1] >= x ){
          var x1 = xcoord[i];
          var x2 = xcoord[i+1];
          if(x2-x > x-x1){
              x = x1;
          }else{
              x = x2;
          }
          break;
        }
      }
    }
    if(y > 656){  
      y = 656
    }else if(y < 26){
      y = 26
    }else{
      for(i = 0; i < 20; i++){
        if(ycoord[i] <= y && ycoord[i+1] >= y ){
          var y1 = xcoord[i]
          var y2 = xcoord[i+1]
        if(y2-y > y-y1){
            y = y1
        }else{
            y = y2
        }
          break
        }
      }
    }
    
    if(placed[(y-26)/35][(x-26)/35] !== 0){
        return
    }
    drawPiece(x, y, props.gameData.color)
    setTurn(false)
    // console.log(x, y)
    // console.log((x-26)/35, (y-26)/35)
    firestore.collection('games').doc(props.gameData.docID).collection('moves').add({
      x,
      y,
      color: props.gameData.color,
      createdAt: FieldValue.serverTimestamp(),
      uid: props.uid
    }).then(() => {
      placed[(y-26)/35][(x-26)/35] = 1
      setPlaced(placed) 
      
      var win = checkwin()
      if(win){
        console.log('won')
        props.socket.emit('wonGame', props.gameData.otherUid)
        setGameInfo(props.name + ' wins!')
        //firestore.collection('games').doc(props.gameData.docID).update({winner: props.uid})
      }
    })
  }

  function drawPiece(x, y, color){
    var context = canvasRef.current.getContext('2d')
    context.fillStyle = color
    context.beginPath();
    context.arc(x+7.5, y+7.5, 12, 0, 2 * Math.PI);
    context.closePath();
    context.fill()
  }

  function reInitBoard(){
    var context = canvasRef.current.getContext('2d')
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    drawBoard()
  }

  function drawBoard(){
    var context = canvasRef.current.getContext('2d')
    // Box width
    var bw = 630;
    // Box height
    var bh = 630;
    // Padding
    var p = 34;
    context.beginPath()
    for (var x = 0; x <= bw; x += 35) {
        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }
    for (var y = 0; y <= bh; y += 35) {
        context.moveTo(p, 0.5 + y + p);
        context.lineTo(bw + p, 0.5 + y + p);
    }
    context.strokeStyle = "black";
    context.stroke();
  }


  useEffect(()=>{
      drawBoard()
      console.log('drawing board')
      var movesRef = firestore.collection('games').doc(props.gameData.docID).collection('moves')

      //on board render, draw out every move so far
      movesRef.get().then(query=>{
          query.forEach(doc => {
            drawPiece(doc.data().x, doc.data().y, doc.data().color)
          })
      })
      props.socket.on('lostGame', () =>{
        console.log('lost')
        setGameInfo(props.opponentName + ' wins!')
        setTurn(false)
      })
      props.socket.on('rematchRequested', () => {
        setGameInfo(props.opponentName + ' wants to rematch!')
        setRequestedRematch(true)
        setIsNewGame(true)
      })

      props.socket.on('startRematch', () => {
        //reinit game
        let newArray = Array.from({length: 10},()=> Array.from({length: 10}, () => 0))
        setPlaced(newArray)
        setGameInfo(undefined)
        reInitBoard()
        setIsNewGame(true)
        setTurn(true)
        //remove every document from moves collection
        movesRef.get().then(query => {
          query.docs.forEach(doc => {
            movesRef.doc(doc.id).delete()
          })
        })
      })

      props.socket.on('opponentDc', () => {
        setGameInfo(props.opponentName + ' left')
        setOpponentLeft(true)
      })

  }, [props.opponentName, props.socket])

  function checkwin(){
      var numConsecHorizontal = 0;
      for(var j = 0; j < 20; j++){
        for(var i = 0; i <= 20; i++){
          if(placed[j][i] === 1 && placed[j][i+1] === 1){
            numConsecHorizontal++
            if(numConsecHorizontal === 4){
              return 'win';
            }
          }else{
            numConsecHorizontal = 0;
          }
        }
      }
    
      var numConsecVertical = 0;
      for(j = 0; j < 20; j++){
        for(i = 0; i < 20; i++){
          if(placed[i][j] === 1 && placed[i+1][j] === 1){
            numConsecVertical++
            if(numConsecVertical === 4){
              return 'win';
            }
          }else{
            numConsecVertical = 0;
          }
    
        }
      }
      //checking left diagonals
      var UpperConsecDiagonal = 0;
      var LowerConsecDiagonal = 0;
      for(j = 0; j < 20; j++){
        for(i = 0; i < 20-j; i++){
          if(placed[i][i+j] === 1 && placed[i+1][i+1+j] === 1){
            UpperConsecDiagonal++;
            if(UpperConsecDiagonal === 4){
              return 'win';
            }
          }else{
            UpperConsecDiagonal = 0;
          }
        }
        for(i = 0; i < 20-j; i++){
          if(placed[i+j][i] === 1 && placed[i+1+j][i+1] === 1){
            LowerConsecDiagonal++;
            if(LowerConsecDiagonal === 4){
              return 'win';
            }
          }else{
            LowerConsecDiagonal = 0;
          }
        }
      }
    
      var k
      for(i = 0; i < 19; i++){
        for(j = 19, k = 0; j >= 0; k++, j--){
          if(placed[k][j-i] === 1 && placed[k+1][j-1-i] === 1){
            UpperConsecDiagonal++;
            if(UpperConsecDiagonal === 4){
              return 'win';
            }
          }else{
            UpperConsecDiagonal = 0;
          }
        }
    
        for(j = 19, k = 1; k+i < 19; k++, j--){
          if(placed[k+i][j] === 1 && placed[k+i+1][j-1] === 1){
            LowerConsecDiagonal++;
            if(LowerConsecDiagonal === 4){
              return 'win';
            }
          }else{
            LowerConsecDiagonal = 0;
          }
        }
      }
    
      return 0;
  }

  function requestRematch(){
    if(requestedRematch){
      props.socket.emit('acceptRematch', props.gameData.otherUid)
      //reinit game
      let newArray = Array.from({length: 10},()=> Array.from({length: 10}, () => 0))
      setPlaced(newArray)
      setTurn(false)
      setGameInfo(undefined)
      reInitBoard()
    }else{
      props.socket.emit('requestRematch', props.gameData.otherUid)
      setGameInfo('Rematch Requested')
      document.getElementById('rematchBtn').style.display = 'none'
    }
  }

  return(
      <div id = 'gameWrapper'>
        <div>
          {gameInfo &&
            <div id = 'gameResultWrapper'> 
              <p id = 'gameResult'>{gameInfo}</p>
              {!opponentLeft && <button id = 'rematchBtn' onClick = {requestRematch}>rematch</button>}
              <button id = 'leaveBtn' onClick = {props.leaveMatch}>leave</button>
            </div>
          }
          <canvas ref = {canvasRef} onClick = {handleClick} id = "omokcanvas" width = "700" height="700" />
          <GameLogic {...props} drawPiece = {drawPiece} setTurn = {setTurn} isNewGame = {isNewGame} setIsNewGame = {setIsNewGame}/> 
        </div>
          <BoardChat {...props}/>
      </div> 
  )
    
}

export default Board