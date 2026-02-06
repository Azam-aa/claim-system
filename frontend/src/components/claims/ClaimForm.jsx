import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import axiosInstance from '../../api/axiosInstance';
import { X } from 'lucide-react';

const ClaimForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({ claimNumber: '', description: '', amount: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.claimNumber || !formData.description || !formData.amount) {
            setError("All fields are required");
            setLoading(false);
            return;
        }

        try {
            await axiosInstance.post('/claims', {
                claimNumber: formData.claimNumber,
                description: formData.description,
                amount: parseFloat(formData.amount)
            });
            onSuccess();
        } catch (err) {
            console.error("Failed to create claim", err);
            setError(err.response?.data?.message || "Failed to create claim");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Claim</h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="claimNumber"
                    label="Claim Number"
                    placeholder="e.g. CLM-1001"
                    value={formData.claimNumber}
                    onChange={handleChange}
                />

                <Input
                    id="amount"
                    type="number"
                    label="Amount ($)"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                />

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows="3"
                        className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-white resize-none"
                        placeholder="Describe the claim details..."
                        value={formData.description}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" isLoading={loading}>Submit Claim</Button>
                </div>
            </form>
        </div>
    );
};

export default ClaimForm;
