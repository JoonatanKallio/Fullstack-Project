import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreatePost from './components/CreatePost';
import EditComment from './components/EditComment';
import EditPost from './components/EditPost';
import Header from './components/Header';
import Login from './components/Login';
import NoMatchRoute from './components/NoMatchRoute';
import Posts from './components/Posts';
import Register from './components/Register';
import UserInfo from './components/UserInfo';
import ViewPost from './components/ViewPost';

function App() {
  
  return (
    <Router>
      <div className="App">
        <Header/>
        <Routes>
          <Route path="/" element={<><Posts/></>}/>
          <Route path="/register" element={<><Register/></>}/>
          <Route path="/login" element={<><Login/></>}/>
          <Route path="/post/:postId" element={<ViewPost/>}/>
          <Route path="/post/create" element={<CreatePost/>}/>
          <Route path="/post/edit/:postId" element={<EditPost/>}/>
          <Route path="/comment/edit/:commentId" element={<EditComment/>}/>
          <Route path="/user/:userId" element={<UserInfo/>}/>
          <Route path="*" element={<NoMatchRoute/>}/>
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
