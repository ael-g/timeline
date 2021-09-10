import {useState, createRef} from 'react';
import {Divider, Modal} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {signInPopup, disconnect, updateTimelineList} from './BackendController'
import {User, TimelineList} from './types'
import firebase from 'firebase';

import './Header.css'
import { grey } from '@material-ui/core/colors';

type HeaderParams = {
    user: User;
    timelineList: TimelineList|null;
    setUser: Function;
    setTimelineList: Function;
}

export default function Header(params : HeaderParams) {
    const {user, setUser, timelineList, setTimelineList} = params;

    const [disconnectOpen, setDisconnectOpen] = useState<boolean>(false);
    const [displaySaveTimelineName, setDisplaySaveTimelineName] = useState<boolean>(false);
    const [outlineInput, setOutlineInput] = useState<boolean>(false);
    // const [isSavingName, setIsSavingName] = useState<string>();


    const timelineNameInput = createRef<HTMLInputElement>();
    const isOwnTimeline = (user && timelineList && user.email === timelineList.userEmail) || false

    let isSavingName = false;

    firebase.auth().onAuthStateChanged(user => setUser(user));

    const onChangeTimelineName = (e:any) => {
        if(!displaySaveTimelineName) {
            setDisplaySaveTimelineName(true)
        }

        if(timelineList && (e.target.value === timelineList.name)) {
            setDisplaySaveTimelineName(false)
        }
    }
    
    const onSaveTimelineName = async () => {
        if(timelineNameInput && timelineNameInput.current && timelineList) {
            const name = timelineNameInput.current.value;
            isSavingName = true
            await updateTimelineList(timelineList, name)
            // setTimelineList({
            //     id: timelineList.id,
            //     name
            // })
            // timelineNameInput.current.value = name;
        }
        setDisplaySaveTimelineName(false)
    }

    const onBlurInput = (e:any) => {
        setTimeout(() => {
            if(timelineList && !isSavingName) {
                e.target.value = timelineList.name;
            }
            setOutlineInput(false)
            setDisplaySaveTimelineName(false)
        }, 500)
    }

    return (
        <div className="Header">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row', 
                flexWrap: 'wrap'
            }}>
            <a href="/" style={{fontSize: '1.5rem', paddingRight: '30px'}}>TimelinesJS</a>
            {
                timelineList ?
                <div style={{display: 'flex'}}>
                    <input
                        type="text"
                        readOnly={!isOwnTimeline}
                        ref={timelineNameInput}
                        onChange={onChangeTimelineName}
                        onFocus={() => setOutlineInput(true)}
                        onBlur={onBlurInput}
                        style={{
                            fontSize: '1.7rem',
                            color: 'grey',
                            width: '260px',
                            background: '#f0f0e9',
                            boxShadow: outlineInput ?'0 0 0 1pt grey':'',
                            borderRadius: '2pt',
                            marginRight: '10px',
                        }}
                        defaultValue={timelineList.name}
                    />
                    <button
                        onClick={onSaveTimelineName} 
                        style={{
                            visibility: displaySaveTimelineName? 'visible':'hidden',
                            opacity: displaySaveTimelineName? '1':'0',
                            transition: 'visibility 0s linear 200ms, opacity 200ms',
                        }}
                    >
                        <SaveIcon/>
                    </button>
                </div>:<></>
            }
            </div>
            <div style={{paddingRight: '20px', display: 'flex', alignItems: 'center'}}>
            {
                user ? 
                    <img 
                        onClick={() => setDisconnectOpen(true)} src={user && user.photoURL ? user.photoURL:''} 
                        style={{ borderRadius: '50%', maxWidth: '55px'}}
                    />
                    :<button onClick={() => signInPopup()}>Sign in</button>
                }
            </div>
            {
                <Modal
                    open={disconnectOpen}
                    onClose={() => setDisconnectOpen(false)}
                >
                    <div style={{right: '0px', top: '60px', position: 'fixed'}}>
                        <button style={{fontSize: 'large'}}
                            onClick={() => {disconnect(); setDisconnectOpen(false)}}>
                            Disconnect
                        </button>
                    </div>
                </Modal>
            } 
        </div>
    )
}