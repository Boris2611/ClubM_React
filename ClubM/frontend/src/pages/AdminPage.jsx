import React from 'react';
import AdminPanel from '../components/Admin/AdminPanel';

const AdminPage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <AdminPanel />
        </div>
    );
};

export default AdminPage;