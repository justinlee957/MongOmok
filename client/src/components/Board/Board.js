import React, { Component } from 'react'
import {BoardFuncs} from './BoardFunctions'
import BoardChat from './BoardChat'

export class Board extends Component{
    componentDidMount(){
      BoardFuncs()
    }
    
    render(){
        return(
            <div id = 'gameWrapper'>
                <canvas id = "omokcanvas" width = "700" height="700" />
                <BoardChat {...this.props}/> 
            </div>
        )
    }
}

export default Board