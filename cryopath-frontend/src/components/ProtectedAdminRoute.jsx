import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function ProtectedAdminRoute({children}) {
    const {isAuthenticated, isAdmin, loading} = useAuth();

    if (loading) return null

    if (!isAuthenticated) {
        return <Navigate to="/login"/>;
    }

    if (!isAdmin) {
        return <Navigate to="/"/>;
    }

    return children;
}