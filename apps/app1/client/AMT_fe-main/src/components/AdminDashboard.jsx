import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import { BsList } from 'react-icons/bs'; // Missing import

function AdminDashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={toggleSidebar} /> 

      <Sidebar openSidebarToggle={openSidebarToggle} /> {/* Sidebar with Toggle Prop */}
      <Home />
    </div>
  );
}

export default AdminDashboard;
