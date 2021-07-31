import {useEffect} from 'react'
import db from './config/firebase';

import {People, TimelineList, Category, Event} from './types';
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
     
    const { setPeople, setCategories, setEvents } = params;

    useEffect(() => {
        getTimelineList(timelineId);
    }, []);

    const getTimelineList = async (id: string) => {
        const p = await db.collection('timelineLists').doc(id).get();
        onSelectTimeList({id: p.id, ...p.data()} as TimelineList);
    }

    const getPeople = async (timelineList: TimelineList) => {        
        const col = await db.collection('people').where('timelineLists', 'array-contains-any', [timelineList.id]).get();
        const people = col.docs.map(p => {return {id: p.id, ...p.data()} as People}).sort((a, b) => {return a.bornDate < b.bornDate ? -1:1})
        setPeople(people);
    }

    const getEvents = async (timelineList: TimelineList) => {        
        const col = await db.collection('events').where('timelineLists', 'array-contains-any', [timelineList.id]).get();
        const events = col.docs.map(p => {return {id: p.id, ...p.data()} as Event})
        setEvents(events);
    }


    const getCategories = async (timelineList: TimelineList) => {        
        const col = await db.collection('categories').get();
        const categories = col.docs.map(p => {return {id: p.id, ...p.data()} as Category})
        setCategories(categories);
    }

    const onSelectTimeList = (e: TimelineList) => {
        getPeople(e);
        getEvents(e);
        getCategories(e);
    }

    return (
    <div>
    </div>
    )
}

export default Menu;