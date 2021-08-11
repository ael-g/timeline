import {useState} from 'react';
import {Modal, List, Typography, ListItem, ListItemText, Divider} from '@material-ui/core';
import {People, TimelineList} from './types'
import db from './config/firebase';

import {Search} from '@material-ui/icons';

import './PeopleEditor.css';
import {getPeople, getPeopleDetails} from './Wikidata';

type PeopleEditorParamsType = {
    open: boolean;
    timelineList: TimelineList;
    onClose: any;
}

export default function PeopleEditor(params : PeopleEditorParamsType) {
    const {open, onClose, timelineList} = params;
    const [people, setPeople] = useState<Array<People>>([])

    const onCloseInternal = () => {
        setPeople([])
        onClose()
    }

    const onSearch = async (e: any) => {
        const people = await getPeople(e.target.value)
        setPeople(people)
    }

    const onAddPeople = async (p: People) => {
        const timelineIdMatch = window.location.pathname.match(/timelines\/(.+)$/)
        if(timelineIdMatch) {
            const t = await db.collection('timelineLists').doc(timelineIdMatch[1]).get();
            const people = {...p, timelineLists: [t.id]}
            const pd = await getPeopleDetails(people.qid ? people.qid: '')
            console.log(pd)

            // await db.collection('people').add(people);
            // onCloseInternal()
            // window.location.reload()
        }
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
                {people.length ? <Divider/>:<></>}
                <List style={{maxHeight: "60vh", overflow: 'scroll'}}>
                {people.map((p) => (
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

