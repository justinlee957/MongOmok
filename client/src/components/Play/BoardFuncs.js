import { firestore, FieldValue } from '../../firebase'

var xcoord = []
var ycoord = []
var placed = []

export function initBoard(canvas, coords, color){
  drawBoard(canvas)
  omokarrays()
  coords.forEach(p => {
    drawPiece(p.x, p.y, p.color, canvas, false)
    p.color === color ? placed[(p.y-26)/35][(p.x-26)/35] = 1 : placed[(p.y-26)/35][(p.x-26)/35] = -1
  })
}

export function reInitBoard(canvas){
  var context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  placed = Array.from({length: 20},()=> Array.from({length: 20}, () => 0))
  drawBoard(canvas)
}

function omokarrays(){
  for(var x = 0; x < 19; x++){
    xcoord[x] = 26 +35*x;
  }
  for(var y = 0; y < 19; y++){
    ycoord[y] = 26 + 35*y;
  }
  placed = Array.from({length: 20},()=> Array.from({length: 20}, () => 0))
}

export function drawPiece(x, y, color, canvas, opponent){
  var context = canvas.getContext('2d')
  context.fillStyle = color
  context.beginPath();
  context.arc(x+7.5, y+7.5, 12, 0, 2 * Math.PI);
  context.closePath();
  context.fill()
  if(opponent){
    placed[(y-26)/35][(x-26)/35] = -1
  }
}

export function drawBoard(canvas){
  var context = canvas.getContext('2d')
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

export function handleClick(e, canvas, turn, color, canvasImage){
  if(turn){
    const rect = canvas.getBoundingClientRect()
    var oldX = e.clientX - rect.left
    var oldY = e.clientY - rect.top
    oldX-=7.5
    oldY-=7.5
    const {x, y} = plotclosestpoint(oldX,oldY)
    if(placed[(y-26)/35][(x-26)/35] === 1 || placed[(y-26)/35][(x-26)/35] === -1){
      return {x, y, win: false, alreadyPlaced: true}
    }
    if(canvasImage){
      canvas.getContext('2d').putImageData(canvasImage, 0, 0)
    }
    drawPiece(x,y, color, canvas, false)
    placed[(y-26)/35][(x-26)/35] = 1
    return {x,y, win: checkwin(), alreadyPlaced: false}
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
  return {x, y}
}

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

  return false;
}

export function setColor(win, defaultColor){
  if(win === -1) return defaultColor
  if(win) return 'black'
  return 'red'
}

export function updateWinLoss(win, uid){
  if(win){
    firestore.collection('users').doc(uid).update({
      win: FieldValue.increment(1)
    })
  }else{
    firestore.collection('users').doc(uid).update({
      loss: FieldValue.increment(1)
    })
  }
}