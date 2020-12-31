import { useEffect } from 'react'
import { BoardFuncs } from './BoardFunctions'
import BoardChat from './BoardChat'

function Board(props){

    useEffect(() =>{
        BoardFuncs()
    })

    return(
        <div id = 'gameWrapper'>
            <canvas id = "omokcanvas" width = "700" height="700" />
            <BoardChat {...props}/> 
        </div> 
    )
    
}

export default Board