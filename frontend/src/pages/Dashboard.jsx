import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/common/Loader';
import { User, FileText, Activity } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axiosInstance.get('/claims/my');
                const claims = response.data;
                const approved = claims.filter(c => c.status === 'APPROVED').length;
                const rejected = claims.filter(c => c.status === 'REJECTED').length;
                const pending = claims.filter(c => c.status === 'SUBMITTED' || c.status === 'PENDING').length;
                setStats({ total: claims.length, approved, rejected, pending });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><Loader /></div>;

    const statCards = [
        { label: 'Total Claims', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
        { label: 'Approved', value: stats.approved, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
        { label: 'Rejected', value: stats.rejected, icon: Activity, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
        { label: 'Pending', value: stats.pending, icon: Activity, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
    ];

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Overview of your claims and account status
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-transform hover:scale-[1.02]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Details</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Your personal information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Username</label>
                        <div className="text-base font-medium text-slate-900 dark:text-white">{user?.username}</div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email</label>
                        <div className="text-base font-medium text-slate-900 dark:text-white">{user?.email || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
