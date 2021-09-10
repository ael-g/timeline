import React, { useState, useRef } from 'react';
import {
  Modal, List, Typography, ListItem, ListItemText, Divider,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import { People } from './types';
import db from './config/firebase';
import { getPeople as getPeopleFirestore } from './BackendController';
import { getPeople } from './Wikidata';

import './PeopleEditor.css';

type PeopleEditorParamsType = {
    open: boolean;
    timelineId: string;
    setPeople: Function;
    people: any[];
    onClose: any;
}

export default function PeopleEditor(params : PeopleEditorParamsType) {
  const {
    open, onClose, timelineId, setPeople, people,
  } = params;
  const [peopleLocal, setPeopleLocal] = useState<Array<People>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const previousSearch = useRef<AbortController>();

  const onCloseInternal = () => {
    setPeopleLocal([]);
    onClose();
  };

  const onSearch = async (e: any) => {
    setIsLoading(true);
    if (previousSearch.current) {
      previousSearch.current.abort();
    }
    const controller = new AbortController();
    previousSearch.current = controller;

    try {
      const people = await getPeople(e.target.value, controller.signal);
      setPeopleLocal(people);
      setIsLoading(false);
    } catch (e) {
      // properly handle abortion
    }
  };

  const onAddPeople = async (p: People) => {
    const peopleAdd = { ...p, timelineList: timelineId };

    if (!people.map((pe) => pe.name).includes(p.name)) {
      await db.collection('people').add(peopleAdd);
      const peopleFirestore = await getPeopleFirestore({
        id: timelineId,
        name: 'not-used',
        userEmail: '',
      });
      await setPeople(peopleFirestore);
    }
    onCloseInternal();
  };

  return (
    <Modal
      open={open}
      onClose={onCloseInternal}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="PeopleEditor">
          <List>
            <div className="SearchBar">
              { isLoading
                ? <CircularProgress style={{ color: 'grey' }} /> : <Search />}
              <input placeholder="Search people..." type="text" onChange={onSearch} autoFocus />
            </div>
          </List>
          {peopleLocal.length ? <Divider /> : <></>}
          <List style={{ maxHeight: '60vh', overflow: 'scroll' }}>
            {peopleLocal.map((p) => (
              <ListItem button id={p.name} onClick={() => onAddPeople(p)}>
                <ListItemText primary={(
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{
                      display: 'flex', flex: '5', textAlign: 'left', flexDirection: 'column',
                    }}
                    >
                      <div>
                        <Typography style={{ fontSize: '1.5rem' }}>{p.name}</Typography>
                        <Typography style={{ color: 'grey' }}>
                          {p.bornDate}
                          {' '}
                          {p.deathDate}
                        </Typography>
                      </div>
                      <Typography>{p.description}</Typography>
                    </div>
                    <div style={{ display: 'flex', marginRight: '5px' }}>
                      { p.picture
                        ? <img src={p.picture} alt={p.name} />
                        : <></>}
                    </div>
                  </div>
                          )}
                />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </Modal>
  );
}
