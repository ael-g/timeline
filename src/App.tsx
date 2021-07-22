import './App.css';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import {useState} from 'react'
import Timeline from './Timeline';
import Menu from './Menu';
import Footer from './Footer';
import Header from './Header';
import {People} from './types';
function App() {

  const[people, setPeople] = useState<Array<People>>([]);

  return (
  <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
      <Header/>
      <div className="Main">
        <div>
          <Menu setPeople={setPeople} people={people}/>
        </div>
        <div>
          <Timeline people={people}/>
        </div>
      </div>
      <div>
        <Footer/>
      </div>
    </div>
  </Router>
  );
}

export default App;
