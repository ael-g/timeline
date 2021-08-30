import {useEffect} from 'react'
import db from './config/firebase';

import {getPeople} from './PeopleController'
import {TimelineList} from './types';
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
        onRefreshPeople()
    }, []);

    const onRefreshPeople = () => {
        getTimelineList(timelineId);
    }

    const getTimelineList = async (id: string) => {
        const p = await db.collection('timelineLists').doc(id).get();
        onSelectTimeList({id: p.id, ...p.data()} as TimelineList);
    }

    const onSelectTimeList = async (e: TimelineList) => {
        const people = await getPeople(e);
        setPeople(people);
    }

    return (
        <></>
    )
}

export default Menu;