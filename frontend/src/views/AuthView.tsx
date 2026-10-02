import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthView = () => {
  const { loginUser, registerUser } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);



  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setSuccessMsg(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !password.trim()) {
      setError('Por favor, llena los campos obligatorios.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setError('El nombre completo es requerido.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      const result = registerUser(fullName, email, password);
      if (!result.success) {
        setError(result.message);
      } else {
        setSuccessMsg(result.message + ' Ahora puedes iniciar sesión.');
        setTimeout(() => {
          setMode('login');
          setSuccessMsg(null);
          setPassword('');
        }, 2000);
      }
    } else {
      const result = loginUser(email, password);
      if (!result.success) {
        setError(result.message);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm border-0 p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center h4 mb-4 text-dark">
          {mode === 'login' ? 'Login' : 'Registro'}
        </h2>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {successMsg && <div className="alert alert-success py-2 small">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Nombre Completo</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Juan Pérez"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Correo Electronico*</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Contraseña*</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          {mode === 'register' && (
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Confirmar Contraseña*</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
          )}

          <button type="submit" className="btn btn-success w-100 fw-bold mt-2 py-2">
            {mode === 'login' ? 'Ingresar' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="text-center mt-4 small text-muted">
          {mode === 'login' ? (
            <p className="mb-0">
              ¿No tienes una cuenta?{' '}
              <span onClick={toggleMode} className="text-primary fw-bold style-link" style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Regístrate aquí
              </span>
            </p>
          ) : (
            <p className="mb-0">
              ¿Ya tienes cuenta?{' '}
              <span onClick={toggleMode} className="text-primary fw-bold style-link" style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Inicia sesión
              </span> /
               <span className="text-primary fw-bold style-link">
                Inicia sesión
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
