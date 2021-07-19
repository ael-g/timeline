import {useEffect, useState} from 'react'
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import db from './config/firebase';
import {People} from './types';

function createDefaultPeople() :People {
    return {id: "", name: "", picture: "", bornDate: 1800, deathDate: 1900}
}

function Menu() {
    const[selectedPeople, setSelectedPeople] = useState<People>(createDefaultPeople());
    let selectedPeopleModified = {...selectedPeople}
    
    const[people, setPeople] = useState<Array<People>>([]);

    useEffect(() => {
        getPeople();
    }, []);

    const getPeople = async () => {
        const col = await db.collection('people').orderBy('name').get();
        const people = col.docs.map(p => {return {id: p.id, ...p.data()} as People})
        setPeople(people);
    }

    const onSelectPeople = (e: string) => {
        console.log(e)
    }

    const onSubmitPeople = async () => {
        const p = selectedPeopleModified
        if(p.name && p.bornDate && p.deathDate) {
            const existing = await db.collection('people').where('name', '==', p.name).get();
            if(!existing.docs.length) {
                console.log("Creatingg")
                await db.collection('people').add(p);
                await getPeople()
            }
        } 
    }

    const onDeletePeople = async (id: string) => {
        console.log("On delete")
        // await db.collection('people').doc(id).delete()
        // await getPeople()
    }
      
    return (
    <List style={{display: "flex", flexDirection: "column", height: '97vh'}}>
        <div style={{display: "flex", flexDirection: "column"}}>
            <TextField id="name" onChange={(e:any) => {selectedPeopleModified.name=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Name" value={selectedPeople.name}/>
            <TextField id="bornDate" onChange={(e:any) => {selectedPeopleModified.bornDate=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Born date" type="number" value={selectedPeople.bornDate}/>
            <TextField id="deathDate" onChange={(e:any) => {selectedPeopleModified.deathDate=e.target.value; setSelectedPeople(selectedPeopleModified)}} label="Death date" type="number" value={selectedPeople.deathDate}/>
            <Button variant="contained" color="primary" onClick={onSubmitPeople}>Add</Button>
        </div>
        <Paper style={{overflow: 'auto', maxHeight: '100%'}}>
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
    </List>
    )
}

export default Menu;