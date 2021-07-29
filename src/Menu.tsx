import {useEffect, useState} from 'react'
import db from './config/firebase';

import {People, TimelineList, Category} from './types';
import {useParams} from "react-router-dom";

function createDefaultPeople() :People {
    return {id: "", name: "", picture: "", bornDate: 1800, deathDate: 1900}
}

type MenuParams = {
    setPeople: Function;
    setCategories: Function;
}

type TimelineParams = {
    timelineId: string;
}

function Menu(params: MenuParams) {
    const { timelineId } = useParams<TimelineParams>();
     
    const[selectedPeople, setSelectedPeople] = useState<People>(createDefaultPeople());
    const { setPeople, setCategories } = params;

    const[timelineList, setTimelineList] = useState<Array<TimelineList>>([]);
    const[selectedTimelineList, setSelectedTimelineList] = useState<TimelineList>({id: '', name: ''});

    useEffect(() => {
        // getTimelineLists();
        getTimelineList(timelineId);
    }, []);

    const getTimelineList = async (id: string) => {
        const p = await db.collection('timelineLists').doc(id).get();
        onSelectTimeList({id: p.id, ...p.data()} as TimelineList);
    }

    const getTimelineLists = async () => {
        const col = await db.collection('timelineLists').orderBy('name').get();
        const timelineLists = col.docs.map(p => {return {id: p.id, ...p.data()} as TimelineList})
        setTimelineList(timelineLists);
    }

    const getPeople = async (timelineList: TimelineList) => {        
        const col = await db.collection('people').where('timelineLists', 'array-contains-any', [timelineList.id]).get();
        const people = col.docs.map(p => {return {id: p.id, ...p.data()} as People})
        setPeople(people);
    }

    const getCategories = async () => {        
        const col = await db.collection('categories').get();
        const categories = col.docs.map(p => {return {id: p.id, ...p.data()} as Category})
        setCategories(categories);
    }

    const onSelectPeople = (e: string) => {
        console.log(e)
    }

    const onSelectTimeList = (e: TimelineList) => {
        setSelectedTimelineList(e);
        getPeople(e);
        getCategories();
    }

    const onAssociatePeople = async () => {
        // quattrocento.people.forEach(async p => {
        //     const ok = {
        //         name: p.name, 
        //         bornDate: p.start, 
        //         deathDate: p.end,
        //         timelineLists: ["mD2h19N9CnUDxXG6N8PJ"]
        //     }
        //     const ref = await db.collection('people').add(ok)
        // })
            // const col = await db.collection('people').where('timelineLists', 'array-contains-any', ["mD2h19N9CnUDxXG6N8PJ"]).get();
            // const people = col.docs.map(p => {return {id: p.id, ...p.data()} as People})    
            // people.forEach(async p => {
            //     await db.collection('people').doc(p.id).delete()
            // })
    }

    const onDeletePeople = async (id: string) => {
        console.log("On delete")
        // await db.collection('people').doc(id).delete()
        // await getPeople()
    }
      
    return (
    <div>
    </div>
    )
}

export default Menu;