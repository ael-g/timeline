import { List, ListItem, ListItemText, Divider, Typography } from "@material-ui/core";
import {useEffect, useState} from 'react'
import {Search} from '@material-ui/icons';
import db from './config/firebase';
import {TimelineList} from './types';
import './TimelineListSelector.css';

type TimelineListSelectorParams = {
    timelineLists: TimelineList[];
    setTimelineList: Function;
}

export default function TimelineListSelector(params: TimelineListSelectorParams) {
    const {timelineLists, setTimelineList} = params;
    const [userSearch, setUserSearch] = useState<string>()
    const [displayedTimelineLists, setDisplayedTimelineLists] = useState<Array<TimelineList>>(timelineLists)

    useEffect(() => {
        getTimelineLists();
    }, []);

    const getTimelineLists = async () => {
        const col = await db.collection('timelineLists').orderBy('name').get();
        const timelineLists = col.docs.map(p => {return {id: p.id, ...p.data()} as TimelineList})
        setTimelineList(timelineLists);
        setDisplayedTimelineLists(timelineLists);
    }

    const onSelectTimeList = (e: TimelineList) => {
        window.location.assign(`${process.env.PUBLIC_URL}/timelines/${e.id}`);
    }

    const onSearch = async (e: any) => {
        const t = timelineLists.filter(t => 
            t.name.toLowerCase().match(e.target.value)
        )
        setDisplayedTimelineLists(t)
        setUserSearch(e.target.value)
    }

    const CreateTimeline = () => {
        const createTimeline = async () => {
            if(userSearch) {
                const t = {
                    name: userSearch
                }
                const ret = await db.collection('timelineLists').add(t);
                window.location.assign(`${process.env.PUBLIC_URL}/timelines/${ret.id}`);
            }
        }

        return (
            userSearch ?
                <div>
                <ListItem button onClick={createTimeline} style={{display: "flex", flexDirection: "row"}}>
                    <Typography style={{fontSize: "large", flex: "10"}}>Create timeline</Typography>
                    <Typography style={{fontSize: "x-large", fontStyle: "italic", flex: "1"}}>{userSearch}</Typography>
                </ListItem>
                <Divider/>
                </div>
             : <></>
        )
    }

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="TimelineListSelector">
                <List>
                    <div className="SearchBar">
                    <Search/><input type="text" onChange={onSearch} autoFocus></input>
                    </div>
                    <Divider/>
                    {
                    <CreateTimeline/>
                    }
                {displayedTimelineLists.map((text) => (
                    <ListItem button id={text.name} onClick={() => onSelectTimeList(text)} key={text.name}>
                        <ListItemText primary={<Typography style={{fontSize: "x-large"}}>{text.name}</Typography>}/>
                    </ListItem>
                ))}
                </List>
            </div>
        </div>
    )
}