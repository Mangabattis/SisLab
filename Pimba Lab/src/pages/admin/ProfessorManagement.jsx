// src/pages/admin/ProfessorManagement.jsx
import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExclamationCircle } from 'react-icons/fa';

const ProfessorManagement = () => {
  const [professors, setProfessors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfessor, setCurrentProfessor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    department: '',
    status: 'active'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    // Mock API call to fetch professors list
    const mockProfessors = [
      {
        id: 1,
        name: 'Maria Silva',
        email: 'maria.silva@example.com',
        school: 'Escola de Tecnologias',
        department: 'Ciência da Computação',
        status: 'active'
      },
      {
        id: 2,
        name: 'João Santos',
        email: 'joao.santos@example.com',
        school: 'Escola de Engenharia',
        department: 'Engenharia Elétrica',
        status: 'active'
      },
      {
        id: 3,
        name: 'Ana Oliveira',
        email: 'ana.oliveira@example.com',
        school: 'Escola de Comunicação',
        department: 'Design Digital',
        status: 'active'
      },
      {
        id: 4,
        name: 'Carlos Mendes',
        email: 'carlos.mendes@example.com',
        school: 'Escola de Ciências',
        department: 'Matemática Aplicada',
        status: 'inactive'
      }
    ];
    
    setProfessors(mockProfessors);
  }, []);

  const openModal = (professor = null) => {
    if (professor) {
      setCurrentProfessor(professor);
      setFormData({
        name: professor.name,
        email: professor.email,
        school: professor.school,
        department: professor.department,
        status: professor.status
      });
    } else {
      setCurrentProfessor(null);
      setFormData({
        name: '',
        email: '',
        school: '',
        department: '',
        status: 'active'
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProfessor(null);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    if (!formData.school.trim()) errors.school = 'Escola é obrigatória';
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) errors.email = 'Email inválido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (currentProfessor) {
      // Update existing professor
      const updatedProfessors = professors.map(item => 
        item.id === currentProfessor.id ? { ...item, ...formData } : item
      );
      setProfessors(updatedProfessors);
    } else {
      // Add new professor
      const newProfessor = {
        id: professors.length ? Math.max(...professors.map(p => p.id)) + 1 : 1,
        ...formData
      };
      setProfessors([...professors, newProfessor]);
    }
    
    closeModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    const updatedProfessors = professors.filter(item => item.id !== deleteId);
    setProfessors(updatedProfessors);
    setIsDeleting(false);
    setDeleteId(null);
  };

  const toggleStatus = (id) => {
    const updatedProfessors = professors.map(item => 
      item.id === id ? { 
        ...item, 
        status: item.status === 'active' ? 'inactive' : 'active' 
      } : item
    );
    setProfessors(updatedProfessors);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Professores</h1>
        <button
          onClick={() => openModal()}
          className="btn btn-primary flex items-center"
        >
          <FaPlus className="mr-2" />
          Adicionar Professor
        </button>
      </div>

      {/* Professors List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escola / Departamento
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
              {professors.length > 0 ? (
                professors.map((professor) => (
                  <tr key={professor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{professor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{professor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{professor.school}</div>
                      <div className="text-sm text-gray-500">{professor.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleStatus(professor.id)}
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          professor.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {professor.status === 'active' ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(professor)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => confirmDelete(professor.id)}
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
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum professor encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Professor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {currentProfessor ? 'Editar Professor' : 'Adicionar Professor'}
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
                <label htmlFor="name" className="label text-gray-500 pr-4">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input ${formErrors.name ? 'border-red-500 ' : 'bg-zinc-300'}`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="label text-gray-500 mr-2">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input ${formErrors.email ? 'border-red-500' : 'bg-zinc-300'}`}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="school" className="label text-gray-500 mr-1">Escola:</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className={`input ${formErrors.school ? 'border-red-500' : 'bg-zinc-300'}`}
                  placeholder="Ex: Escola de Tecnologias"
                />
                {formErrors.school && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.school}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="department" className="label text-gray-500 mr-3">Departamento (opcional)</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input bg-zinc-300"
                  placeholder="Ex: Ciência da Computação"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="status" className="label text-gray-500 mr-3">Status:</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input text-gray-500 bg-zinc-300  "
                >
                  <option className='text-green-500' value="active ">Ativo</option>
                  <option value="inactive text-gray-500">Inativo</option>
                </select>
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
                  {currentProfessor ? 'Atualizar' : 'Adicionar'}
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
                  Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.
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

export default ProfessorManagement;