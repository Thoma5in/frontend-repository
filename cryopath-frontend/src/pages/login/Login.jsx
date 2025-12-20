import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/img/logo.png" alt="Cryopath logo" />
        </div>

        <h1 className="login-title">¡Qué bueno verte de nuevo!</h1>
        <p className="login-subtitle">Ingresa para continuar donde lo dejaste</p>

        <form className="login-form">
          <div className="login-field">
            <label htmlFor="email">
              Correo electrónico<span className="login-asterisk">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.ejemplo"
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

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>

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
