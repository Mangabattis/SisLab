import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
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
  const { isAuthenticated, userRole, loading, synchronizeStorageState } = useAuth();
  const location = useLocation();
  
  // Força a sincronização do estado a cada verificação de rota
  useEffect(() => {
    synchronizeStorageState();
  }, [synchronizeStorageState]);
  
  // Handle synchronization with sessionStorage for legacy code compatibility
  const sessionUserRole = sessionStorage.getItem('tipoUsuario');
  const effectiveRole = userRole || (sessionUserRole === 'ADMINISTRADOR' ? 'admin' : 'professor');
  
  console.log("Protected Route:", {
    path: location.pathname,
    isAuthenticated,
    userRole,
    sessionUserRole,
    effectiveRole,
    allowedRoles,
    hasAccess: allowedRoles.length === 0 || allowedRoles.includes(effectiveRole)
  });
  
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(effectiveRole);
  
  if (!hasAccess) {
    console.log(`Acesso negado: ${effectiveRole} tentando acessar rota que requer ${allowedRoles.join(' ou ')}`);
    return <Navigate to="/dashboard" replace />;
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