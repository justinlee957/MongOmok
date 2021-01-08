import { firestore, FieldValue } from '../../firebase'

export function BoardFuncs(docID, uid, color, moves){
   swag = 5

  var canvas = document.getElementById('omokcanvas')
  var context = canvas.getContext("2d")
  canvas.addEventListener('click', function(e) {
    getCursorPosition(canvas, e);
  })

  var imageData;
  var xcoord = [];
  var ycoord = [];
  var placed = new Array(20);
  drawBoard()
  omokarrays()
  if(moves !== undefined){
    placePoints()
  }


  function drawBoard(){
    // Box width
    var bw = 630;
    // Box height
    var bh = 630;
    // Padding
    var p = 34;
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
    imageData = context.getImageData(0,0,canvas.width,canvas.height);
  }

  function placePoints(){
    for(var i = 0; i < moves.length; i++){
      context.fillStyle = moves[i].color
      context.beginPath()
      context.arc(moves[i].x+7.5, moves[i].y+7.5, 12, 0, 2 * Math.PI);
      context.closePath()
      context.fill()
      if(moves[i].uid === uid){
        placed[(moves[i].y-26)/35][(moves[i].x-26)/35] = 1
      }
    }
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
  
    //for(var i = 0; i < 20; i++){
    //}
    var k
    for(i = 0; i < 19; i++){
      for(j = 19, k = 0; j >= 0; k++, j--){
        if(placed[k][j-i] === 1 && placed[k+1][j-1-i] === 1){
          UpperConsecDiagonal++;
          //console.log(UpperConsecDiagonal);
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

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    var x = event.clientX - rect.left
    var y = event.clientY - rect.top
    x-=7.5
    y-=7.5
    plotclosestpoint(x,y)
  }

  function omokarrays(){
      for(var x = 0; x < 20; x++){
        xcoord[x] = 26 +35*x;
      }
      for(var y = 0; y < 20; y++){
        ycoord[y] = 26 + 35*y;
      }
    
      for (var i = 0; i < 20; i++) {
        placed[i] = new Array(20);
      }
      for(var j = 0; j < 20; j++){
        for(i = 0; i < 20; i++){
          placed[j][i] = 0;
        }
      }
  }
  async function plotclosestpoint(x,y){
    for(var i = 0; i < 20; i++){
      if(x > 674){
        x = 674;
      }else if(x < 26){
        x = 26;
      }else if(xcoord[i] <= x && xcoord[i+1] >= x ){
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
  
    for(i = 0; i < 20; i++){
      if(y > 674){  
        y = 674;
      }else if(y < 26){
        y = 26;
      }else if(ycoord[i] <= y && ycoord[i+1] >= y ){
        var y1 = xcoord[i];
        var y2 = xcoord[i+1];
        if(y2-y > y-y1){
          y = y1;
        }else{
          y = y2;
        }
        break;
      }
    }
    // context.putImageData(imageData, 0, 0);
    // context.fillRect(x,y,15,15);
    // imageData = context.getImageData(0,0,canvas.width,canvas.height);
  
    if(placed[(y-26)/35][(x-26)/35] !== 0){
      return
    }
    context.fillStyle = color
    context.beginPath();
    context.arc(x+7.5, y+7.5, 12, 0, 2 * Math.PI);
    context.closePath();
    context.fill()
    // context.strokeStyle = "red";
    // context.stroke();
    console.log(x, y)
    console.log((y-26)/35,(x-26)/35)
    
    placed[(y-26)/35][(x-26)/35] = 1

    var win = checkwin()
    if(win === 0){
      await firestore.collection('games').doc(docID).collection('moves').add({
        x,
        y,
        color,
        createdAt: FieldValue.serverTimestamp(),
        uid
      }) 
    }else{
      console.log(win)
    }
  }

}
