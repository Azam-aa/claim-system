import ThemeToggle from '../common/ThemeToggle';
import useAuth from '../../hooks/useAuth';
import { Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-10 transition-colors duration-300">
            <div className="h-full px-6 flex items-center justify-between">
                <div className="md:hidden flex items-center">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-3 text-lg font-bold text-primary-600">ClaimSys</span>
                </div>

                <div className="flex items-center space-x-4 ml-auto">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {user?.username || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user?.email || ''}
                        </p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold border border-primary-200 dark:border-primary-700 overflow-hidden">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            user?.username?.charAt(0).toUpperCase() || 'U'
                        )}
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
