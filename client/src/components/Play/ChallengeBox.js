import accept from '../../images/accept.png'
import deny from '../../images/deny.png'
import { firestore } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'


function ChallengeBox(props){
    const challengeRef = firestore.collection('users').doc(props.uid).collection('challenges')
    const [challenge, loading, error] = useCollectionData(challengeRef, { idField: 'id'})

    return(
            <div id = "challengeBox">
                <div id = 'challengeHeader'>Challenges</div>
                {challenge && challenge.length > 0 ? challenge.map(chal => <Challenge key = {chal.id} name = {chal.name} uid = {chal.id} accept = {props.accept}/>)
                : <p style = {{fontSize: '20px', padding: '5px'}}>None :(</p>}
            </div>
    )
}

function Challenge(props){
    return(
        <div className = 'challengeWrapper'>
            <p style = {{fontSize: '20px', paddingRight: '5px'}}>{props.name}</p>
            <button className = 'challengeOptionBtn' onClick = {() => props.accept(props.uid)}><img className = 'challengeOptionIcon'src={accept} alt = "accept"/></button>
            <button className = 'challengeOptionBtn' style = {{marginRight: '10px'}}><img className = 'challengeOptionIcon' src={deny} alt = "deny"/></button>
        </div>
    )
}

export default ChallengeBox