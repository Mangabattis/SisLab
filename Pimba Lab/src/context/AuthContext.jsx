import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated in localStorage
    const storedIsAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserRole = localStorage.getItem('userRole');
    const sessionUserRole = sessionStorage.getItem('tipoUsuario');
    
    // Determine which role to use based on available data
    let effectiveRole = storedUserRole;
    
    // If we have a session role but no localStorage role, convert and use it
    if (!effectiveRole && sessionUserRole) {
      effectiveRole = sessionUserRole === 'ADMINISTRADOR' ? 'admin' : 'professor';
      localStorage.setItem('userRole', effectiveRole);
    }
    
    setIsAuthenticated(storedIsAuthenticated);
    setUserRole(effectiveRole);
    setLoading(false);
    
    // Synchronize session storage if needed
    if (effectiveRole && (!sessionUserRole || 
        (effectiveRole === 'admin' && sessionUserRole !== 'ADMINISTRADOR') ||
        (effectiveRole === 'professor' && sessionUserRole !== 'PROFESSOR'))) {
      sessionStorage.setItem('tipoUsuario', effectiveRole === 'admin' ? 'ADMINISTRADOR' : 'PROFESSOR');
    }
  }, []);

  const login = (role) => {
    // Normalize role to our standard format
    const normalizedRole = role === 'ADMINISTRADOR' ? 'admin' : 
                          role === 'PROFESSOR' ? 'professor' : role;
    
    setIsAuthenticated(true);
    setUserRole(normalizedRole);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', normalizedRole);
    
    // Also set in sessionStorage with the expected format
    sessionStorage.setItem('tipoUsuario', normalizedRole === 'admin' ? 'ADMINISTRADOR' : 'PROFESSOR');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('tipoUsuario');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);