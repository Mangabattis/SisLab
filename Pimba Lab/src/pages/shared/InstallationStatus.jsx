// src/pages/shared/InstallationStatus.jsx
import { useState, useEffect } from 'react';
import { FaFilter, FaCheck, FaSpinner, FaTimes, FaUndo } from 'react-icons/fa';

const InstallationStatus = () => {
  const [installations, setInstallations] = useState([]);
  const [filteredInstallations, setFilteredInstallations] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    lab: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const userRole = localStorage.getItem('userRole') || 'professor';

  useEffect(() => {
    // Mock API call to fetch installations
    setTimeout(() => {
      const mockInstallations = [
        {
          id: 1,
          software: 'Visual Studio Code',
          version: '1.78.2',
          lab: 'Laboratório 101',
          requestDate: '2025-03-10',
          requestedBy: 'Maria Silva',
          usageDate: '2025-03-25',
          status: 'completed',
          completionDate: '2025-03-12',
          notes: 'Instalação concluída sem problemas.'
        },
        {
          id: 2,
          software: 'Adobe Photoshop',
          version: '24.0',
          lab: 'Laboratório 205',
          requestDate: '2025-03-15',
          requestedBy: 'João Santos',
          usageDate: '2025-03-30',
          status: 'in_progress',
          completionDate: null,
          notes: 'Instalação em andamento. Problemas com licenciamento.'
        },
        {
          id: 3,
          software: 'MATLAB',
          version: 'R2023a',
          lab: 'Laboratório 103',
          requestDate: '2025-03-08',
          requestedBy: 'Ana Oliveira',
          usageDate: '2025-03-20',
          status: 'completed',
          completionDate: '2025-03-11',
          notes: 'Instalação concluída. Toolboxes adicionais instaladas.'
        },
        {
          id: 4,
          software: 'Python',
          version: '3.11.3',
          lab: 'Laboratório 102',
          requestDate: '2025-03-18',
          requestedBy: 'Carlos Mendes',
          usageDate: '2025-04-05',
          status: 'pending',
          completionDate: null,
          notes: ''
        },
        {
          id: 5,
          software: 'Unity',
          version: '2022.3',
          lab: 'Laboratório 101',
          requestDate: '2025-03-16',
          requestedBy: 'Maria Silva',
          usageDate: '2025-04-10',
          status: 'cancelled',
          completionDate: null,
          notes: 'Cancelado a pedido do professor.'
        }
      ];
      
      setInstallations(mockInstallations);
      setFilteredInstallations(mockInstallations);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter installations based on user role and filter settings
    let filtered = [...installations];
    
    // For professors, only show their own requests
    if (userRole === 'professor') {
      filtered = filtered.filter(item => item.requestedBy === 'Maria Silva'); // Mock user
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(item => item.status === filters.status);
    }
    
    // Apply lab filter
    if (filters.lab !== 'all') {
      filtered = filtered.filter(item => item.lab === filters.lab);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.software.toLowerCase().includes(searchLower) ||
        item.lab.toLowerCase().includes(searchLower) ||
        item.requestedBy.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredInstallations(filtered);
  }, [installations, filters, userRole]);

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const getLabs = () => {
    const labs = new Set(installations.map(item => item.lab));
    return ['all', ...labs];
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="text-green-500" />;
      case 'in_progress':
        return <FaSpinner className="text-blue-500 animate-spin" />;
      case 'pending':
        return <FaSpinner className="text-yellow-500" />;
      case 'cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConfirmUsage = (id) => {
    const updatedInstallations = installations.map(item => 
      item.id === id ? { ...item, status: 'completed', notes: 'Uso confirmado pelo professor.' } : item
    );
    setInstallations(updatedInstallations);
  };

  const handleCancelRequest = (id) => {
    const updatedInstallations = installations.map(item => 
      item.id === id ? { ...item, status: 'cancelled', notes: 'Cancelado pelo usuário.' } : item
    );
    setInstallations(updatedInstallations);
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedInstallations = installations.map(item => 
      item.id === id ? { 
        ...item, 
        status: newStatus,
        completionDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null
      } : item
    );
    setInstallations(updatedInstallations);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Status de Instalações de Software
      </h1>
      
      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="mb-4 md:mb-0 flex-1">
            <label htmlFor="search" className="label text-gray-800">Buscar</label>
            <input
              type="text"
              id="search"
              placeholder="Buscar por software, laboratório ou professor..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input"
            />
          </div>
          
          <div className="mb-4 md:mb-0 md:w-48">
            <label htmlFor="status" className="label">Status</label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendente</option>
              <option value="in_progress">Em Progresso</option>
              <option value="completed">Concluído</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
          
          <div className="md:w-48">
            <label htmlFor="lab" className="label">Laboratório</label>
            <select
              id="lab"
              value={filters.lab}
              onChange={(e) => handleFilterChange('lab', e.target.value)}
              className="input"
            >
              <option value="all">Todos</option>
              {getLabs().filter(lab => lab !== 'all').map(lab => (
                <option key={lab} value={lab}>{lab}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-6 md:mt-0 md:self-end">
            <button
              onClick={() => setFilters({ status: 'all', lab: 'all', search: '' })}
              className="btn btn-secondary flex items-center"
            >
              <FaUndo className="mr-2" />
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
      
      {/* Installations List */}
      <div className="card">
        {isLoading ? (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin text-3xl text-primary-600 mx-auto mb-4" />
            <p className="text-gray-600">Carregando instalações...</p>
          </div>
        ) : filteredInstallations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Software
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laboratório
                  </th>
                  {userRole === 'admin' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitado por
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data da Solicitação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Uso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInstallations.map((installation) => (
                  <tr key={installation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {installation.software}
                      </div>
                      <div className="text-sm text-gray-500">
                        v{installation.version}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{installation.lab}</div>
                    </td>
                    {userRole === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{installation.requestedBy}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(installation.requestDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(installation.usageDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusClass(installation.status)}`}>
                        {getStatusIcon(installation.status)}
                        <span className="ml-1">{getStatusLabel(installation.status)}</span>
                      </div>
                      {installation.notes && (
                        <div className="text-xs text-gray-500 mt-1">
                          {installation.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userRole === 'admin' ? (
                        <div className="flex space-x-2">
                          {installation.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(installation.id, 'in_progress')}
                              className="text-blue-600 hover:text-blue-900 text-xs"
                            >
                              Iniciar Instalação
                            </button>
                          )}
                          {installation.status === 'in_progress' && (
                            <button
                              onClick={() => handleUpdateStatus(installation.id, 'completed')}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              Marcar como Concluído
                            </button>
                          )}
                          {(installation.status === 'pending' || installation.status === 'in_progress') && (
                            <button
                              onClick={() => handleUpdateStatus(installation.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 text-xs"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          {installation.status === 'completed' && (
                            <button
                              onClick={() => handleConfirmUsage(installation.id)}
                              className="text-green-600 hover:text-green-900 text-xs"
                            >
                              Confirmar Uso
                            </button>
                          )}
                          {installation.status === 'pending' && (
                            <button
                              onClick={() => handleCancelRequest(installation.id)}
                              className="text-red-600 hover:text-red-900 text-xs"
                            >
                              Cancelar Solicitação
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FaFilter className="text-3xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Nenhuma instalação encontrada com os filtros selecionados.</p>
            <p className="text-gray-500 text-sm mt-2">Tente ajustar seus filtros ou criar uma nova solicitação.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallationStatus;