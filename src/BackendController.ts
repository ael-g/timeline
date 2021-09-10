import firebase from 'firebase/app'
import 'firebase/auth';
import db from './config/firebase';

import { TimelineList, People } from './types';

const getTimelineLists = async () => {
  const col = await db.collection('timelineLists').orderBy('name').get();
  return col.docs.map((p) => ({ id: p.id, ...p.data() } as TimelineList));
};

const getTimelineList = async (id: string) : Promise<any> => db.collection('timelineLists').doc(id).get();

const updateTimelineList = async (t: TimelineList, name: string) : Promise<any> => db.collection('timelineLists').doc(t.id).update({
  name,
});

const addTimelineList = async (t: any) : Promise<any> => db.collection('timelineLists').add(t);

// TODO: delete associated people
const deleteTimelineList = async (id: string) => db.collection('timelineLists').doc(id).delete();

const getPeople = async (timelineList: TimelineList) : Promise<any> => {
  const col = await db.collection('people').where('timelineList', '==', timelineList.id).get();
  const people = await col.docs.map((p) => ({ id: p.id, ...p.data() } as People)).sort((a, b) => (a.bornDate < b.bornDate ? -1 : 1));
  return people;
};

const deletePeople = async (p: People) : Promise<any> => {
  await db.collection('people').doc(p.id).delete();
};

const signInPopup = async () : Promise<any> => {
  const provider = new firebase.auth.GoogleAuthProvider();
  return firebase.auth().signInWithPopup(provider);
};

const disconnect = async () : Promise<any> => {
  await firebase.auth().signOut();
};

const getSignedInUserWithoutSignin = async () : Promise<any> => firebase.auth().currentUser;

const getSignedInUser = async () : Promise<any> => {
  let user = firebase.auth().currentUser;
  if (!user) {
    const res = await signInPopup();
    user = res.user;
  }

  return user;
};

export {
  getPeople,
  deletePeople,
  signInPopup,
  disconnect,
  getSignedInUser,
  getTimelineLists,
  getTimelineList,
  addTimelineList,
  updateTimelineList,
  deleteTimelineList,
  getSignedInUserWithoutSignin,
};
