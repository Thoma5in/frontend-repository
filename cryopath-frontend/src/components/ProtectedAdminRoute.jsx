import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function ProtectedAdminRoute({children}) {
    const {isAuthenticated, canManageProducts, loading} = useAuth();

    if (loading) return null

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    if (!canManageProducts) {
        return <Navigate to="/"/>;
    }

    return children;
}