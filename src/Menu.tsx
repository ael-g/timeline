import {useEffect, useState} from 'react'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import db from './config/firebase';
// import admin from 'firebase-admin';
// import {quattrocento} from './quattrocento'
import {People, TimelineList} from './types';
import {
  useParams,
} from "react-router-dom";

function createDefaultPeople() :People {
    return {id: "", name: "", picture: "", bornDate: 1800, deathDate: 1900}
}

type MenuParams = {
    people: People[];
    setPeople: Function;
}

type TimelineParams = {
    timelineId: string;
}

function Menu(params: MenuParams) {
    const { timelineId } = useParams<TimelineParams>();
     
    const[selectedPeople, setSelectedPeople] = useState<People>(createDefaultPeople());
    let selectedPeopleModified = {...selectedPeople}
    // const[people, setPeople] = useState<Array<People>>([]);
    const { people, setPeople } = params;

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

    const onSelectPeople = (e: string) => {
        console.log(e)
    }

    const onSelectTimeList = (e: TimelineList) => {
        setSelectedTimelineList(e);
        getPeople(e);
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
    <div style={{display: "flex", flexDirection: "column"}}>
        <Paper style={{overflow: 'auto', maxHeight: '85vh'}}>
            {people.map((text) => (
                <List>
                <ListItem button id={text.name} onClick={() => onSelectPeople(text.name)} key={text.name}>
                    <div style={{display: 'flex', flexDirection: 'row', flex: '0 0 100%'}}>
                        <div style={{flex: '0 0 80%'}}>
                            <ListItemText primary={text.name} />
                            <ListItemText style={{color: 'grey'}} primary={`${text.bornDate} - ${text.deathDate}`} />
                        </div>
                    </div>
                </ListItem>
                </List>
            ))}
        </Paper>
    </div>
    )
}

export default Menu;