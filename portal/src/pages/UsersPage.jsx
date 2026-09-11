import { useEffect, useState } from 'react';
import { getUsers, registerUser } from '../api/client';
import { getApiError } from '../utils/errors';

const emptyForm = {
  nomeUsuario: '',
  email: '',
  senha: '',
  confirmaSenha: '',
  tipoUsuario: 'USER',
};

const userRoles = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'USER', label: 'Usuário comum' },
  { value: 'VETERINARIO', label: 'Veterinário' },
  { value: 'RESPONSAVEL', label: 'Responsável por pet' },
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const validate = () => {
    const errors = {};

    if (!form.nomeUsuario?.trim()) {
      errors.nomeUsuario = 'O campo usuário é obrigatório.';
    } else if (form.nomeUsuario.trim().length < 3) {
      errors.nomeUsuario = 'O usuário deve ter no mínimo 3 caracteres.';
    }

    if (!form.email?.trim()) {
      errors.email = 'O campo e-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Informe um e-mail válido.';
    }

    if (!form.senha?.trim()) {
      errors.senha = 'O campo senha é obrigatório.';
    } else if (form.senha.length < 6) {
      errors.senha = 'A senha deve ter no mínimo 6 caracteres.';
    }

    if (!form.confirmaSenha?.trim()) {
      errors.confirmaSenha = 'Confirme a senha.';
    } else if (form.senha !== form.confirmaSenha) {
      errors.confirmaSenha = 'As senhas não correspondem.';
    }

    if (!form.tipoUsuario) {
      errors.tipoUsuario = 'Selecione um tipo de usuário.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!validate()) {
      setSubmitError('Corrija os campos obrigatórios antes de salvar.');
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        nomeUsuario: form.nomeUsuario.trim(),
        email: form.email.trim(),
        senha: form.senha,
        tipoUsuario: form.tipoUsuario,
      });

      setForm(emptyForm);
      setSuccessMessage(`Usuário "${form.nomeUsuario}" cadastrado com sucesso!`);
      await loadUsers();

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setSubmitError(getApiError(error, 'Não foi possível cadastrar o usuário.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="card">
        <h3>Cadastrar novo usuário</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            <span>Nome de usuário</span>
            <input
              name="nomeUsuario"
              value={form.nomeUsuario}
              onChange={handleChange}
              placeholder="admin123"
              className={fieldErrors.nomeUsuario ? 'input-error' : ''}
            />
            {fieldErrors.nomeUsuario && <small className="field-error">{fieldErrors.nomeUsuario}</small>}
          </label>

          <label>
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="usuario@email.com"
              className={fieldErrors.email ? 'input-error' : ''}
            />
            {fieldErrors.email && <small className="field-error">{fieldErrors.email}</small>}
          </label>

          <label>
            <span>Senha</span>
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

          <label>
            <span>Confirmar senha</span>
            <input
              type="password"
              name="confirmaSenha"
              value={form.confirmaSenha}
              onChange={handleChange}
              placeholder="••••••"
              className={fieldErrors.confirmaSenha ? 'input-error' : ''}
            />
            {fieldErrors.confirmaSenha && <small className="field-error">{fieldErrors.confirmaSenha}</small>}
          </label>

          <label>
            <span>Tipo de usuário</span>
            <select value={form.tipoUsuario} onChange={handleChange} className={fieldErrors.tipoUsuario ? 'input-error' : ''}>
              {userRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {fieldErrors.tipoUsuario && <small className="field-error">{fieldErrors.tipoUsuario}</small>}
          </label>

          {submitError && <div className="error-box full-width">{submitError}</div>}
          {successMessage && <div className="success-box full-width">✓ {successMessage}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Criando usuário...' : 'Criar usuário'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Usuários cadastrados ({users.length})</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.idUsuario || user.id}>
                <td>{user.idUsuario || user.id}</td>
                <td>{user.login || user.nomeUsuario}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge badge-${(user.tipoUsuario || 'USER').toLowerCase()}`}>
                    {user.tipoUsuario || 'USER'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

