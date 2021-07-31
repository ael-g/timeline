import {useRef} from 'react';
import db from './config/firebase';
import {Modal, TextField, List, Button, Typography, ListItem, ListItemIcon, ListItemText, Checkbox, Divider} from '@material-ui/core';
import {People, Category} from './types'
import './PeopleEditor.css';

type PeopleEditorParamsType = {
    open: boolean;
    people: People;
    onClose: any;
    categories: Category[];
}

export default function PeopleEditor(params : PeopleEditorParamsType) {
    const {people, open, onClose, categories} = params;
    const idRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const bornDateRef = useRef<HTMLDivElement>(null);
    const deathDateRef = useRef<HTMLDivElement>(null);
    const pictureRef = useRef<HTMLDivElement>(null);

    const onValidate = async () => {
        if (idRef.current && nameRef.current && bornDateRef.current && deathDateRef.current && pictureRef.current) {
            const id = (idRef.current.children[1].children[0] as HTMLInputElement).value as string
            const name = (nameRef.current.children[1].children[0] as HTMLInputElement).value as string
            const bornDate = parseInt((bornDateRef.current.children[1].children[0] as HTMLInputElement).value) as number
            const deathDate = parseInt((deathDateRef.current.children[1].children[0] as HTMLInputElement).value) as number
            const picture = (pictureRef.current.children[1].children[0] as HTMLInputElement).value as string
            const people = {
                name, bornDate, deathDate, picture
            }
            // console.log(people)
            const res = await db.collection('people').doc(id).update(people)
            onClose()
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
        >{
            <div className="Editor">
                <div style={{display: "flex", flexDirection: "column"}}>
                    <TextField ref={idRef} id="id" label="id" type="string" defaultValue={people.id} style={{display: "none"}}/>
                    <TextField ref={nameRef} id="name" label="Name" type="string" defaultValue={people.name}/>
                    <TextField ref={bornDateRef} id="bornDate" label="Born in" type="number" defaultValue={people.bornDate}/>
                    <TextField ref={deathDateRef} id="deathDate" label="Died in" type="number" defaultValue={people.deathDate}/>
                    <TextField ref={pictureRef} id="picture" label="Picture" type="url" defaultValue={people.picture}/>
                    <Typography>Categories</Typography>
                    <Divider/>
                    <List style={{maxHeight: 100, overflow: 'auto'}}>
                    {
                    categories.map(c => 
                        <ListItem style={{height: "25px"}} button>
                            <ListItemIcon> <Checkbox edge="start" checked={false}/></ListItemIcon>
                            <ListItemText primary={c.name} />
                        </ListItem>
                    )
                    }
                    </List>
                    <Divider/>
                    <Button onClick={onValidate}>Validate</Button>
                </div>
            </div>
        }
        </Modal>
    )
}

