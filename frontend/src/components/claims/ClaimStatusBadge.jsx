import { clsx } from 'clsx';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

const ClaimStatusBadge = ({ status }) => {
    const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';

    const styles = {
        APPROVED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
        SUBMITTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
    };

    const icons = {
        APPROVED: CheckCircle,
        REJECTED: XCircle,
        SUBMITTED: Clock,
        PENDING: AlertCircle,
    };

    const Icon = icons[normalizedStatus] || AlertCircle;
    const currentStyle = styles[normalizedStatus] || 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';

    return (
        <span className={clsx(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
            currentStyle
        )}>
            <Icon className="w-3.5 h-3.5 mr-1.5" />
            {normalizedStatus}
        </span>
    );
};

export default ClaimStatusBadge;
