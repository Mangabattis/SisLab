// src/layouts/DashboardLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      <main className="flex-1 w-full min-h-screen overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;