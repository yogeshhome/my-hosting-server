import React, { useState, useEffect } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify } from 'react-icons/bs';
import Button from 'react-bootstrap/Button';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import useLogout from '../hooks/useLogout';
import toast from 'react-hot-toast';

function Header({ OpenSidebar }) {
    const [data, setData] = useState([]);

    const logout = useLogout();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let role = sessionStorage.getItem('role');
        if (role === 'admin') {
            try {
                const res = await AxiosService.get(ApiRoutes.ASSETS.path, {
                    authenticate: ApiRoutes.ASSETS.authenticate
                });
                if (res.status === 200) {
                    setData(res.data.assets);
                    checkLowStock(res.data.assets);
                }
            } catch (error) {
                handleRequestError(error);
            }
        }
    };

    const checkLowStock = (assets) => {
        assets.forEach(product => {
            if (parseInt(product.a_stock) < 5) {
                toast.error(`${product.a_name} has low stock (${product.a_stock}).`);
            }
        });
    };

    const handleRequestError = (error) => {
        toast.error(error.response?.data?.message || error.message);
        if (error.response?.status === 402) {
            logout();
        }
    };

    return (
        <header className='header'>
            <div className='menu-icon'>
                <BsJustify className='icon' onClick={OpenSidebar} /> {/* Sidebar toggle */}
            </div>
            
            <div className='header-right'>
                <BsFillBellFill className='icon' onClick={fetchData} />
                <BsPersonCircle className='icon' />
            </div>
            <div>
                <Button variant='danger' onClick={logout}>Logout</Button> {/* Logout button */}
            </div>
        </header>
    );
}

export default Header;
