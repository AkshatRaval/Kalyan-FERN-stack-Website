import React, { createContext, useContext, useEffect } from 'react'
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminContext = createContext()

const AdminRoute = ({ children }) => {

    const { userData, loading } = useAuth();
    const navigate = useNavigate();
    if (loading) {
        return <div className="text-center p-10">Checking credentials...</div>;
    }

    const isAdmin = userData && userData.role === 'admin';

    if (!isAdmin) {
        // console.log("Access Denied: User is not an admin. Redirecting...");
        toast.error("Access Denied: User is not an admin. Redirecting...", {
            style: {
                borderRadius: '10px',
                background: '#030213',
                color: '#fff',
            }
        })
        useEffect(() => {
            navigate('/')
        }, [])

        return;
    }
    return children
};

export default AdminRoute