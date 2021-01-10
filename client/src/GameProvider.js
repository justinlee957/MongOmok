import React, { useContext, useState} from 'react'

const GameContext = React.createContext()

export function useGameContext(){
    return useContext(GameContext)
}

export function GameProvider({children}){
    var [placed, setPlaced] = useState(Array.from({length: 10},()=> Array.from({length: 10}, () => 0)))
    var [requestedRematch, setRequestedRematch] = useState()
    var xcoord = []
    var ycoord = []
    omokarrays()
    function omokarrays(){
        for(var x = 0; x < 19; x++){
          xcoord[x] = 26 +35*x;
        }
        for(var y = 0; y < 19; y++){
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

    return(
        <GameContext.Provider value = {[placed, setPlaced, xcoord, ycoord, requestedRematch, setRequestedRematch]}>
            {children}
        </GameContext.Provider>
    )
}