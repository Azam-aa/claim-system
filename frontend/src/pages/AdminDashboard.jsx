import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import Loader from '../components/common/Loader';
import ClaimStatusBadge from '../components/claims/ClaimStatusBadge';
import { Check, X, Trash2, Users, FileText, Download, Shield, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';

const AdminDashboard = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('claims');
    const [claims, setClaims] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [blockModal, setBlockModal] = useState({ show: false, userId: null });
    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });
    const [reason, setReason] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'claims') {
                const res = await axiosInstance.get('/claims');
                setClaims(res.data);
            } else if (activeTab === 'users') {
                const res = await axiosInstance.get('/users');
                setUsers(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            addToast("Failed to fetch data", 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleUpdateStatus = async (id, status) => {
        try {
            if (status === 'APPROVED') {
                setConfirmModal({
                    show: true,
                    title: 'Approve Claim',
                    message: 'Are you sure you want to approve this claim?',
                    onConfirm: async () => {
                        try {
                            await axiosInstance.put(`/claims/${id}/approve`);
                            addToast('Claim approved successfully', 'success');
                            fetchData();
                        } catch (e) { addToast('Failed to approve claim', 'error'); }
                        setConfirmModal(prev => ({ ...prev, show: false }));
                    }
                });
            } else if (status === 'REJECTED') {
                setRejectModal({ show: true, claimId: id });
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const submitReject = async () => {
        if (!reason) {
            addToast("Please provide a rejection reason", 'error');
            return;
        }
        try {
            await axiosInstance.put(`/claims/${rejectModal.claimId}/reject`, { reason });
            addToast('Claim rejected', 'success');
            setRejectModal({ show: false, claimId: null });
            setReason('');
            fetchData();
        } catch (error) {
            addToast('Failed to reject claim', 'error');
        }
    };

    const handleDeleteClaim = (id) => {
        setConfirmModal({
            show: true,
            title: 'Delete Claim',
            message: 'Are you sure you want to permanently delete this claim? This action cannot be undone.',
            onConfirm: async () => {
                try {
                    await axiosInstance.delete(`/claims/${id}`);
                    addToast('Claim deleted successfully', 'success');
                    fetchData();
                } catch (e) { addToast('Failed to delete claim', 'error'); }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const handleBlockUser = (id) => {
        setBlockModal({ show: true, userId: id });
    };

    const submitBlock = async () => {
        if (!reason) {
            addToast("Reason is required", 'error');
            return;
        }
        try {
            await axiosInstance.put(`/users/${blockModal.userId}/block`, { reason });
            addToast('User blocked successfully', 'success');
            setBlockModal({ show: false, userId: null });
            setReason('');
            fetchData();
        } catch (error) {
            addToast('Failed to block user', 'error');
        }
    };

    const handleUnblockUser = (id) => {
        setConfirmModal({
            show: true,
            title: 'Unblock User',
            message: 'Are you sure you want to unblock this user?',
            onConfirm: async () => {
                try {
                    await axiosInstance.put(`/users/${id}/unblock`);
                    addToast('User unblocked successfully', 'success');
                    fetchData();
                } catch (e) { addToast('Failed to unblock user', 'error'); }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const handleDeleteUser = (id) => {
        setConfirmModal({
            show: true,
            title: 'Delete User',
            message: 'Are you sure you want to permanently delete this user?',
            onConfirm: async () => {
                try {
                    await axiosInstance.delete(`/users/${id}`);
                    addToast('User deleted successfully', 'success');
                    fetchData();
                } catch (e) { addToast('Failed to delete user', 'error'); }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const handleDownloadReport = async (status = '') => {
        try {
            const response = await axiosInstance.get(`/reports/claims/download${status ? `?status=${status}` : ''}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `claims_report_${status || 'all'}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            addToast('Report downloaded successfully', 'success');
        } catch (error) {
            addToast('Failed to download report', 'error');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Shield className="w-8 h-8 text-primary-600" />
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage system claims and users</p>
                </div>
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                    {['claims', 'users', 'reports'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${activeTab === tab
                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                }`}
                        >
                            {tab === 'claims' && <FileText className="w-4 h-4 mr-2" />}
                            {tab === 'users' && <Users className="w-4 h-4 mr-2" />}
                            {tab === 'reports' && <Download className="w-4 h-4 mr-2" />}
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader /></div>
            ) : (
                <>
                    {activeTab === 'claims' && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">Claim #</th>
                                            <th className="px-6 py-4 font-semibold">Description</th>
                                            <th className="px-6 py-4 font-semibold">Amount</th>
                                            <th className="px-6 py-4 font-semibold">Status</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {claims.length === 0 ? (
                                            <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">No claims found</td></tr>
                                        ) : claims.map((claim) => (
                                            <tr key={claim.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{claim.claimNumber}</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">{claim.description}</td>
                                                <td className="px-6 py-4 font-mono text-slate-700 dark:text-slate-300">${claim.amount.toFixed(2)}</td>
                                                <td className="px-6 py-4"><ClaimStatusBadge status={claim.status} /></td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        {(claim.status === 'PENDING' || claim.status === 'SUBMITTED') && (
                                                            <>
                                                                <button onClick={() => handleUpdateStatus(claim.id, 'APPROVED')} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200" title="Approve">
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => handleUpdateStatus(claim.id, 'REJECTED')} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Reject">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => handleDeleteClaim(claim.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg" title="Delete">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">User</th>
                                            <th className="px-6 py-4 font-semibold">Contact</th>
                                            <th className="px-6 py-4 font-semibold">Role/Status</th>
                                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {users.length === 0 ? (
                                            <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No users found</td></tr>
                                        ) : users.filter(u => u.username !== 'admin' && u.role !== 'ADMIN').map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold text-xs overflow-hidden">
                                                            {u.avatarUrl ? (
                                                                <img src={u.avatarUrl} alt={u.username} className="w-full h-full object-cover" />
                                                            ) : (
                                                                u.username.substring(0, 2).toUpperCase()
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-slate-900 dark:text-white">{u.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">{u.role}</span>
                                                        {u.blocked ?
                                                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold">BLOCKED</span> :
                                                            <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-600 text-xs font-semibold">ACTIVE</span>
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    {u.blocked ? (
                                                        <button onClick={() => handleUnblockUser(u.id)} className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg" title="Unblock">
                                                            <UserCheck className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleBlockUser(u.id)} className="p-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg" title="Block">
                                                            <UserX className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg" title="Delete">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Generated Reports</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { label: 'All Claims', status: '', icon: FileText, color: 'primary' },
                                    { label: 'Approved Claims', status: 'APPROVED', icon: Check, color: 'green' },
                                    { label: 'Rejected Claims', status: 'REJECTED', icon: X, color: 'red' }
                                ].map((report, idx) => (
                                    <div key={idx} className="p-6 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-lg transition-all duration-300 group">
                                        <div className={`w-12 h-12 rounded-lg mb-4 flex items-center justify-center ${report.color === 'primary' ? 'bg-blue-100 text-blue-600' :
                                            report.color === 'green' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            <report.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">{report.label}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Generate Excel report for {report.label.toLowerCase()}.</p>
                                        <button
                                            onClick={() => handleDownloadReport(report.status)}
                                            className={`w-full py-2.5 rounded-lg flex items-center justify-center font-medium transition-colors ${report.color === 'primary' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                                report.color === 'green' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                                                }`}
                                        >
                                            <Download className="w-4 h-4 mr-2" /> Download .xlsx
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            <Modal
                isOpen={rejectModal.show}
                onClose={() => setRejectModal({ show: false, claimId: null })}
                title="Reject Claim"
            >
                <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Please provide a reason for rejection. This will be sent to the user.</p>
                    <textarea
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="Rejection reason..."
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setRejectModal({ show: false, claimId: null })} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">Cancel</button>
                        <button onClick={submitReject} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium">Reject Claim</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={blockModal.show}
                onClose={() => setBlockModal({ show: false, userId: null })}
                title="Block User"
            >
                <div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">Please provide a reason for blocking this user.</p>
                    <textarea
                        className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                        placeholder="Blocking reason..."
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setBlockModal({ show: false, userId: null })} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">Cancel</button>
                        <button onClick={submitBlock} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">Block User</button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={confirmModal.show}
                onClose={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                title={confirmModal.title}
            >
                <div>
                    <div className="flex items-center gap-3 mb-4 text-slate-600 dark:text-slate-300">
                        <AlertTriangle className="w-6 h-6 text-orange-500" />
                        <p>{confirmModal.message}</p>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium">Cancel</button>
                        <button onClick={confirmModal.onConfirm} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Confirm</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
