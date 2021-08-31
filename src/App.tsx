import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import {useState} from 'react'
import Timeline from './Timeline';
import Footer from './Footer';
import Header from './Header';
import TimelineListSelector from './TimelineListSelector'
import {User} from './types'

function App() {
  const [user, setUser] = useState<User|null>(null);

  return (
  <Router basename={process.env.PUBLIC_URL}>
      <Header user={user} setUser={setUser}/>
      <div className="App">
      <Switch>
        <Route path="/timelines/:timelineId">
          <Timeline user={user}/>
        </Route>
        <Route path="/">
          <TimelineListSelector user={user}/>
        </Route>
      </Switch>
      </div>
      <Footer/>
  </Router>
  );
}

export default App;
