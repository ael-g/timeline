import {useState, useEffect, useRef} from 'react';
import {Modal, TextField, List} from '@material-ui/core';
import {People} from './types'
import './PeopleEditor.css';

type PeopleEditorParamsType = {
    open: boolean;
    people: People;
    onClose: any;
}

export default function PeopleEditor(params : PeopleEditorParamsType) {
    const {people, open, onClose} = params;
    const nameRef = useRef<HTMLDivElement>(null);

    let [selectedPeople, setSelectedPeople] = useState<People>(people)
    // console.log(selectedPeople)

    const updateKey = <K extends keyof People>(people: People, key: K, value: People[K]) => {
        const p = {...people}
        p[key] = value;
        return p
    }

    const onPeopleModify = (e: any) => {
        if(nameRef.current) {
            console.log(nameRef.current.children[1].children[0])
        }
        const people = updateKey(selectedPeople, e.target.id, e.target.value)
        setSelectedPeople(people)
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >{
            <div className="Editor">
                <div style={{display: "flex", flexDirection: "column"}}>
                    <TextField ref={nameRef} id="name" label="Name" type="string" onChange={onPeopleModify} defaultValue={people.name}/>
                    <TextField id="bornDate" label="Born in" type="number" onChange={onPeopleModify} defaultValue={people.bornDate}/>
                    <TextField id="deathDate" label="Died in" type="number" onChange={onPeopleModify} defaultValue={people.deathDate}/>
                    <TextField id="picture" label="Picture" type="url" onChange={onPeopleModify} defaultValue={people.picture}/>
                    <List>

                    </List>
                </div>
            </div>
        }
        </Modal>
    )
}

