import React, { useState, useEffect } from 'react';
import AxiosService from '../utils/AxiosService';
import ApiRoutes from '../utils/ApiRoutes';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill } from 'react-icons/bs';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Cell } from 'recharts';
import toast from 'react-hot-toast';


function Home() {
    const [data, setData] = useState([]);
    const [user, setUser] = useState([]);
    const [alertCount, setAlertCount] = useState(0);

    useEffect(() => {
        fetchData();
        fetchUserData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await AxiosService.get(ApiRoutes.ASSETS.path, {
                authenticate: ApiRoutes.ASSETS.authenticate
            });
            if (res.status === 200) {
                setData(res.data.assets);
                let count = 0;
                res.data.assets.forEach(product => {
                    if (parseInt(product.a_stock) < 5) {
                        count++;
                    }
                });
                setAlertCount(count);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            if (error.response?.status === 402) {
                logout();
            }
        }
    };

    const fetchUserData = async () => {
        try {
            const res = await AxiosService.get(ApiRoutes.USERS.path, {
                authenticate: ApiRoutes.USERS.authenticate
            });
            if (res.status === 200) {
                setUser(res.data.users);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            if (error.response?.status === 402) {
                logout();
            }
        }
    };

    const countUniqueProductNames = () => {
        const uniqueProductNames = new Set(data.map(product => product.a_name));
        return uniqueProductNames.size;
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000', '#FFAF19'];

    return (
        <main className='main-container'>
            <div className='main-title'>
                <h3>DASHBOARD</h3>
            </div>

            <div className='main-cards'>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>PRODUCTS</h3>
                        <BsFillArchiveFill className='card_icon' />
                    </div>
                    <h1>{countUniqueProductNames()}</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>CATEGORIES</h3>
                        <BsFillGrid3X3GapFill className='card_icon' />
                    </div>
                    <h1>10</h1>
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>USERS</h3>
                        <BsPeopleFill className='card_icon' />
                    </div>
                    <h1>{user.length}</h1> {/* Display user count */}
                </div>
                <div className='card'>
                    <div className='card-inner'>
                        <h3>ALERTS</h3>
                        <BsFillBellFill className='card_icon' />
                    </div>
                    <h1>{alertCount}</h1> {/* Display alert count */}
                </div>
            </div>
            <div>
                <h3 style={{ color: 'black', display: 'inline-block' }}>Product Sales and Stock</h3>
                <div className='charts'>

                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="a_name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="a_sales" fill="#8884d8" />
                            <Bar dataKey="a_stock" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div>
            <h3 style={{ color: 'black', display: 'inline-block' }}>Available Product</h3>
            <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="a_stock"
                        nameKey="a_name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={false}
                        innerRadius={40}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Label value="Available Stocks" position="top" />
                    <Tooltip />
                    <Legend />

                </PieChart>
            </ResponsiveContainer>
            </div>
            </div>

        </main>
    )
}

export default Home;
