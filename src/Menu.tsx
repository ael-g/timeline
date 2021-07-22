import {useEffect, useState, useContext} from 'react'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import db from './config/firebase';
// import admin from 'firebase-admin';
import {items} from './items'
import {quattrocento} from './quattrocento'
import {People, TimelineList} from './types';
import { Box } from '@material-ui/core';

function createDefaultPeople() :People {
    return {id: "", name: "", picture: "", bornDate: 1800, deathDate: 1900}
}

type MenuParams = {
    people: People[];
    setPeople: Function;
}

function Menu(params: MenuParams) {
    const[selectedPeople, setSelectedPeople] = useState<People>(createDefaultPeople());
    let selectedPeopleModified = {...selectedPeople}
    // const[people, setPeople] = useState<Array<People>>([]);
    const { people, setPeople } = params;

    const[timelineList, setTimelineList] = useState<Array<TimelineList>>([]);
    const[selectedTimelineList, setSelectedTimelineList] = useState<TimelineList>({id: '', name: ''});

    useEffect(() => {
        getTimelineLists();
    }, []);

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

    const onSubmitPeople = async () => {
        const p = {...selectedPeopleModified, timelineLists: [selectedTimelineList.id]}
        if(p.name && p.bornDate && p.deathDate && p.timelineLists.length && p.timelineLists[0]) {
            const existing = await db.collection('people').where('name', '==', p.name).get();
            if(!existing.docs.length) {
                await db.collection('people').add(p);
                await getPeople(selectedTimelineList)
            }
        } 
    }

    const onAssociatePeople = async () => {
        quattrocento.people.forEach(async p => {
            const ok = {
                name: p.name, 
                bornDate: p.start, 
                deathDate: p.end,
                timelineLists: ["mD2h19N9CnUDxXG6N8PJ"]
            }
            const ref = await db.collection('people').add(ok)
        })
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
        <Paper style={{maxHeight: '15vh', marginBottom: '40px'}}>
            <List>
            {timelineList.map((text) => (
                <ListItem button id={text.name} onClick={() => onSelectTimeList(text)} key={text.name}>
                    <ListItemText primary={text.name} />
                </ListItem>
            ))}
            </List>
        </Paper>
        <div style={{display: "flex", flexDirection: "column"}}>
            <Box fontWeight="fontWeightBold">People</Box>
            <TextField id="name" onChange={(e:any) => {selectedPeopleModified.name=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Name" value={selectedPeople.name}/>
            <TextField id="bornDate" onChange={(e:any) => {selectedPeopleModified.bornDate=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Born date" type="number" value={selectedPeople.bornDate}/>
            <TextField id="deathDate" onChange={(e:any) => {selectedPeopleModified.deathDate=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Death date" type="number" value={selectedPeople.deathDate}/>
            <Button variant="contained" color="primary" onClick={onSubmitPeople}>Add</Button>
            {/* <Button variant="contained" color="primary" onClick={onAssociatePeople}>Associate</Button> */}
        </div>
        <Paper style={{overflow: 'auto', maxHeight: '47vh'}}>
            {people.map((text) => (
                <div>
                <ListItem button id={text.name} onClick={() => onSelectPeople(text.name)} key={text.name}>
                    <div style={{display: 'flex', flexDirection: 'row', flex: '0 0 100%'}}>
                        <div style={{flex: '0 0 80%'}}>
                            <ListItemText primary={text.name} />
                            <ListItemText style={{color: 'grey'}} primary={`${text.bornDate} - ${text.deathDate}`} />
                        </div>
                        <div>
                            <DeleteIcon onClick={(e:any) => onDeletePeople(text.id)}></DeleteIcon>
                        </div>
                    </div>
                </ListItem>
                <Divider/>
                </div>
            ))}
        </Paper>
    </div>
    )
}

export default Menu;