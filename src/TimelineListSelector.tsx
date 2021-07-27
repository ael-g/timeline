import { List, ListItem, ListItemText, Paper, Typography } from "@material-ui/core";
import {useEffect, useState} from 'react'
import db from './config/firebase';
import {TimelineList} from './types';
import './TimelineListSelector.css';

type TimelineListSelectorParams = {
    timelineLists: TimelineList[];
    setTimelineList: Function;
}

export default function TimelineListSelector(params: TimelineListSelectorParams) {
    const {timelineLists, setTimelineList} = params;
    const[selectedTimelineList, setSelectedTimelineList] = useState<TimelineList>({id: '', name: ''});

    useEffect(() => {
        getTimelineLists();
    }, []);

    const getTimelineLists = async () => {
        const col = await db.collection('timelineLists').orderBy('name').get();
        const timelineLists = col.docs.map(p => {return {id: p.id, ...p.data()} as TimelineList})
        setTimelineList(timelineLists);
    }

    const onSelectTimeList = (e: TimelineList) => {
        window.location.assign(`${process.env.PUBLIC_URL}/timelines/${e.id}`);
        // setSelectedTimelineList(e);
        // getPeople(e);
    }

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="TimelineListSelector">
                <List>
                {timelineLists.map((text) => (
                    <ListItem button id={text.name} onClick={() => onSelectTimeList(text)} key={text.name}>
                        <ListItemText primary={<Typography style={{fontSize: "x-large"}}>{text.name}</Typography>}/>
                    </ListItem>
                ))}
                </List>
            </div>
        </div>
    )
}