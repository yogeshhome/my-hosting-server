import React from 'react';
import { Link } from 'react-router-dom';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';
import { RiBillFill } from "react-icons/ri";

function Sidebar({ openSidebarToggle }) { // Removed unnecessary 'OpenSidebar' prop
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive open" : "sidebar-hidden"}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> SHOP
        </div>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/admindashboard">
            <BsGrid1X2Fill className='icon' /> Dashboard
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/products">
            <BsFillArchiveFill className='icon' /> Products
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/billform">
            <RiBillFill className='icon' /> Bill
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/categories">
            <BsFillGrid3X3GapFill className='icon' /> Categories
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/customers">
            <BsPeopleFill className='icon' /> Customers
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/inventory">
            <BsListCheck className='icon' /> Inventory
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/reports">
            <BsMenuButtonWideFill className='icon' /> Reports
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/settings">
            <BsFillGearFill className='icon' /> Settings
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
  