import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função central de sincronização entre localStorage e sessionStorage
  const synchronizeStorageState = () => {
    const storedIsAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedUserRole = localStorage.getItem('userRole');
    const sessionUserRole = sessionStorage.getItem('tipoUsuario');
    
    let effectiveAuth = storedIsAuth;
    let effectiveRole = storedUserRole;
    
    // Lógica para sincronizar entre os storages
    if (!effectiveRole && sessionUserRole) {
      // Se não há role no localStorage mas há no sessionStorage
      effectiveRole = sessionUserRole === 'ADMINISTRADOR' ? 'admin' : 'professor';
      effectiveAuth = true;
      
      // Atualiza localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', effectiveRole);
    } else if (effectiveRole) {
      // Se há role no localStorage, verifica se sessionStorage está correto
      const expectedSessionRole = effectiveRole === 'admin' ? 'ADMINISTRADOR' : 'PROFESSOR';
      
      if (sessionUserRole !== expectedSessionRole) {
        // Atualiza sessionStorage
        sessionStorage.setItem('tipoUsuario', expectedSessionRole);
      }
    }
    
    // Atualiza os estados do React
    setIsAuthenticated(effectiveAuth);
    setUserRole(effectiveRole);
    
    return { isAuth: effectiveAuth, role: effectiveRole };
  };

  // Inicialização do estado
  useEffect(() => {
    const state = synchronizeStorageState();
    console.log('Auth state initialized:', state);
    setLoading(false);
  }, []);

  const login = (role) => {
    // Normaliza o formato do role
    const normalizedRole = role === 'ADMINISTRADOR' ? 'admin' : 
                          role === 'PROFESSOR' ? 'professor' : role;
    
    setIsAuthenticated(true);
    setUserRole(normalizedRole);
    
    // Armazena em ambos os storages
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', normalizedRole);
    sessionStorage.setItem('tipoUsuario', normalizedRole === 'admin' ? 'ADMINISTRADOR' : 'PROFESSOR');
    
    console.log('Login successful:', { role: normalizedRole });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    
    // Limpa ambos os storages
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('tipoUsuario');
    
    console.log('Logout successful');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userRole, 
      login, 
      logout, 
      loading,
      synchronizeStorageState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);