import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { loginRequest } from '../../services/authApi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth()
  const navigate = useNavigate()

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      setLoading(true);
      const response = await loginRequest(email, password);
      login({ session: response.session, user: response.user });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/img/logo.png" alt="Cryopath logo" />
        </div>

        <h1 className="login-title">¡Qué bueno verte de nuevo!</h1>
        <p className="login-subtitle">Ingresa para continuar donde lo dejaste</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">
              Correo electrónico<span className="login-asterisk">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.ejemplo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">
              Contraseña<span className="login-asterisk">*</span>
            </label>
            <div className="login-password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="login-eye-button"
                onClick={togglePassword}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-dot">0</span>
          <span className="login-divider-line" />
        </div>

        <p className="login-register-text">
          ¿Primera vez aquí? <a href="/register">Créate una cuenta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
