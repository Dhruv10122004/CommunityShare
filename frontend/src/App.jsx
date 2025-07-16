import {Routes, Route} from 'react-router-dom'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import ItemDetails from './pages/ItemDetails';
import PostItem from './pages/PostItem'
import MyListings from './pages/MyListings';
import Bookings from './pages/Bookings';
import EditItem from './pages/EditItem';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
// import axios from 'axios';
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/post-item" element={<PostItem />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/my-bookings" element={<Bookings />} />
        <Route path="/items/:id/edit" element={<EditItem />} />
        <Route path="/messages/:userId" element={<Chat />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
};

export default App;