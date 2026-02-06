import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 transition-colors duration-300 font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <Navbar onToggleSidebar={toggleSidebar} />
            <main className="pt-16 md:pl-64 min-h-screen transition-all duration-300">
                <div className="p-6 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden glass"
                    onClick={closeSidebar}
                ></div>
            )}
        </div>
    );
};

export default DashboardLayout;
