// src/pages/admin/LabConfiguration.jsx
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle, FaDesktop, FaLaptop } from 'react-icons/fa';

const LabConfiguration = () => {
  const [labs, setLabs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLab, setCurrentLab] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
    computerCount: 0,
    description: '',
    isAvailable: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [expandedLabId, setExpandedLabId] = useState(null);

  useEffect(() => {
    // Mock API call to fetch labs
    const mockLabs = [
      {
        id: 1,
        name: 'Laboratório 101',
        location: 'Bloco A, Térreo',
        capacity: 30,
        computerCount: 30,
        description: 'Laboratório para aulas de programação',
        isAvailable: true,
        installedSoftware: [
          { id: 1, name: 'Visual Studio Code', version: '1.78.2' },
          { id: 3, name: 'MATLAB', version: 'R2023a' },
          { id: 4, name: 'Python', version: '3.11.3' }
        ]
      },
      {
        id: 2,
        name: 'Laboratório 102',
        location: 'Bloco A, 1º Andar',
        capacity: 25,
        computerCount: 25,
        description: 'Laboratório para aulas de modelagem e simulação',
        isAvailable: true,
        installedSoftware: [
          { id: 3, name: 'MATLAB', version: 'R2023a' },
          { id: 4, name: 'Python', version: '3.11.3' },
          { id: 5, name: 'Unity', version: '2022.3' }
        ]
      },
      {
        id: 3,
        name: 'Laboratório 103',
        location: 'Bloco A, 1º Andar',
        capacity: 20,
        computerCount: 20,
        description: 'Laboratório para aulas de design e computação gráfica',
        isAvailable: true,
        installedSoftware: [
          { id: 2, name: 'Adobe Photoshop', version: '24.0' },
          { id: 5, name: 'Unity', version: '2022.3' }
        ]
      },
      {
        id: 4,
        name: 'Laboratório 205',
        location: 'Bloco B, 2º Andar',
        capacity: 40,
        computerCount: 40,
        description: 'Laboratório para aulas de redes e sistemas distribuídos',
        isAvailable: false,
        installedSoftware: [
          { id: 1, name: 'Visual Studio Code', version: '1.78.2' },
          { id: 4, name: 'Python', version: '3.11.3' },
          { id: 6, name: 'IntelliJ IDEA', version: '2023.1' }
        ]
      }
    ];
    
    setLabs(mockLabs);
  }, []);

  const openModal = (lab = null) => {
    if (lab) {
      setCurrentLab(lab);
      setFormData({
        name: lab.name,
        location: lab.location,
        capacity: lab.capacity,
        computerCount: lab.computerCount,
        description: lab.description,
        isAvailable: lab.isAvailable
      });
    } else {
      setCurrentLab(null);
      setFormData({
        name: '',
        location: '',
        capacity: 0,
        computerCount: 0,
        description: '',
        isAvailable: true
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentLab(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.location.trim()) errors.location = 'Localização é obrigatória';
    if (formData.capacity <= 0) errors.capacity = 'Capacidade deve ser maior que zero';
    if (formData.computerCount <= 0) errors.computerCount = 'Número de computadores deve ser maior que zero';
    if (formData.computerCount > formData.capacity) {
      errors.computerCount = 'Número de computadores não pode exceder a capacidade';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (currentLab) {
      // Update existing lab
      const updatedLabs = labs.map(item => 
        item.id === currentLab.id ? { 
          ...item, 
          ...formData,
          installedSoftware: item.installedSoftware // Keep the installed software unchanged
        } : item
      );
      setLabs(updatedLabs);
    } else {
      // Add new lab
      const newLab = {
        id: labs.length ? Math.max(...labs.map(l => l.id)) + 1 : 1,
        ...formData,
        installedSoftware: [] // New lab has no installed software
      };
      setLabs([...labs, newLab]);
    }
    
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? checked 
        : type === 'number' 
          ? parseInt(value) || 0 
          : value
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
    const updatedLabs = labs.filter(item => item.id !== deleteId);
    setLabs(updatedLabs);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const toggleAvailability = (id) => {
    const updatedLabs = labs.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setLabs(updatedLabs);
  };

  const toggleLabDetails = (id) => {
    setExpandedLabId(expandedLabId === id ? null : id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Configuração de Laboratórios</h1>
        <button
          onClick={() => openModal()}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Adicionar Laboratório
        </button>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <div 
            key={lab.id}
            className={`card relative overflow-hidden transition-shadow duration-300 ${
              expandedLabId === lab.id ? 'ring-2 ring-primary-500 shadow-lg' : ''
            }`}
          >
            {/* Lab Status Badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
              lab.isAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {lab.isAvailable ? 'Disponível' : 'Indisponível'}
            </div>
            
            <div className="flex items-start mb-4">
              <div className="rounded-full bg-primary-100 p-3 mr-4">
                <FaDesktop className="text-primary-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {lab.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {lab.location}
                </p>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-200 py-3 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Capacidade</p>
                  <p className="font-medium">{lab.capacity} pessoas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Computadores</p>
                  <p className="font-medium">{lab.computerCount} unidades</p>
                </div>
              </div>
            </div>
            
            {lab.description && (
              <p className="text-sm text-gray-600 mb-4">
                {lab.description}
              </p>
            )}
            
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => toggleLabDetails(lab.id)}
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                {expandedLabId === lab.id ? 'Ocultar Softwares' : 'Ver Softwares Instalados'}
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(lab)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => confirmDelete(lab.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            {/* Expanded software list */}
            {expandedLabId === lab.id && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Softwares Instalados ({lab.installedSoftware.length})
                </h3>
                
                {lab.installedSoftware.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {lab.installedSoftware.map((software) => (
                      <li key={software.id} className="py-2">
                        <div className="flex items-center">
                          <FaLaptop className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{software.name}</p>
                            <p className="text-xs text-gray-500">Versão {software.version}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    Nenhum software instalado neste laboratório.
                  </p>
                )}
                
                <button
                  onClick={() => toggleAvailability(lab.id)}
                  className={`mt-4 w-full text-center py-2 rounded text-sm font-medium ${
                    lab.isAvailable
                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {lab.isAvailable ? 'Marcar como Indisponível' : 'Marcar como Disponível'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Lab Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {currentLab ? 'Editar Laboratório' : 'Adicionar Laboratório'}
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
                <label htmlFor="name" className="label">Nome do Laboratório</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${formErrors.name ? 'border-red-500' : ''}`}
                  placeholder="Ex: Laboratório 101"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="location" className="label">Localização</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`input ${formErrors.location ? 'border-red-500' : ''}`}
                  placeholder="Ex: Bloco A, Térreo"
                />
                {formErrors.location && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="capacity" className="label">Capacidade (pessoas)</label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={`input ${formErrors.capacity ? 'border-red-500' : ''}`}
                  />
                  {formErrors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="computerCount" className="label">Número de Computadores</label>
                  <input
                    type="number"
                    id="computerCount"
                    name="computerCount"
                    min="1"
                    value={formData.computerCount}
                    onChange={handleChange}
                    className={`input ${formErrors.computerCount ? 'border-red-500' : ''}`}
                  />
                  {formErrors.computerCount && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.computerCount}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="label">Descrição (opcional)</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="input"
                  placeholder="Descreva o laboratório e sua finalidade"
                ></textarea>
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
                  Disponível para uso
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
                  {currentLab ? 'Atualizar' : 'Adicionar'}
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
                  Tem certeza que deseja excluir este laboratório? Esta ação não pode ser desfeita.
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

export default LabConfiguration;