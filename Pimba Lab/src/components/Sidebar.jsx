import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaDesktop,
  FaUserTie,
  FaDownload,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  // const userRole = localStorage.getItem('userRole') || 'professor';
  const userRole = sessionStorage.getItem('tipoUsuario');


  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (!isMobileView) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call on initial render
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const adminLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
    { path: '/software/manage', name: 'Gerenciar Softwares', icon: <FaDesktop /> },
    { path: '/professors/manage', name: 'Gerenciar Professores', icon: <FaUserTie /> },
    { path: '/installation/status', name: 'Status de Instalações', icon: <FaClipboardList /> },
    { path: '/lab/config', name: 'Configuração de Laboratórios', icon: <FaCog /> },
  ];

  const professorLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
    { path: '/software/request', name: 'Solicitar Instalação', icon: <FaDownload /> },
    { path: '/installation/status', name: 'Status de Instalações', icon: <FaClipboardList /> },
  ];

  const links = userRole === 'ADMINISTRADOR' ? adminLinks : professorLinks;

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleSidebar}
        className={`
          fixed top-4 left-4 z-50
          p-3 rounded-md bg-primary-600 text-white hover:bg-primary-700
          transition-all duration-200 ease-in-out
          ${!isMobile && 'hidden'}
        `}
        aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-gray-800 text-white
          transition-transform duration-300 ease-in-out
          ${!isOpen && '-translate-x-full'}
          ${isMobile ? 'w-[280px]' : 'w-64'}
          z-50
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center justify-between">
            <h1 className={`text-lg font-bold whitespace-nowrap overflow-hidden
              ${!isOpen && 'lg:hidden'}`}
            >
              SisLab
            </h1>
            {!isOpen && (
              <span className="hidden lg:block text-sm font-bold">SLS</span>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    title={!isOpen ? link.name : ''}
                    className={`
                      flex items-center px-4 py-2.5 hover:bg-gray-700
                      transition-colors duration-200
                      ${location.pathname === link.path ? 'bg-primary-700' : ''}
                      ${!isOpen ? 'lg:justify-center' : ''}
                    `}
                  >
                    <span className="text-xl min-w-[24px]">{link.icon}</span>
                    <span 
                      className={`ml-3 whitespace-nowrap overflow-hidden
                        ${!isOpen && 'lg:hidden'}
                      `}
                    >
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className={`
                flex items-center w-full text-red-400 hover:text-red-300
                transition-colors duration-200
                ${!isOpen ? 'lg:justify-center' : ''}
              `}
            >
              <span className="text-xl min-w-[24px]"><FaSignOutAlt /></span>
              <span className={`ml-3 ${!isOpen && 'lg:hidden'}`}>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
