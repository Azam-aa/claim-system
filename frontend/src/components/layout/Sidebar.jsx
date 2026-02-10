import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, User, LogOut } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
    const { pathname } = useLocation();
    const { logout } = useAuth();

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'My Claims', path: '/claims', icon: FileText },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    if (useAuth().user?.role === 'ADMIN') {
        links.push({ name: 'Admin Panel', path: '/admin', icon: Home });
    }

    return (
        <div className={clsx(
            "h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col fixed left-0 top-0 transition-transform duration-300 z-30",
            isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                    ClaimSys
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={onClose}
                            className={clsx(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                                isActive
                                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            <Icon className={clsx("w-5 h-5", isActive ? "text-primary-600 dark:text-primary-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300")} />
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={logout}
                    className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
