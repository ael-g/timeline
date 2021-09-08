import {useState, createRef} from 'react';
import {Divider, Modal} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {signInPopup, disconnect, updateTimelineList} from './BackendController'
import {User, TimelineList} from './types'
import firebase from 'firebase';

import './Header.css'

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
    const [isSavingName, setIsSavingName] = useState<string>();


    const timelineNameInput = createRef<HTMLInputElement>();
    const isOwnTimeline = (user && timelineList && user.email === timelineList.userEmail) || false


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
            setIsSavingName(name)
            await updateTimelineList(timelineList, name)
            setTimelineList({
                id: timelineList.id,
                name
            })
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
            setIsSavingName('')
        }, 500)
    }

    return (
        <div>
            <div className="Header">
                <div style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', flex: '10'}}>
                <a href="/" style={{fontSize: '2rem'}}>TimelinesJS</a>
                {
                    timelineList ?
                    <div style={{display:'flex', flexDirection: 'row', justifyContent: 'center', flex: '10'}}>
                        <input
                            type="text"
                            readOnly={!isOwnTimeline}
                            ref={timelineNameInput}
                            onChange={onChangeTimelineName}
                            onFocus={() => setOutlineInput(true)}
                            onBlur={onBlurInput}
                            style={{
                                fontSize: '1.8rem',
                                // width: '400px',
                                background: '#f0f0e9',
                                textAlign: 'center',
                                boxShadow: outlineInput ?'0 0 0 1pt grey':'',
                                borderRadius: '2pt',
                            }}
                            defaultValue={timelineList.name}
                        />
                        <button 
                            onClick={onSaveTimelineName} 
                            style={{
                                visibility: displaySaveTimelineName? 'visible':'hidden',
                                opacity: displaySaveTimelineName? '1':'0',
                                transition: 'visibility 0s linear 200ms, opacity 200ms',
                                marginLeft: '15px',
                            }}
                        >
                            <SaveIcon/>
                        </button>
                    </div>:<></>
                }
                </div>
                {
                    user ? 
                    <div style={{paddingRight: '10px'}}>
                        <img onClick={() => setDisconnectOpen(true)} src={user && user.photoURL ? user.photoURL:''} style={{ borderRadius: '50%', width: '80%' }}/>
                    </div>
                    :<button onClick={() => signInPopup()}>Sign in</button>
                }
                {
                    <Modal
                        open={disconnectOpen}
                        onClose={() => setDisconnectOpen(false)}
                    >{<div style={{
                            display: 'flex',
                            margin: '10% 40%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white'
                        }}>
                        <div>Do you want to disconnect?</div>
                        <button onClick={() => {disconnect(); setDisconnectOpen(false)}}>Yes</button>
                    </div>
                    }</Modal>
                }
                
            </div>
            <Divider/>
        </div>
    )
}