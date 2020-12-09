import React, { Component } from 'react';
import {BoardFuncs} from '../BoardFunctions';

export class Board extends Component{
    componentDidMount(){
      BoardFuncs()
    }
    
    render(){
        return(
            <div>
                <canvas id = "omokcanvas" width = "700" height="700" />
            </div>
        )
    }
}

export default Board