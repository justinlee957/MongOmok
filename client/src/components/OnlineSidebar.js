import React, {useState, useEffect} from 'react'
import User from './User'
import { firestore } from '../firebase'

function OnlineSidebar(){
    var [users, setUsers] = useState()

    useEffect(() =>{
        getUsers()
    }, [])
    async function getUsers(){
        var usersRef = firestore.collection('users')
        var usersInit = []
        const snapshot = await usersRef.get()
        var i = 0
        snapshot.forEach(doc => {
            var user = {...doc.data(), id: i}
            usersInit.push(user)
            i++
        });
        setUsers(usersInit)
    }
    return(
        <div id = "onlineSidebar">
            <div id = "usersTitle">Users</div>
             {users && users.map(user => <User key = {user.id} {...user}/>)} 
        </div>
    )
}

export default OnlineSidebar