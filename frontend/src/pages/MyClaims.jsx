import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import ClaimStatusBadge from '../components/claims/ClaimStatusBadge';
import ClaimForm from '../components/claims/ClaimForm';
import { Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const MyClaims = () => {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchClaims = async () => {
        try {
            const response = await axiosInstance.get('/claims/my');
            setClaims(response.data);
        } catch (error) {
            console.error("Failed to fetch claims", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, []);

    const handleCreateSuccess = () => {
        setShowForm(false);
        fetchClaims();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Claims</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage and track your insurance claims</p>
                </div>
                <Button onClick={() => setShowForm(true)}>
                    <Plus className="w-5 h-5 mr-2" />
                    New Claim
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader /></div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <AnimatePresence>
                        {showForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                            >
                                <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.95 }}
                                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-slate-200 dark:border-slate-800"
                                >
                                    <ClaimForm onSuccess={handleCreateSuccess} onCancel={() => setShowForm(false)} />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {claims.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                            <p>No claims found. Create your first claim to get started.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">Claim Number</th>
                                        <th className="px-6 py-4 font-semibold">Description</th>
                                        <th className="px-6 py-4 font-semibold">Amount</th>
                                        <th className="px-6 py-4 font-semibold">Date</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {claims.map((claim) => (
                                        <tr key={claim.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{claim.claimNumber}</td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={claim.description}>{claim.description}</td>
                                            <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">${claim.amount.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(claim.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <ClaimStatusBadge status={claim.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyClaims;
