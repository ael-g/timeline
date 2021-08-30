import {useState} from 'react';
import {Divider, Modal} from '@material-ui/core';
import {signInPopup, disconnect} from './Authentication'
import firebase from 'firebase';

import './Header.css'

type HeaderParams = {
    // timelineList: TimelineList
}

export default function Header(params : HeaderParams) {
    const [currentUser, setCurrentUser] = useState<any>();
    const [disconnectOpen, setDisconnectOpen] = useState<boolean>(false);
    // const {timelineList} = params;

    firebase.auth().onAuthStateChanged((user) => {
        setCurrentUser(user)
      });

    return (
        <div>
            <div className="Header">
                <a href="/" style={{fontSize: '2rem'}}>TimelinesJS</a>
                {
                    currentUser ? 
                    <div style={{paddingRight: '10px'}}>
                        <img onClick={() => setDisconnectOpen(true)} src={currentUser.photoURL} style={{ borderRadius: '50%', width: '80%' }}/>
                    </div>
                    :<button onClick={() => signInPopup()}>Sign in</button>
                }
                {
                    <Modal
                        open={disconnectOpen}
                        onClose={() => setDisconnectOpen(false)}
                    >{<div style={{
                            display: 'flex',
                            marginTop: '60px',
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