import firebase from 'firebase';
import db from './config/firebase';

import {TimelineList, People} from './types'

const getTimelineLists = async () => {
    const col = await db.collection('timelineLists').orderBy('name').get();
    return col.docs.map(p => {return {id: p.id, ...p.data()} as TimelineList})
}

const getTimelineList = async (id: string) => {
    return await db.collection('timelineLists').doc(id).get();
}

const addTimelineList = async (t: any) => {
    return await db.collection('timelineLists').add(t);
}

const deleteTimelineList = async (id: string) => {
    // TODO: delete associated people
    return await db.collection('timelineLists').doc(id).delete();
}

const getPeople = async (timelineList: TimelineList) => {        
    const col = await db.collection('people').where('timelineList', '==', timelineList.id).get();
    const people = await col.docs.map(p => {return {id: p.id, ...p.data()} as People}).sort((a, b) => {return a.bornDate < b.bornDate ? -1:1})
    return people
}

const deletePeople = async (p: People) => {        
    await db.collection('people').doc(p.id).delete()
}

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

export {
    getPeople,
    deletePeople,
    signInPopup, 
    disconnect,
    getSignedInUser,
    getTimelineLists,
    getTimelineList,
    addTimelineList,
    deleteTimelineList,
    getSignedInUserWithoutSignin,
};