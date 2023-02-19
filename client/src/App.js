import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Posts from './components/Posts';
import Register from './components/Register';
import Viewpost from './components/Viewpost';
//FOR TESTING
import Button from "./components/Button";


function App() {
  return (
    <Router>
      <div className="App">
        <Button/>
        <Routes>
          <Route path="/" element={<><h1>Stack Undeflow</h1> <Posts/> </>}/>
          <Route path="/register" element={<><Register/></>}/>
          <Route path="/login" element={<><Login/></>}/>
          <Route path="/post/:postId" element={<Viewpost/>}/>
        </Routes>
        
      </div>
    </Router>
    
  );
}

export default App;
