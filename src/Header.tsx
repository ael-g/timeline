import {useState} from 'react';
import {Divider, Modal} from '@material-ui/core';
import {signInPopup, disconnect} from './BackendController'
import {User} from './types'
import firebase from 'firebase';

import './Header.css'

type HeaderParams = {
    user: User;
    setUser: Function;
}

export default function Header(params : HeaderParams) {
    const {user, setUser} = params;

    const [disconnectOpen, setDisconnectOpen] = useState<boolean>(false);

    firebase.auth().onAuthStateChanged(user => setUser(user));

    return (
        <div>
            <div className="Header">
                <a href="/" style={{fontSize: '2rem'}}>TimelinesJS</a>
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