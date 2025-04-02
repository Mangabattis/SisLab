// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/usuarios/login', {
        email: formData.email,
        senha: formData.password,
      });

      if (response.status === 200) {
        const userEmail = formData.email;
        localStorage.setItem('isAuthenticated', 'true');

        const userResponse = await axios.get('http://localhost:8080/usuarios/dados', {
          params: { email: userEmail },
        });

        if (userResponse.status === 200 && userResponse.data) {
          sessionStorage.setItem("tipoUsuario", userResponse.data.tipoUsuario);
          sessionStorage.setItem("nome", userResponse.data.nome);
          sessionStorage.setItem("escola", userResponse.data.escola);

          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.erro);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 m-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800">Sistema de Controle de Instalação</h2>
          <p className="text-gray-600 mt-2">Entre com suas credenciais para acessar</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-indigo-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-indigo-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="mt-8">
            <button 
              type="submit" 
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              Entrar
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                Registre-se
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-center text-gray-600">
            Para demonstração: <br />
            <span className="font-medium">Admin:</span> admin@example.com / admin123 <br />
            <span className="font-medium">Professor:</span> professor@example.com / prof123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;