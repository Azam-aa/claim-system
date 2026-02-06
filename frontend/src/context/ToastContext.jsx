import { createContext, useState, useContext, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center p-4 rounded-lg shadow-lg border transform transition-all duration-300 ease-in-out
                            ${toast.type === 'success' ? 'bg-white dark:bg-slate-800 border-green-500 text-green-600 dark:text-green-400' :
                                toast.type === 'error' ? 'bg-white dark:bg-slate-800 border-red-500 text-red-600 dark:text-red-400' :
                                    'bg-white dark:bg-slate-800 border-blue-500 text-blue-600 dark:text-blue-400'}
                        `}
                    >
                        <div className="mr-3">
                            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                            {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                            {toast.type === 'info' && <Info className="w-5 h-5" />}
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="ml-4 hover:opacity-70">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
