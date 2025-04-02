import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaBuilding } from 'react-icons/fa';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    role: 'PROFESSOR', // Padrão inicial
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/usuarios/registrar', {
        nome: formData.name,
        email: formData.email,
        escola: formData.school,
        senha: formData.password,
        tipoUsuario: formData.role,
      });

      if (!response.status === 200) {
        throw new Error('Erro ao registrar usuário');
      }

      setSuccess(true);
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full card">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Criar Conta</h2>
          <p className="text-gray-600">Preencha os dados para se registrar</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Registro realizado com sucesso! Redirecionando para o login...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="label">Nome Completo</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="label">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input pl-10"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="school" className="label">Escola/Departamento</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaBuilding className="text-gray-400" />
              </div>
              <input
                id="school"
                name="school"
                type="text"
                required
                value={formData.school}
                onChange={handleChange}
                className="input pl-10"
                placeholder="Ex: Escola de Tecnologias"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="label">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="label">Confirmar Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="label">Tipo de Usuário</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="professor"
                  name="role"
                  type="radio"
                  value="PROFESSOR"
                  checked={formData.role === 'PROFESSOR'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="professor" className="ml-2 text-sm text-gray-700">
                  Professor
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="admin"
                  name="role"
                  type="radio"
                  value="ADMINISTRADOR"
                  checked={formData.role === 'ADMINISTRADOR'}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <label htmlFor="admin" className="ml-2 text-sm text-gray-700">
                  Administrador
                </label>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button type="submit" className="w-full btn btn-primary">
              Registrar
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-800">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
