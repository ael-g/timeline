import { List, ListItem, ListItemText, Divider, Typography } from "@material-ui/core";
import {useEffect, useState} from 'react'
import firebase from 'firebase'
import {Search, HighlightOff as Delete} from '@material-ui/icons';
import db from './config/firebase';
import {getSignedInUser, getSignedInUserWithoutSignin} from './Authentication'
import {TimelineList} from './types';
import './TimelineListSelector.css';

type TimelineListSelectorParams = {
    timelineLists: TimelineList[];
    setTimelineLists: Function;
}

export default function TimelineListSelector(params: TimelineListSelectorParams) {
    const {timelineLists, setTimelineLists} = params;
    const [userSearch, setUserSearch] = useState<string>()
    const [userSignedIn, setUserSignedIn] = useState<firebase.User>()
    const [displayedTimelineLists, setDisplayedTimelineLists] = useState<Array<TimelineList>>(timelineLists)

    useEffect(() => {
        getTimelineLists();
        getUser();
    }, []);

    const getUser = async () => {
        const user = await getSignedInUserWithoutSignin()
        if(user) {
            setUserSignedIn(user)
        }
    }

    const getTimelineLists = async () => {
        const col = await db.collection('timelineLists').orderBy('name').get();
        const timelineLists = col.docs.map(p => {return {id: p.id, ...p.data()} as TimelineList})
        setTimelineLists(timelineLists);
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
            const user = await getSignedInUser()
            const userEmail = user ? user.email : 'unable-to-login'
            
            if(userSearch) {
                const t = {
                    name: userSearch,
                    userEmail,
                }
                const ret = await db.collection('timelineLists').add(t);
                window.location.assign(`${process.env.PUBLIC_URL}/timelines/${ret.id}`);
            }
        }

        return (
            userSearch ?
                <div>
                <ListItem button onClick={createTimeline} style={{display: "flex", flexDirection: "row"}}>
                    <Typography style={{flex: "10"}}>Create timeline</Typography>
                    <Typography style={{fontStyle: "italic", flex: "1"}}>{userSearch}</Typography>
                </ListItem>
                <Divider/>
                </div>
             : <></>
        )
    }

    const deleteTimeline = async (id: string) => {
        // TODO: delete associated people
        await db.collection('timelineLists').doc(id).delete();
        window.location.assign(`${process.env.PUBLIC_URL}`);   
    }

    const TimelineBar = (params: any) => {
        const [displayDeleteIcon, setDisplayDeleteIcon] = useState<Boolean>(false);
        const { timeline } = params;
        const isOwnTimeline = (userSignedIn && userSignedIn.email === timeline.userEmail) || false

        return (
        <ListItem 
            id={timeline.name}
            onMouseEnter={() => setDisplayDeleteIcon(isOwnTimeline)} 
            onMouseLeave={() => setDisplayDeleteIcon(false)}
            button 
            className='ListItem'>
            <ListItemText
                 key={timeline.name}
                 primary={
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Typography onClick={() => onSelectTimeList(timeline)} 
                            key={timeline.name} 
                            style={{
                                fontSize: "1.5rem", 
                                flex: '10 0 0'
                            }}
                            >
                            {timeline.name} - {timeline.userEmail}
                        </Typography>
                        {
                            isOwnTimeline ? <div style={{
                                flex: '1 0 0', background: '#4895ef', borderRadius: '25px', color: 'white', padding: '3px 8px 3px 8px', marginLeft: '15px'
                            }}>Yours</div>:<></>
                        }
                    </div>
                <div style={{display: (displayDeleteIcon ? 'flex':'none'), alignItems: 'center', color: 'grey'}}>
                    <Delete onClick={() => deleteTimeline(timeline.id)}/>
                </div>
                </div>
            }/>
        </ListItem>
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
                </List>
                <List style={{maxHeight: '40vh', overflow: 'scroll'}}>
                {displayedTimelineLists.map((timeline) => <TimelineBar timeline={timeline}/>)}
                </List>
            </div>
        </div>
    )
}