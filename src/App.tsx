import './App.css';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Timeline from './Timeline';
import Menu from './Menu';

function App() {
  return (
  <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
      <div>
        <Menu/>
      </div>
      <div>
        <Timeline/>
      </div>
    </div>
  </Router>
  );
}

export default App;
