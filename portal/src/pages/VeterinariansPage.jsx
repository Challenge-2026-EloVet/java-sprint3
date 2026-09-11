import { useEffect, useState } from 'react';
import { createVeterinary, deleteVeterinary, getUsers, getVeterinaries, updateVeterinary } from '../api/client';
import { getApiError } from '../utils/errors';

const emptyForm = {
  idUsuario: 1,
  nomeCompleto: '',
  cpf: '',
  rg: '',
  dataNascimento: '',
  crmv: '',
  telefone: '',
};

export default function VeterinariansPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const loadVeterinarians = async () => {
    try {
      const response = await getVeterinaries();
      setItems(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar veterinários', error);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await getUsers();
      setAvailableUsers((response.data || []).map((u) => ({
        id: u.idUsuario || u.id,
        login: u.login || u.nomeUsuario || 'Usuário',
      })));
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadVeterinarians();
    loadUsers();
  }, []);

  const validate = () => {
    const errors = {};

    if (!form.idUsuario || Number(form.idUsuario) <= 0) {
      errors.idUsuario = 'O campo id do usuário é obrigatório.';
    } else {
      const userExists = availableUsers.some((u) => u.id === Number(form.idUsuario));
      if (!userExists) {
        errors.idUsuario = `O usuário com ID ${form.idUsuario} não existe no sistema.`;
      }
    }

    if (!form.nomeCompleto?.trim()) {
      errors.nomeCompleto = 'O campo nome completo é obrigatório.';
    }

    if (!form.cpf?.trim()) {
      errors.cpf = 'O campo CPF é obrigatório.';
    } else if (!/^\d{11}$/.test(form.cpf.replace(/\D/g, ''))) {
      errors.cpf = 'O CPF deve conter exatamente 11 dígitos numéricos.';
    }

    if (!form.crmv?.trim()) {
      errors.crmv = 'O campo CRMV é obrigatório.';
    }

    if (form.dataNascimento && new Date(form.dataNascimento) >= new Date()) {
      errors.dataNascimento = 'A data de nascimento deve ser uma data passada.';
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

    if (!validate()) {
      setSubmitError('Corrija os campos obrigatórios antes de salvar.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        idUsuario: Number(form.idUsuario),
      };

      if (editingId) {
        await updateVeterinary(editingId, payload);
      } else {
        await createVeterinary(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadVeterinarians();
    } catch (error) {
      setSubmitError(getApiError(error, 'Não foi possível salvar o veterinário.'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (veterinary) => {
    setEditingId(veterinary.idVeterinario || veterinary.id);
    setForm({
      idUsuario: veterinary.idUsuario || 1,
      nomeCompleto: veterinary.nomeCompleto || '',
      cpf: veterinary.cpf || '',
      rg: veterinary.rg || '',
      dataNascimento: veterinary.dataNascimento || '',
      crmv: veterinary.crmv || '',
      telefone: veterinary.telefone || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja remover este veterinário?')) return;

    try {
      await deleteVeterinary(id);
      await loadVeterinarians();
    } catch (error) {
      setSubmitError(getApiError(error, 'Não foi possível excluir o veterinário.'));
    }
  };

  return (
    <div className="page-stack">
      <div className="card">
        <h3>{editingId ? 'Editar veterinário' : 'Cadastrar veterinário'}</h3>

        {availableUsers.length === 0 && !usersLoading ? (
          <div className="warning-box">
            ⚠️ Nenhum usuário disponível no sistema. Crie um usuário antes de cadastrar um veterinário.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            <span>ID do usuário</span>
            <select
              name="idUsuario"
              value={form.idUsuario}
              onChange={handleChange}
              required
              className={fieldErrors.idUsuario ? 'input-error' : ''}
              disabled={usersLoading || availableUsers.length === 0}
            >
              <option value="">Selecione um usuário</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  ID {user.id} - {user.login}
                </option>
              ))}
            </select>
            {fieldErrors.idUsuario && <small className="field-error">{fieldErrors.idUsuario}</small>}
            {usersLoading && <small className="field-hint">Carregando usuários...</small>}
          </label>

          <label>
            <span>Nome completo</span>
            <input name="nomeCompleto" value={form.nomeCompleto} onChange={handleChange} required className={fieldErrors.nomeCompleto ? 'input-error' : ''} />
            {fieldErrors.nomeCompleto && <small className="field-error">{fieldErrors.nomeCompleto}</small>}
          </label>

          <label>
            <span>CPF</span>
            <input name="cpf" value={form.cpf} onChange={handleChange} required className={fieldErrors.cpf ? 'input-error' : ''} />
            {fieldErrors.cpf && <small className="field-error">{fieldErrors.cpf}</small>}
          </label>

          <label>
            <span>RG</span>
            <input name="rg" value={form.rg} onChange={handleChange} />
          </label>

          <label>
            <span>Data de nascimento</span>
            <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} className={fieldErrors.dataNascimento ? 'input-error' : ''} />
            {fieldErrors.dataNascimento && <small className="field-error">{fieldErrors.dataNascimento}</small>}
          </label>

          <label>
            <span>CRMV</span>
            <input name="crmv" value={form.crmv} onChange={handleChange} required className={fieldErrors.crmv ? 'input-error' : ''} />
            {fieldErrors.crmv && <small className="field-error">{fieldErrors.crmv}</small>}
          </label>

          <label>
            <span>Telefone</span>
            <input name="telefone" value={form.telefone} onChange={handleChange} />
          </label>

          {submitError && <div className="error-box full-width">{submitError}</div>}

          <div className="inline-actions">
            <button type="submit" className="btn btn-primary" disabled={loading || usersLoading || availableUsers.length === 0}>
              {loading ? 'Salvando...' : editingId ? 'Salvar alterações' : 'Cadastrar'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Veterinários cadastrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CRMV</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((veterinary) => (
              <tr key={veterinary.idVeterinario || veterinary.id}>
                <td>{veterinary.nomeCompleto}</td>
                <td>{veterinary.crmv}</td>
                <td>{veterinary.cpf}</td>
                <td>{veterinary.telefone || '-'}</td>
                <td className="actions-cell">
                  <button className="btn btn-secondary btn-small" onClick={() => handleEdit(veterinary)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(veterinary.idVeterinario || veterinary.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
