import accept from '../../images/accept.png'
import deny from '../../images/deny.png'
import { firestore } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect } from 'react'


function ChallengeBox(props){
    const challengeRef = firestore.collection('users').doc(props.uid).collection('challenges')
    const [challenge, loading, error] = useCollectionData(challengeRef, { idField: 'id'})
    console.log(challenge)
    return(
        <div id = 'challengeBoxWrapper'>
            <div id = "challengeBox">
                <div id = 'challengeHeader'>Challenges</div>
                {challenge && challenge.length > 0 && challenge.map(chal => <Challenge key = {chal.id} {...props}/>)}
            </div>
        </div>
    )
}

function Challenge(props){
    return(
        <div className = 'challengeWrapper'>
            <p style = {{fontSize: '20px', paddingRight: '5px'}}>User</p>
            <button className = 'challengeOptionBtn' onClick = {() => props.accept(props.uid)}><img className = 'challengeOptionIcon'src={accept} alt = "accept"/></button>
            <button className = 'challengeOptionBtn' style = {{marginRight: '10px'}}><img className = 'challengeOptionIcon' src={deny} alt = "deny"/></button>
        </div>
    )
}

export default ChallengeBox