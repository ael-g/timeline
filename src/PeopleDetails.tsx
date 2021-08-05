import {useState} from 'react';
import EditIcon from '@material-ui/icons/Edit';
import './PeopleDetails.css';

type PeopleDetailsParamsType = {
    people: PeopleDisplayType;
    setPeopleSelected: Function;
}

type PeopleDisplayType = {
    id: string;
    name: string;
    width: number;
    left: number;
    marginTop: number;
    bornDate: number;
    deathDate: number;
    picture: string;
    description?: string;
}


export default function PeopleDetails(params : PeopleDetailsParamsType) {
    const {people, setPeopleSelected} = params;

    const [displayDetails, setDisplayDetails] = useState<Boolean>(false)

    return (
        <div
            onMouseEnter={() => setDisplayDetails(true)} 
            onMouseLeave={() => setDisplayDetails(false)}
        >
            {
                // <Details open={displayDetails}/>
            }
            <a  key={people.name}
                onClick={() => setPeopleSelected(people)}
                className="People" style={{width: `${people.width}%`, left: `${people.left}%`, "marginTop": `${people.marginTop}px`}}>
                <div className="Left">{people.bornDate}</div>
                <div className="Centered">
                    <div style={{fontWeight: "bold"}}>{people.name}</div>
                    <div>{people.description}</div>
                </div>
                <div className="Right">{people.deathDate}</div>
            </a>
                {   displayDetails ? 
                        <div 
                        className="EditPeople"
                        style={{ left: `${people.left + people.width + 1 }%`, "marginTop": `${people.marginTop}px`}}>
                            <EditIcon/>
                        </div>
                    :<div></div>
                }
        </div>
    )
}

