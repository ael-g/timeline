import { Dialog } from '@material-ui/core';
import { DeleteOutlined as DeleteIcon } from '@material-ui/icons';
import './PeopleDetails.css';
import {getPeople, deletePeople} from './BackendController';
import { People, User } from './types';

type PeopleDetailsParamsType = {
    people: People;
    timelineId: string;
    setPeople: Function;
    open: boolean;
    setIsOpen: any;
}

const PeopleDetails = (params: PeopleDetailsParamsType) => {
    const {people, open, setPeople, setIsOpen, timelineId} = params;

    const onDeletePeople = async () => {
        console.log(people)
        await deletePeople(people)
        const peopleFirestore = await getPeople({
            id: timelineId,
            name: 'not-used',
            userEmail: '',
        });
        await setPeople(peopleFirestore);
        setIsOpen(false);
    }

    return (
        <Dialog
            open={open}
            onClose={() => setIsOpen(false)}
            PaperProps={{
                style: {
                    width: '60%'
                },
              }}
        >
        <div style={{display: 'flex', flexDirection:'column'}}>
            <div style={{display: 'flex', flexDirection:'row'}}>
                <div style={{flex: "1 1 0"}}>
                    <img style={{margin: '10px', maxWidth: '100px', minWidth: '100px', maxHeight: '150px', minHeight: '150px', boxShadow: '-4px 4px 4px 2px grey'}} src={people.picture}/>
                </div>
                <div style={{display: 'flex', flexDirection:'column', flex: "8 1 0"}}>
                    <div style={{fontSize: '2rem'}}>{people.name}</div>
                    <div style={{color: "grey", marginTop: '6px'}}>
                        {people.bornDate}  {people.deathDate}
                    </div>
                    <div style={{marginTop: '30px'}}>
                        {people.description}
                    </div>
                    <div style={{display: 'flex', flexDirection:'row', width: '35%', marginTop: '10px'}}>
                    {people.wikipedia ? <div style={{flex: '1 0 0', textAlign: 'left'}}><a href={people.wikipedia} target="_blank" rel="noopener noreferrer">Wikipedia</a></div>: <></>}
                    {people.wikiquote ? <div style={{flex: '1 0 0', textAlign: 'right'}}><a href={people.wikiquote} target="_blank" rel="noopener noreferrer">Wikiquote</a></div>: <></>}
                    </div>
                </div>
                <div>
                    <DeleteIcon fontSize='large' onClick={()=> onDeletePeople()}/>
                </div>
            </div>
        </div>
        </Dialog>
    )
}

export default PeopleDetails