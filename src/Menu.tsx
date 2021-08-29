import {useEffect} from 'react'
import db from './config/firebase';

import {People, TimelineList} from './types';
import {useParams} from "react-router-dom";

type MenuParams = {
    setPeople: Function;
    setCategories: Function;
    setEvents: Function;
}

type TimelineParams = {
    timelineId: string;
}

function Menu(params: MenuParams) {
    const { timelineId } = useParams<TimelineParams>();
     
    const { setPeople } = params;

    useEffect(() => {
        getTimelineList(timelineId);
    }, []);

    const getTimelineList = async (id: string) => {
        const p = await db.collection('timelineLists').doc(id).get();
        onSelectTimeList({id: p.id, ...p.data()} as TimelineList);
    }

    const getPeople = async (timelineList: TimelineList) => {        
        // const col = await db.collection('people').where('timelineLists', 'array-contains-any', [timelineList.id]).get();
        const col = await db.collection('people').where('timelineList', '==', timelineList.id).get();
        const people = col.docs.map(p => {return {id: p.id, ...p.data()} as People}).sort((a, b) => {return a.bornDate < b.bornDate ? -1:1})
        setPeople(people);
    }

    const onSelectTimeList = (e: TimelineList) => {
        getPeople(e);
    }

    return (
        <></>
    )
}

export default Menu;