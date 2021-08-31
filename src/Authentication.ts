import firebase from 'firebase';

const signInPopup = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return await firebase.auth().signInWithPopup(provider)
}

const disconnect = async () => {
    await firebase.auth().signOut()
}

const getSignedInUserWithoutSignin = async () => {
    return firebase.auth().currentUser
}

const getSignedInUser = async () => {
    let user = firebase.auth().currentUser
    if (!user) {
        const res = await signInPopup()
        user = res.user
    }

    return user;
}

export {signInPopup, disconnect, getSignedInUser, getSignedInUserWithoutSignin};