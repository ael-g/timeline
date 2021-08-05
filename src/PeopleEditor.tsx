import {useState} from 'react';
import {Modal, List, Typography, ListItem, ListItemText, Divider} from '@material-ui/core';
import {People, TimelineList} from './types'
import db from './config/firebase';

import {Search} from '@material-ui/icons';

import './PeopleEditor.css';
import {getPeople} from './Wikidata';

type PeopleEditorParamsType = {
    open: boolean;
    timelineList: TimelineList;
    onClose: any;
}

const getYear = (date:string) => {
    const bce = date.match(/^-/);

    let sanitizedDate = date
    if(bce) {
        sanitizedDate = sanitizedDate.substring(1);
    }

    const year = (new Date(sanitizedDate)).getFullYear()
    return bce ? year * -1 : year;
}

export default function PeopleEditor(params : PeopleEditorParamsType) {
    const {open, onClose, timelineList} = params;
    const [people, setPeople] = useState<Array<People>>([])


    const onCloseInternal = () => {
        setPeople([])
        onClose()
    }

    const onSearch = async (e: any) => {
        const p = await getPeople(e.target.value)
        const t = p.map( (i:any) => {
            const birth = i.birth ? getYear(i.birth.value):'';
            const death = i.death ? getYear(i.death.value):'';
            const picture = i.picture ? i.picture.value:'';
            const description = i.desc ? i.desc.value.charAt(0).toUpperCase() + i.desc.value.slice(1):''

            return {
                name: i.label.value,
                bornDate: birth,
                deathDate: death,
                picture,
                description
            }})
        setPeople(t)
    }

    const onAddPeople = async (p: People) => {
        const people = {...p, timelineLists: [timelineList.id]}
        await db.collection('people').add(people);
        onCloseInternal()
        window.location.reload()
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

                {people.length ? <Divider/>:<></>}
                {people.map((p) => (
                    <ListItem button id={p.name} onClick={() => onAddPeople(p)}>
                        <ListItemText primary={
                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                <div style={{display: 'flex', flex: "5", textAlign: "left", flexDirection: 'column'}}>
                                    <div>
                                    <Typography style={{fontSize: "x-large"}}>{p.name}</Typography> 
                                    <Typography style={{color: "grey"}}>{p.bornDate} {p.deathDate}</Typography>
                                    </div>
                                    <Typography style={{}}>{p.description}</Typography>
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

