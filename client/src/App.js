import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Editpost from './components/Editpost';
import Header from './components/Header';
import Login from './components/Login';
import Posts from './components/Posts';
import Register from './components/Register';
import Viewpost from './components/Viewpost';


function App() {
  
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<> <Posts/> </>}/>
          <Route path="/register" element={<><Register/></>}/>
          <Route path="/login" element={<><Login/></>}/>
          <Route path="/post/:postId" element={<Viewpost/>}/>
          <Route path="/post/edit/:postId" element={<Editpost/>}/>
        </Routes>
        
      </div>
    </Router>
    
  );
}

export default App;
