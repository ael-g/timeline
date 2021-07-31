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
import {People, TimelineList, Category} from './types';


function App() {

  const[people, setPeople] = useState<Array<People>>([]);
  const[categories, setCategories] = useState<Array<Category>>([]);
  const[timelineLists, setTimelineList] = useState<Array<TimelineList>>([]);

  return (
  <Router basename={process.env.PUBLIC_URL}>
      <Header/>
      <div className="App">
      <Switch>
        <Route path="/timelines/:timelineId">
          <div className="Main">
            <div>
              <Menu setPeople={setPeople} setCategories={setCategories}/>
            </div>
            <div>
              <Timeline people={people} categories={categories}/>
            </div>
          </div>
        </Route>
        <Route path="/">
          <TimelineListSelector setTimelineList={setTimelineList} timelineLists={timelineLists}/>
        </Route>
      </Switch>
      </div>
      <Footer/>
  </Router>
  );
}

export default App;
