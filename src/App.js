import './App.css';
import {
  BrowserRouter as Router,
} from "react-router-dom";
import Timeline from './Timeline';

function App() {
  return (
  <Router basename={process.env.PUBLIC_URL}>
    <div className="App">
      <Timeline/>
    </div>
  </Router>
  );
}

export default App;
