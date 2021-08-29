import {useState} from 'react';
import './EventDetails.css';

type EventDetailsParamsType = {
    event: EventDisplayType;
}

type EventDisplayType = {
    id: string;
    name: string;
    left: number;
    marginTop: number;
    date: number;
}


export default function EventDetails(params : EventDetailsParamsType) {
    const {event} = params;
    return (
        <div>
            <a  key={event.name}
                className="EventDetails"
                // onClick={() => seteventSelected(event)}
                // onMouseEnter={() => setDisplayDetails(true)} 
                // onMouseLeave={() => setDisplayDetails(false)} 
                style={{width: `100px`, left: `${event.left}%`, "marginTop": `${event.marginTop}px`}}>
                <div>{event.date}</div>
                <div>{event.name}</div>
            </a>
        </div>
    )
}

