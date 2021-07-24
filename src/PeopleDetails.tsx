import {useState} from 'react';
import './PeopleDetails.css';

type PeopleDetailsParamsType = {
    people: PeopleDisplayType;
}

type PeopleDisplayType = {
    name: string;
    width: number;
    left: number;
    marginTop: number;
    start: number;
    end: number;
}


export default function PeopleDetails(params : PeopleDetailsParamsType) {
    const {people} = params;

    const [displayDetails, setDisplayDetails] = useState<Boolean>(false)

    return (
        <div>
            {
                displayDetails ? (
                    <div className="PeopleDetails">{people.name}</div>
                ) : (<div></div>)
            }
            <a key={people.name} onClick={() => setDisplayDetails(!displayDetails)} className="People" style={{width: `${people.width}%`, left: `${people.left}%`, "marginTop": `${people.marginTop}vh`}}><div className="Left">{people.start}</div><div className="Centered">{people.name}</div><div className="Right">{people.end}</div></a>
        </div>
    )
}

