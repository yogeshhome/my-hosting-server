import React from 'react';
import { useState } from 'react';
import '../admin.css'
import Header from './Header'
import Sidebar from './Sidebar';
import Assets from './Assets';

function Inventory() {


  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return <>
    <div className='grid-container'>
      <Header OpenSidebar={toggleSidebar} />

      <Sidebar openSidebarToggle={openSidebarToggle} />
      <Assets />
    </div>
  </>
};


export default Inventory