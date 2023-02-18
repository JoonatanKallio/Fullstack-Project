import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<h1>Hello world</h1>}/>
          <Route path="/register" element={<><Register/></>}/>
        </Routes>
        
      </div>
    </Router>
    
  );
}

export default App;
