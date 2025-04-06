// src/pages/professor/SoftwareRequest.jsx
import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';

const SoftwareRequest = () => {
  const [availableSoftware, setAvailableSoftware] = useState([]);
  const [availableLabs, setAvailableLabs] = useState([]);
  const [selectedSoftware, setSelectedSoftware] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [usageDate, setUsageDate] = useState('');
  const [requestStatus, setRequestStatus] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    //Softwares
    const fetchSoftware = async () => {
      try {
        const response = await fetch('http://localhost:8080/software/listar')
        if(response.status !== 200){
          throw new Error("Erro ao buscar laboratorio")
        }
        const softwares = await response.json()
        setAvailableSoftware(softwares);
      } catch (error) {
        setFormErrors(error)
      }
    }

    fetchSoftware()

    //Laboratorios
    const fetchLabs = async () => {
      try{
        const response = await fetch('http://localhost:8080/laboratorio/listar')
        if(response.status !== 200){
          throw new Error("Erro ao buscar laboratorio")
        }
        const labs = await response.json()
        setAvailableLabs(labs);
      }catch(error){
        setFormErrors(error)
      }
    }
    fetchLabs()

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setUsageDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const addSoftwareToSelection = (softwareId) => {
    const software = availableSoftware.find(s => s.id === softwareId);
    
    // Check if already added
    if (selectedSoftware.some(s => s.id === softwareId)) return;
    
    setSelectedSoftware([...selectedSoftware, software]);
  };

  const removeSoftwareFromSelection = (softwareId) => {
    setSelectedSoftware(selectedSoftware.filter(s => s.id !== softwareId));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!selectedLab) errors.lab = 'Selecione um laboratório';
    if (selectedSoftware.length === 0) errors.software = 'Selecione pelo menos um software';
    if (!usageDate) errors.date = 'Selecione a data de uso';
    
    // Validate date is in the future
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const selectedDate = new Date(usageDate);
    if (selectedDate < currentDate) {
      errors.date = 'A data deve ser futura';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Mock API call to check if software is already installed
    const isAlreadyInstalled = Math.random() < 0.3; // 30% chance software is already installed
    
    if (isAlreadyInstalled) {
      setRequestStatus({
        success: false,
        message: 'Um ou mais softwares selecionados já estão instalados neste laboratório.'
      });
      return;
    }
    
    // Mock successful request
    setRequestStatus({
      success: true,
      message: 'Solicitação de instalação enviada com sucesso. O laboratório ficará indisponível durante o processo de instalação.'
    });
    
    // Reset form after successful submission
    setSelectedSoftware([]);
    setSelectedLab('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Solicitar Instalação de Software</h1>
      
      {/* Request status notification */}
      {requestStatus && (
        <div className={`mb-6 p-4 rounded-md ${
          requestStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {requestStatus.message}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Software List */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Softwares Disponíveis</h2>
          
          <div className="overflow-y-auto max-h-96">
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
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availableSoftware.map((software) => (
                  <tr key={software.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{software.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{software.version}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => addSoftwareToSelection(software.id)}
                        disabled={selectedSoftware.some(s => s.id === software.id)}
                        className={`p-1 rounded-full ${
                          selectedSoftware.some(s => s.id === software.id)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        <FaPlus />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Request Form */}
        <div>
          <form onSubmit={handleSubmit} className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalhes da Solicitação</h2>
            
            <div className="mb-4">
              <label htmlFor="lab" className="label">Laboratório</label>
              <select
                id="lab"
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className={`input ${formErrors.lab ? 'border-red-500' : ''}`}
              >
                <option value="">Selecione um laboratório</option>
                {availableLabs
                  .filter(lab => lab.available)
                  .map(lab => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name} (Capacidade: {lab.capacity})
                    </option>
                  ))
                }
              </select>
              {formErrors.lab && (
                <p className="mt-1 text-sm text-red-600">{formErrors.lab}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="usageDate" className="label">Data de Utilização</label>
              <input
                type="date"
                id="usageDate"
                value={usageDate}
                onChange={(e) => setUsageDate(e.target.value)}
                className={`input ${formErrors.date ? 'border-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="label">Softwares Selecionados</label>
              {formErrors.software && (
                <p className="mt-1 text-sm text-red-600">{formErrors.software}</p>
              )}
              
              {selectedSoftware.length > 0 ? (
                <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {selectedSoftware.map((software) => (
                    <li key={software.id} className="flex justify-between items-center px-4 py-3">
                      <div>
                        <span className="font-medium">{software.name}</span>
                        <span className="text-sm text-gray-500 ml-2">v{software.version}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSoftwareFromSelection(software.id)}
                        className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-500 text-center">
                  Nenhum software selecionado
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full btn btn-primary flex items-center justify-center"
              disabled={selectedSoftware.length === 0 || !selectedLab}
            >
              <FaCheck className="mr-2" />
              Enviar Solicitação
            </button>
          </form>
          
          <div className="card mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Laboratórios Indisponíveis</h2>
            
            {availableLabs.filter(lab => !lab.available).length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {availableLabs
                  .filter(lab => !lab.available)
                  .map(lab => (
                    <li key={lab.id} className="py-3">
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="font-medium">{lab.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Temporariamente indisponível devido a instalações em andamento
                      </p>
                    </li>
                  ))
                }
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Todos os laboratórios estão disponíveis no momento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareRequest;