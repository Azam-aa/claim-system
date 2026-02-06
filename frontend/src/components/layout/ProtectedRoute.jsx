import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loader from '../common/Loader';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen w-full bg-slate-50 dark:bg-slate-950">
                <Loader />
            </div>
        );
    }

    // Double check token because isAuthenticated relies on state which might be lagging, but loading handles that.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
