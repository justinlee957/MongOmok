import { firestore, storage } from "../firebase";
import dog from "../images/defaultPic.png";

const usersRef = firestore.collection("users");
const postsRef = firestore.collection("posts");

export async function getPosts() {
    let posts = [];
    let snap = await postsRef.orderBy("createdAt", "desc").limit(25).get();
    let promises = snap.docs.map(async (doc) => {
        let postObj = doc.data();
        let user = await usersRef.doc(postObj.uid).get();
        postObj.name = user.data().name;
        postObj.profilePic = user.data().photo;
        postObj.id = doc.id;
        posts.push(postObj);
    });
    await Promise.all(promises);
    posts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    return posts;
}

export async function setUserProfile(user, setUsername, setPhoto) {
    let userDoc = await usersRef.doc(user.uid).get();
    if (userDoc.exists) {
        setUsername(userDoc.data().name);
        userDoc.data().photo ? setPhoto(userDoc.data().photo) : setPhoto(dog);
    } else {
        setUsername(user.displayName);
        setPhoto(dog);
        usersRef.doc(user.uid).set({
            name: user.displayName,
            status: "online",
            win: 0,
            loss: 0,
        }, {merge: true});
    }
}

export async function setChatsData(setChats, chats, uid) {
    for (let i = 0; i < chats.length; i++) {
        let otherUid;
        if (chats[i].users[0] === uid) {
            otherUid = chats[i].users[1];
        } else {
            otherUid = chats[i].users[0];
        }
        let user = await usersRef.doc(otherUid).get();
        chats[i].name = user.data().name;
        chats[i].photo = user.data().photo;
        chats[i].otherUid = otherUid;
    }
    setChats(chats);
}

export async function updateProfile(user, setPhoto, setUsername) {
    const image = new Promise((resolve) => {
        if (document.querySelector("#image-file").files[0] !== undefined) {
            resolve();
        }
    });

    image.then(() => {
        const file = document.querySelector("#image-file").files[0];
        const ref = storage.ref();
        const name = user.uid;
        //insert image into storage
        const task = ref.child(name).put(file);
        task.then((snapshot) => {
            snapshot.ref.getDownloadURL().then((url) => {
                setPhoto(url);
                //update user's photo in 'users' collection
                firestore.collection("users").doc(user.uid).update({
                    photo: url,
                });
            });
        });
    });

    const inputName = document.getElementById("changeNameInput").value;
    if (inputName !== user.displayName && inputName !== "") {
        setUsername(inputName);
        //update user's name in 'users' collection
        firestore.collection("users").doc(user.uid).update({
            name: inputName,
        });
    }
}
