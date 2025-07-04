import {Routes, Route} from 'react-router-dom'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import ItemDetails from './pages/ItemDetails';
import PostItem from './pages/PostItem'
import MyListings from './pages/MyListings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:userId" element={<Chat />} />
      <Route path="/items/:id" element={<ItemDetails />} />
      <Route path="/post-item" element={<PostItem />} />
      {/* <Route path="/mylisted" element={<MyListings />} /> */}
    </Routes>
  )
};

export default App;