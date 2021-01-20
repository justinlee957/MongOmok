import accept from '../../images/accept.png'
import deny from '../../images/deny.png'
import { firestore } from '../../firebase'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useEffect, useState} from 'react'


function ChallengeBox(props){
    const challengeRef = firestore.collection('users').doc(props.uid).collection('challenges')
    const [initalChallenges, loading, error] = useCollectionData(challengeRef, { idField: 'id'})
    var [challenges, setChallenges] = useState()

    useEffect(() => {
        if(initalChallenges && initalChallenges.length > 0){
            var itemsProcessed = 0
            initalChallenges.forEach( (item, i, self) => {
                firestore.collection('users').doc(item.id).get().then(doc => {
                    self[i].name = doc.data().name
                    ++itemsProcessed
                    if(itemsProcessed === self.length){
                        setChallenges(initalChallenges)
                    }
                })
            })
        }

    }, [initalChallenges])

    return(
            <div id = "challengeBox">
                <div id = 'challengeHeader'>Challenges</div>
                {challenges && challenges.length > 0 ? challenges.map(chal => <Challenge key = {chal.id} name = {chal.name} uid = {chal.id} accept = {props.accept}/>)
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