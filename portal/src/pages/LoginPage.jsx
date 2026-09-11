import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getApiError } from '../utils/errors';

const initialState = {
  nomeUsuario: 'admin1',
  senha: 'adminpass',
};

export default function LoginPage() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const errors = {};

    if (!form.nomeUsuario?.trim()) {
      errors.nomeUsuario = 'O campo usuário é obrigatório.';
    }

    if (!form.senha?.trim()) {
      errors.senha = 'O campo senha é obrigatório.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      setError('Corrija os campos obrigatórios antes de continuar.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await loginUser(form);
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(getApiError(err, 'Credenciais inválidas. Verifique usuário e senha.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-icon large">🐶</div>
          <h1>Elo Vet</h1>
          <p>💚 Portal clínico e de acompanhamento do pet</p>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            <span>👤 Usuário</span>
            <input
              name="nomeUsuario"
              value={form.nomeUsuario}
              onChange={handleChange}
              placeholder="admin1"
              className={fieldErrors.nomeUsuario ? 'input-error' : ''}
            />
            {fieldErrors.nomeUsuario && <small className="field-error">{fieldErrors.nomeUsuario}</small>}
          </label>

          <label>
            <span>🔐 Senha</span>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              placeholder="••••••"
              className={fieldErrors.senha ? 'input-error' : ''}
            />
            {fieldErrors.senha && <small className="field-error">{fieldErrors.senha}</small>}
          </label>

          {error && <div className="error-box">⚠️ {error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Entrando...' : '✅ Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

