import {useState, useRef} from 'react';
import {Modal, List, Typography, ListItem, ListItemText, Divider} from '@material-ui/core';
import {People, TimelineList} from './types'
import db from './config/firebase';

import {Search} from '@material-ui/icons';

import './PeopleEditor.css';
import {getPeople as getPeopleFirestore} from './PeopleController'
import {getPeople, getPeopleDetails} from './Wikidata';

type PeopleEditorParamsType = {
    open: boolean;
    timelineId: string;
    setPeople: Function;
    onClose: any;
}

export default function PeopleEditor(params : PeopleEditorParamsType) {
    const {open, onClose, timelineId, setPeople} = params;
    const [peopleLocal, setPeopleLocal] = useState<Array<People>>([])

    const previousSearch = useRef<AbortController>();

    const onCloseInternal = () => {
        setPeopleLocal([])
        onClose()
    }

    const onSearch = async (e: any) => {
        if (previousSearch.current) {
            previousSearch.current.abort();
        }
        const controller = new AbortController()
        previousSearch.current = controller;

        try {
            const people = await getPeople(e.target.value, controller.signal)
            setPeopleLocal(people)
        } catch (e) {
            // properly handle abortion
        }
        
    }

    const onAddPeople = async (p: People) => {
        const t = await db.collection('timelineLists').doc(timelineId).get();
        let peopleAdd = {...p, timelineList: t.id}
        await db.collection('people').add(peopleAdd);
        
        const people = await getPeopleFirestore({
            id: timelineId,
            name: 'not-used',
            userEmail: '',
        });
        await setPeople(people);
        onCloseInternal()
    }

    return (
        <Modal
            open={open}
            onClose={onCloseInternal}
        >{
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="PeopleEditor">
                <List>
                    <div className="SearchBar">
                    <Search/><input type="text" onChange={onSearch} autoFocus></input>
                    </div>
                </List>
                {peopleLocal.length ? <Divider/>:<></>}
                <List style={{maxHeight: "60vh", overflow: 'scroll'}}>
                {peopleLocal.map((p) => (
                    <ListItem button id={p.name} onClick={() => onAddPeople(p)}>
                        <ListItemText primary={
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{display: 'flex', flex: "5", textAlign: "left", flexDirection: 'column'}}>
                                    <div>
                                    <Typography style={{fontSize: '1.5rem'}}>{p.name}</Typography> 
                                    <Typography style={{color: "grey"}}>{p.bornDate} {p.deathDate}</Typography>
                                    </div>
                                    <Typography>{p.description}</Typography>
                                </div>
                                <div style={{display: 'flex', marginRight: "5px"}}>
                                    {   p.picture ?
                                            <img src={p.picture} alt={p.name}></img>
                                            :<></>
                                    }
                                </div>
                            </div>
                        }/>
                    </ListItem>
                ))}
                </List>
            </div>
        </div>
        }
        </Modal>
    )
}

