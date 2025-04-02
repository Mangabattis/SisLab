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
        const userEmail = formData.email
        localStorage.setItem('isAuthenticated', 'true');

        const userResponse = await axios.get('http://localhost:8080/usuarios/dados', {
          params: {email: userEmail}
        })

        if(userResponse.status === 200 && userResponse.data){
          sessionStorage.setItem("tipoUsuario", userResponse.data.tipoUsuario)
          sessionStorage.setItem("nome", userResponse.data.nome)
          sessionStorage.setItem("escola", userResponse.data.escola)

          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.erro);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full card">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Sistema de Controle de Instalação</h2>
          <p className="text-gray-600">Entre com suas credenciais para acessar</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="label">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
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
          
          <div className="mb-6">
            <label htmlFor="password" className="label">
              Senha
            </label>
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
            <button type="submit" className="w-full btn btn-primary">
              Entrar
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-800">
                Registre-se
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-sm text-center text-gray-600">
            Para demonstração: <br />
            Admin: admin@example.com / admin123 <br />
            Professor: professor@example.com / prof123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;