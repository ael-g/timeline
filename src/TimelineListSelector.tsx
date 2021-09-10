import {
  List, ListItem, ListItemText, Divider, Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Search, HighlightOff as Delete } from '@material-ui/icons';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  getSignedInUser, getTimelineLists, addTimelineList, deleteTimelineList,
} from './BackendController';
import { TimelineList, User } from './types';
import './TimelineListSelector.css';

type TimelineListSelectorParams = {
    user: User;
}

export default function TimelineListSelector(params: TimelineListSelectorParams) {
  const { user } = params;
  const [userSearch, setUserSearch] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timelineLists, setTimelineLists] = useState<Array<TimelineList>>([]);
  const [displayedTimelineLists, setDisplayedTimelineLists] = useState<Array<TimelineList>>(timelineLists);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const timelineLists = await getTimelineLists();
    setTimelineLists(timelineLists);
    setDisplayedTimelineLists(timelineLists);
    setIsLoading(false);
  };

  const onSelectTimeList = (e: TimelineList) => {
    window.location.assign(`/timelines/${e.id}`);
  };

  const onSearch = async (e: any) => {
    const t = timelineLists.filter((t) => t.name.toLowerCase().match(e.target.value));
    setDisplayedTimelineLists(t);
    setUserSearch(e.target.value);
  };

  const CreateTimeline = () => {
    const createTimeline = async () => {
      const user = await getSignedInUser();
      const userEmail = user ? user.email : 'unable-to-login';

      if (userSearch) {
        const t = {
          name: userSearch,
          userEmail,
        };
        const ret = await addTimelineList(t);
        window.location.assign(`${import.meta.env.PUBLIC_URL}/timelines/${ret.id}`);
      }
    };

    return (
      userSearch
        ? (
          <div>
            <ListItem button onClick={createTimeline} style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography style={{ flex: '10' }}>Create timeline</Typography>
              <Typography style={{ fontStyle: 'italic', flex: '1' }}>{userSearch}</Typography>
            </ListItem>
            <Divider />
          </div>
        )
        : <></>
    );
  };

  const deleteTimeline = async (id: string) => {
    await deleteTimelineList(id);
    window.location.assign(`${import.meta.env.PUBLIC_URL}`);
  };

  const TimelineBar = (params: any) => {
    const [displayDeleteIcon, setDisplayDeleteIcon] = useState<boolean>(false);
    const { timeline } = params;
    const isOwnTimeline = (user && user.email === timeline.userEmail) || false;

    return (
      <ListItem
        id={timeline.name}
        onMouseEnter={() => setDisplayDeleteIcon(isOwnTimeline)}
        onMouseLeave={() => setDisplayDeleteIcon(false)}
        button
        className="ListItem"
      >
        <ListItemText
          key={timeline.name}
          primary={(
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <div
                onClick={() => onSelectTimeList(timeline)}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
              >
                <Typography
                  key={timeline.name}
                  style={{
                    fontSize: '1.5rem',
                    flex: '10 0 0',
                  }}
                >
                  {timeline.name}
                </Typography>
                {
                            isOwnTimeline ? (
                              <div style={{
                                flex: '1 0 0', background: '#4895ef', borderRadius: '25px', color: 'white', padding: '3px 8px 3px 8px', marginLeft: '15px',
                              }}
                              >
                                Yours
                              </div>
                            ) : <></>
                        }
              </div>
              <div style={{ display: (displayDeleteIcon ? 'flex' : 'none'), alignItems: 'center', color: 'grey' }}>
                <Delete onClick={() => deleteTimeline(timeline.id)} />
              </div>
            </div>
              )}
        />
      </ListItem>
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="TimelineListSelector">
        <List>
          <div className="SearchBar">
            { isLoading ? <CircularProgress style={{ color: 'grey' }} />
              : <Search />}
            <input placeholder="Type something to find a timeline or create a new one..." type="text" onChange={onSearch} autoFocus />
          </div>
          <Divider />
          <CreateTimeline />
        </List>
        <List style={{ maxHeight: '40vh', overflow: 'scroll' }}>
          {displayedTimelineLists.map((timeline) => <TimelineBar timeline={timeline} />)}
        </List>
      </div>
    </div>
  );
}
