import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {useState} from 'react'
import Timeline from './Timeline';
import Menu from './Menu';
import Footer from './Footer';
import Header from './Header';
import TimelineListSelector from './TimelineListSelector'
import {People, TimelineList} from './types';


function App() {

  const[people, setPeople] = useState<Array<People>>([]);
  const[timelineLists, setTimelineList] = useState<Array<TimelineList>>([]);

  return (
  <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
      <Header/>
      <Switch>
        <Route path="/timelines/:timelineId">
          <div className="Main">
            <div>
              <Menu setPeople={setPeople} people={people}/>
            </div>
            <div>
              <Timeline people={people}/>
            </div>
          </div>
        </Route>
        <Route path="/">
          <TimelineListSelector setTimelineList={setTimelineList} timelineLists={timelineLists}/>
        </Route>
      </Switch>

      <div>
        <Footer/>
      </div>
    </div>
  </Router>
  );
}

export default App;
