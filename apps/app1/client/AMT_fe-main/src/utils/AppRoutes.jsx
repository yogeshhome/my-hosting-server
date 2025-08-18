import Login from '../components/Login'
import SignUp from '../components/SignUp'
import AdminDashboard from '../components/AdminDashboard'
import AdminGuard from './AdminGuard'
import UserGuard from './UserGuard'
import Inventory from '../components/Inventory'
import AddAssets from '../components/AddAssets'
import EditAsset from '../components/EditAsset'
import BillForm from '../components/BillForm'
import { Navigate } from 'react-router-dom'



const AppRoutes=[
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/signup',
        element:<SignUp/>
    },
    {
        path:'/admindashboard',
        element:<AdminGuard>
                    <AdminDashboard/>
                </AdminGuard>
    },
    
    {
        path:'/inventory',
        element:<UserGuard>
            <Inventory/>
        </UserGuard>
        
    },
    {
        path:'/addassets',
        element:<AddAssets/>
    },
    
    {
        path:'/editasset/:id',
        element:<EditAsset/>
    },
    {
        path:'/billform',
        element:<BillForm/>
    },
    {
        path:'*',
        element:<Navigate to='/login'/>
    } 
]


export default AppRoutes