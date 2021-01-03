
export function BoardFuncs(){
    var canvas = document.getElementById('omokcanvas');
    var context = canvas.getContext("2d");
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

    var imageData;
    var xcoord = [];
    var ycoord = [];
    var placed = new Array(20);
    drawBoard()
    omokarrays()

    canvas.addEventListener('click', function(e) {
        getCursorPosition(canvas, e);
    })
    function getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        x-=7.5;
        y-=7.5;
        plotclosestpoint(x,y);
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
    function plotclosestpoint(x,y){
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
        context.putImageData(imageData, 0, 0);
        context.fillRect(x,y,15,15);
        imageData = context.getImageData(0,0,canvas.width,canvas.height);
      
        context.beginPath();
        context.arc(x+7.5, y+7.5, 12, 0, 2 * Math.PI);
        context.strokeStyle = "red";
        context.stroke();
      
        placed[(y-26)/35][(x-26)/35] = 1;
    }

}
