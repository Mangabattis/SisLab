// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { FaDesktop, FaDownload, FaCheckCircle, FaExclamationTriangle, FaServer } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSoftware: 0,
    pendingInstallations: 0,
    completedInstallations: 0,
    availableLabs: 0
  });
  
  const [recentRequests, setRecentRequests] = useState([]);
  const userRole = sessionStorage.getItem('tipoUsuario');

  useEffect(() => {
    // Mocking API calls to fetch dashboard data
    setStats({
      totalSoftware: 34,
      pendingInstallations: 5,
      completedInstallations: 28,
      availableLabs: 8
    });
    
    setRecentRequests([
      {
        id: 1,
        softwareName: 'Adobe Photoshop',
        labName: 'Lab 101',
        requestDate: '2025-03-15',
        status: 'pending',
        requestedBy: 'Maria Silva'
      },
      {
        id: 2,
        softwareName: 'MATLAB R2023a',
        labName: 'Lab 205',
        requestDate: '2025-03-14',
        status: 'completed',
        requestedBy: 'João Santos'
      },
      {
        id: 3,
        softwareName: 'Visual Studio 2022',
        labName: 'Lab 103',
        requestDate: '2025-03-10',
        status: 'completed',
        requestedBy: 'Ana Oliveira'
      },
      {
        id: 4,
        softwareName: 'Python 3.11',
        labName: 'Lab 102',
        requestDate: '2025-03-08',
        status: 'pending',
        requestedBy: 'Carlos Mendes'
      }
    ]);
  }, []);
  
  // Filter requests based on user role
  const filteredRequests = userRole === 'PROFESSOR' 
    ? recentRequests.filter(req => req.requestedBy === 'Maria Silva')  // Mock filter for professor
    : recentRequests;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaDesktop className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total de Software</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalSoftware}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <FaDownload className="text-yellow-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Instalações Pendentes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.pendingInstallations}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Instalações Concluídas</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completedInstallations}</p>
          </div>
        </div>
        
        <div className="card flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <FaServer className="text-purple-600 text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Laboratórios Disponíveis</p>
            <p className="text-2xl font-bold text-gray-900">{stats.availableLabs}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Requests Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {userRole === 'ADMINISTRADOR' ? 'Solicitações Recentes' : 'Minhas Solicitações Recentes'}
          </h2>
        </div>
        
        <div className="w-full">
          {/* Hide table on mobile and show cards instead */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Software
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laboratório
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data da Solicitação
                  </th>
                  {userRole === 'ADMINISTRADOR' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitado por
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.softwareName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.labName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(request.requestDate).toLocaleDateString()}</div>
                      </td>
                      {userRole === 'ADMINISTRADOR' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{request.requestedBy}</div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${request.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'}`}>
                          {request.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={userRole === 'ADMINISTRADOR' ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhuma solicitação encontrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div key={request.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">{request.softwareName}</div>
                    <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full 
                      ${request.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                      {request.status === 'completed' ? 'Concluído' : 'Pendente'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Laboratório: {request.labName}</p>
                    <p>Data: {new Date(request.requestDate).toLocaleDateString()}</p>
                    {userRole === 'ADMINISTRADOR' && <p>Solicitado por: {request.requestedBy}</p>}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 p-4">
                Nenhuma solicitação encontrada
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;