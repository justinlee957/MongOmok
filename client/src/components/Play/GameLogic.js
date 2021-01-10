import { useEffect, } from 'react'
import { firestore } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'

function GameLogic(props){
    const movesRef = firestore.collection('games').doc(props.gameData.docID).collection('moves')
    const query = movesRef.orderBy('createdAt', 'desc').limit(1)
    const [moves] = useCollectionData(query, { idField: 'id' })

    useEffect(()=>{
        if(moves && moves.length === 0){
            props.setIsNewGame(false)
        }
        if(props.isNewGame){
            return
        }
        
        if(moves && moves.length > 0){
            props.drawPiece(moves[0].x, moves[0].y, moves[0].color)
            
            if(moves[0].uid === props.uid){
             props.setTurn(false) 
            }else{
                props.setTurn(true)
            }
        }else if((!moves || moves.length === 0) && props.gameData.turn === 'first'){
            props.setTurn(true)
        }else{
            props.setTurn(false) 
        }

    }, [moves, props])

    return(
        <>
        </>
    )
}

export default GameLogic