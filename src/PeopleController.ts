import db from './config/firebase';

import {TimelineList, People} from './types'

const getPeople = async (timelineList: TimelineList) => {        
    const col = await db.collection('people').where('timelineList', '==', timelineList.id).get();
    const people = await col.docs.map(p => {return {id: p.id, ...p.data()} as People}).sort((a, b) => {return a.bornDate < b.bornDate ? -1:1})
    return people
}

export {getPeople}