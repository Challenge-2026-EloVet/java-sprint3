import { useEffect, useState } from 'react';
import { createPet, deletePet, getPets, updatePet } from '../api/client';
import { getApiError } from '../utils/errors';

const emptyForm = {
  nome: '',
  especie: '',
  raca: '',
  sexo: 'M',
  dataNascimento: '',
  idadeAproximada: '',
  flagCastrado: true,
};

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const loadPets = async () => {
    try {
      const response = await getPets();
      setPets(response.data || []);
    } catch (error) {
      console.error('Erro ao buscar pets', error);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const validate = () => {
    const errors = {};

    if (!form.nome?.trim()) {
      errors.nome = 'O campo nome é obrigatório.';
    }

    if (!form.especie?.trim()) {
      errors.especie = 'O campo espécie é obrigatório.';
    }

    if (form.sexo && !['M', 'F', 'N'].includes(form.sexo.toUpperCase())) {
      errors.sexo = 'O sexo deve ser M, F ou N.';
    }

    if (form.idadeAproximada !== '' && Number(form.idadeAproximada) < 0) {
      errors.idadeAproximada = 'A idade aproximada não pode ser negativa.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
        idadeAproximada: form.idadeAproximada === '' ? null : Number(form.idadeAproximada),
      };

      if (editingId) {
        await updatePet(editingId, payload);
      } else {
        await createPet(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadPets();
    } catch (error) {
      setSubmitError(getApiError(error, 'Não foi possível salvar o pet.'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pet) => {
    setEditingId(pet.idPet || pet.eloId || pet.id);
    setForm({
      nome: pet.nome || '',
      especie: pet.especie || '',
      raca: pet.raca || '',
      sexo: pet.sexo || 'M',
      dataNascimento: pet.dataNascimento || '',
      idadeAproximada: pet.idadeAproximada ?? '',
      flagCastrado: pet.flagCastrado ?? true,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja remover este pet?')) return;

    try {
      await deletePet(id);
      await loadPets();
    } catch (error) {
      setSubmitError(getApiError(error, 'Não foi possível excluir o pet.'));
    }
  };

  return (
    <div className="page-stack">
      <div className="card">
        <h3>{editingId ? 'Editar pet' : 'Cadastrar pet'}</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            <span>🐾 Nome</span>
            <input name="nome" value={form.nome} onChange={handleChange} required className={fieldErrors.nome ? 'input-error' : ''} />
            {fieldErrors.nome && <small className="field-error">{fieldErrors.nome}</small>}
          </label>

          <label>
            <span>🦁 Espécie</span>
            <input name="especie" value={form.especie} onChange={handleChange} className={fieldErrors.especie ? 'input-error' : ''} />
            {fieldErrors.especie && <small className="field-error">{fieldErrors.especie}</small>}
          </label>

          <label>
            <span>📋 Raça</span>
            <input name="raca" value={form.raca} onChange={handleChange} />
          </label>

          <label>
            <span>⚧️ Sexo</span>
            <select name="sexo" value={form.sexo} onChange={handleChange} className={fieldErrors.sexo ? 'input-error' : ''}>
              <option value="M">♂️ Macho</option>
              <option value="F">♀️ Fêmea</option>
              <option value="N">⚪ Não informado</option>
            </select>
            {fieldErrors.sexo && <small className="field-error">{fieldErrors.sexo}</small>}
          </label>

          <label>
            <span>📅 Data de nascimento</span>
            <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} />
          </label>

          <label>
            <span>🎂 Idade aproximada</span>
            <input type="number" min="0" name="idadeAproximada" value={form.idadeAproximada} onChange={handleChange} className={fieldErrors.idadeAproximada ? 'input-error' : ''} />
            {fieldErrors.idadeAproximada && <small className="field-error">{fieldErrors.idadeAproximada}</small>}
          </label>

          <label className="checkbox-field">
            <input type="checkbox" name="flagCastrado" checked={form.flagCastrado} onChange={handleChange} />
            ✂️ Está castrado?
          </label>

          {submitError && <div className="error-box full-width">❌ {submitError}</div>}

          <div className="inline-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Salvando...' : editingId ? '✏️ Salvar alterações' : '➕ Cadastrar'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                ❌ Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>🐾 Pets cadastrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Espécie</th>
              <th>Raça</th>
              <th>Sexo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.idPet || pet.eloId || pet.id}>
                <td>{pet.nome}</td>
                <td>{pet.especie || '-'}</td>
                <td>{pet.raca || '-'}</td>
                <td>{pet.sexo || '-'}</td>
                <td className="actions-cell">
                  <button className="btn btn-secondary btn-small" onClick={() => handleEdit(pet)}>
                    ✏️ Editar
                  </button>
                  <button className="btn btn-danger btn-small" onClick={() => handleDelete(pet.idPet || pet.eloId || pet.id)}>
                    🗑️ Excluir
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

