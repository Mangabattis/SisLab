import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Shared Pages
import Dashboard from '../pages/Dashboard';
import InstallationStatus from '../pages/shared/InstallationStatus';

// Admin Pages
import SoftwareManagement from '../pages/admin/SoftwareManagement';
import ProfessorManagement from '../pages/admin/ProfessorManagement';
import LabConfiguration from '../pages/admin/LabConfiguration';

// Professor Pages
import SoftwareRequest from '../pages/professor/SoftwareRequest';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  
  // Handle synchronization with sessionStorage for legacy code compatibility
  const sessionUserRole = sessionStorage.getItem('tipoUsuario');
  const effectiveRole = userRole || (sessionUserRole === 'ADMINISTRADOR' ? 'admin' : 'professor');
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="installation/status" element={<InstallationStatus />} />
          
          {/* Admin only routes */}
          <Route path="software/manage" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SoftwareManagement />
            </ProtectedRoute>
          } />
          
          <Route path="professors/manage" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProfessorManagement />
            </ProtectedRoute>
          } />
          
          <Route path="lab/config" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <LabConfiguration />
            </ProtectedRoute>
          } />
          
          {/* Professor only routes */}
          <Route path="software/request" element={
            <ProtectedRoute allowedRoles={['professor']}>
              <SoftwareRequest />
            </ProtectedRoute>
          } />
        </Route>
        
        {/* Catch all - redirect to dashboard or login */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;