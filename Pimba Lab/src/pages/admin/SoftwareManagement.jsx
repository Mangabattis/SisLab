// src/pages/admin/SoftwareManagement.jsx
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle } from 'react-icons/fa';

const SoftwareManagement = () => {
  const [software, setSoftware] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSoftware, setCurrentSoftware] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    installationLink: '',
    isFree: false,
    requestDate: '',
    isAvailable: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // Mock API call to fetch software list
    const mockSoftware = [
      {
        id: 1,
        name: 'Visual Studio Code',
        version: '1.78.2',
        installationLink: 'https://code.visualstudio.com/download',
        isFree: true,
        requestDate: '2025-01-15',
        isAvailable: true
      },
      {
        id: 2,
        name: 'Adobe Photoshop',
        version: '24.0',
        installationLink: 'https://www.adobe.com/products/photoshop.html',
        isFree: false,
        requestDate: '2025-02-20',
        isAvailable: true
      },
      {
        id: 3,
        name: 'MATLAB',
        version: 'R2023a',
        installationLink: 'https://www.mathworks.com/products/matlab.html',
        isFree: false,
        requestDate: '2025-01-10',
        isAvailable: true
      },
      {
        id: 4,
        name: 'Python',
        version: '3.11.3',
        installationLink: 'https://www.python.org/downloads/',
        isFree: true,
        requestDate: '2024-12-05',
        isAvailable: true
      }
    ];
    
    setSoftware(mockSoftware);
  }, []);

  const openModal = (software = null) => {
    if (software) {
      setCurrentSoftware(software);
      setFormData({
        name: software.name,
        version: software.version,
        installationLink: software.installationLink,
        isFree: software.isFree,
        requestDate: software.requestDate,
        isAvailable: software.isAvailable
      });
    } else {
      setCurrentSoftware(null);
      setFormData({
        name: '',
        version: '',
        installationLink: '',
        isFree: false,
        requestDate: new Date().toISOString().split('T')[0],
        isAvailable: true
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSoftware(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.version.trim()) errors.version = 'Versão é obrigatória';
    if (!formData.installationLink.trim()) errors.installationLink = 'Link de instalação é obrigatório';
    if (!formData.requestDate) errors.requestDate = 'Data de solicitação é obrigatória';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (currentSoftware) {
      // Update existing software
      const updatedSoftware = software.map(item => 
        item.id === currentSoftware.id ? { ...item, ...formData } : item
      );
      setSoftware(updatedSoftware);
    } else {
      // Add new software
      const newSoftware = {
        id: software.length ? Math.max(...software.map(s => s.id)) + 1 : 1,
        ...formData
      };
      setSoftware([...software, newSoftware]);
    }
    
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleting(true);
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteId(null);
  };

  const handleDelete = () => {
    const updatedSoftware = software.filter(item => item.id !== deleteId);
    setSoftware(updatedSoftware);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const toggleAvailability = (id) => {
    const updatedSoftware = software.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setSoftware(updatedSoftware);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Software</h1>
        <button
          onClick={() => openModal()}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Adicionar Software
        </button>
      </div>

      {/* Software List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Versão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Solicitação
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
              {software.length > 0 ? (
                software.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {item.installationLink}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.version}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.isFree ? 'Software Livre' : 'Proprietário'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(item.requestDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAvailability(item.id)}
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          item.isAvailable
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.isAvailable ? 'Disponível' : 'Indisponível'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(item)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum software encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Software Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {currentSoftware ? 'Editar Software' : 'Adicionar Software'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="label text-gray-500 mr-1">Nome do Software</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${formErrors.name ? 'border-red-500' : 'bg-zinc-300'}`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="version" className="label text-gray-500 mr-1">Versão</label>
                <input
                  type="text"
                  id="version"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className={`input ${formErrors.version ? 'border-red-500' : 'bg-zinc-300'}`}
                />
                {formErrors.version && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.version}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="installationLink" className="label text-gray-500 mr-1">Link para Instalação</label>
                <input
                  type="text"
                  id="installationLink"
                  name="installationLink"
                  value={formData.installationLink}
                  onChange={handleChange}
                  className={`input ${formErrors.installationLink ? 'border-red-500' : 'bg-zinc-300'}`}
                />
                {formErrors.installationLink && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.installationLink}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="requestDate" className="label text-gray-500 mr-1">Data da Solicitação</label>
                <input
                  type="date"
                  id="requestDate"
                  name="requestDate"
                  value={formData.requestDate}
                  onChange={handleChange}
                  className={`input ${formErrors.requestDate ? 'border-red-500' : 'bg-zinc-300'}`}
                />
                {formErrors.requestDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.requestDate}</p>
                )}
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isFree" className="ml-2 block text-sm text-gray-900">
                  Software Livre (não proprietário)
                </label>
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                  Disponível para instalação
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {currentSoftware ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <FaExclamationCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                Confirmar Exclusão
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Tem certeza que deseja excluir este software? Esta ação não pode ser desfeita.
                </p>
              </div>
              <div className="flex justify-center space-x-4 mt-3">
                <button
                  onClick={cancelDelete}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  className="btn bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoftwareManagement;