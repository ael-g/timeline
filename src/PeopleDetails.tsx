import {useState} from 'react';
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
}


export default function PeopleDetails(params : PeopleDetailsParamsType) {
    const {people, setPeopleSelected} = params;

    const [displayDetails, setDisplayDetails] = useState<Boolean>(false)

    const Details = (params: any) => {
        const {open} = params
        return (
            open ? (
                <div className="PeopleDetails" style={{ left: `${people.left + people.width/2 }%`, "marginTop": `${people.marginTop}vh`, "transform": "translate(-50%, -110%)"}}>
                    <img src={people.picture}></img>
                </div>
            ) : (<div></div>)
        )
    }

    return (
        <div>
            {
                <Details open={displayDetails}/>
            }
            <a  key={people.name}
                onClick={() => setPeopleSelected(people)}
                // onMouseEnter={() => setDisplayDetails(true)} 
                // onMouseLeave={() => setDisplayDetails(false)} 
                className="People" style={{width: `${people.width}%`, left: `${people.left}%`, "marginTop": `${people.marginTop}px`}}>
                <div className="Left">{people.bornDate}</div>
                <div className="Centered">{people.name}</div>
                <div className="Right">{people.deathDate}</div>
            </a>
        </div>
    )
}

