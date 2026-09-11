import { useEffect, useState } from 'react';
import { createCarePlan, getCarePlansByUser, getPets, getVeterinaries, markCarePlanItem } from '../api/client';
import { getApiError } from '../utils/errors';

const initialItem = {
  title: '',
  description: '',
  dueDate: '',
  status: 'PENDING',
};

const initialForm = {
  vetId: 1,
  petId: 1,
  petOwnerId: 1,
  notes: '',
  items: [initialItem],
};

export default function CarePlansPage() {
  const [veterinaries, setVeterinaries] = useState([]);
  const [pets, setPets] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vetsResponse, petsResponse] = await Promise.all([getVeterinaries(), getPets()]);
        setVeterinaries(vetsResponse.data || []);
        setPets(petsResponse.data || []);

        if ((vetsResponse.data || []).length) {
          setForm((prev) => ({ ...prev, vetId: vetsResponse.data[0].idVeterinario || 1 }));
        }

        if ((petsResponse.data || []).length) {
          setForm((prev) => ({ ...prev, petId: petsResponse.data[0].idPet || 1 }));
        }

        const userId = Number(localStorage.getItem('elo-vet-user-id') || 1);
        setForm((prev) => ({ ...prev, petOwnerId: userId }));

        const carePlansResponse = await getCarePlansByUser(userId);
        setPlans(carePlansResponse.data || []);
      } catch (error) {
        console.error('Erro ao carregar care plans', error);
      }
    };

    loadData();
  }, []);

  const validate = () => {
    const errors = {};

    if (!form.petId || Number(form.petId) <= 0) {
      errors.petId = 'Selecione um pet válido.';
    }

    if (!form.petOwnerId || Number(form.petOwnerId) <= 0) {
      errors.petOwnerId = 'Informe o ID do tutor.';
    }

    if (!form.items || form.items.length === 0) {
      errors.items = 'O plano precisa ter pelo menos um item.';
    }

    form.items.forEach((item, index) => {
      if (!item.title?.trim()) {
        errors[`itemTitle_${index}`] = 'O título do item é obrigatório.';
      }

      if (item.dueDate && new Date(item.dueDate) < new Date(new Date().toDateString())) {
        errors[`itemDueDate_${index}`] = 'A data do item deve ser hoje ou no futuro.';
      }
    });

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleItemChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
    setFieldErrors((prev) => ({ ...prev, [`${field}_${index}`]: '' }));
    setSubmitError('');
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { ...initialItem }],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validate()) {
      setSubmitError('Corrija os campos obrigatórios antes de salvar o plano de tratamento.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        petId: Number(form.petId),
        petOwnerId: Number(form.petOwnerId),
        notes: form.notes,
        items: form.items.map((item) => ({
          ...item,
          dueDate: item.dueDate || null,
        })),
      };

      await createCarePlan(Number(form.vetId), payload);
      const carePlansResponse = await getCarePlansByUser(Number(form.petOwnerId));
      setPlans(carePlansResponse.data || []);
      setForm({ ...initialForm, vetId: Number(form.vetId), petId: Number(form.petId), petOwnerId: Number(form.petOwnerId) });
      setFieldErrors({});
    } catch (error) {
      setSubmitError(getApiError(error, 'Não foi possível criar o plano de tratamento.'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (carePlanId, itemId) => {
    try {
      await markCarePlanItem(carePlanId, itemId, { status: 'DONE', note: 'Item concluído pelo portal' });
      const userId = Number(localStorage.getItem('elo-vet-user-id') || 1);
      const response = await getCarePlansByUser(userId);
      setPlans(response.data || []);
    } catch (error) {
      setSubmitError(getApiError(error, 'Não foi possível atualizar o item do plano.'));
    }
  };

  return (
    <div className="page-stack">
      <div className="card">
        <h3>Novo plano de tratamento</h3>

        <form onSubmit={handleSubmit} className="form-grid">
          <label>
            <span>Veterinário</span>
            <select value={form.vetId} onChange={(e) => setForm({ ...form, vetId: Number(e.target.value) })}>
              {veterinaries.map((vet) => (
                <option key={vet.idVeterinario || vet.id} value={vet.idVeterinario || vet.id}>
                  {vet.nomeCompleto}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Pet</span>
            <select value={form.petId} onChange={(e) => setForm({ ...form, petId: Number(e.target.value) })} className={fieldErrors.petId ? 'input-error' : ''}>
              {pets.map((pet) => (
                <option key={pet.idPet || pet.eloId || pet.id} value={pet.idPet || pet.eloId || pet.id}>
                  {pet.nome}
                </option>
              ))}
            </select>
            {fieldErrors.petId && <small className="field-error">{fieldErrors.petId}</small>}
          </label>

          <label>
            <span>ID do tutor</span>
            <input type="number" value={form.petOwnerId} onChange={(e) => setForm({ ...form, petOwnerId: Number(e.target.value) })} className={fieldErrors.petOwnerId ? 'input-error' : ''} />
            {fieldErrors.petOwnerId && <small className="field-error">{fieldErrors.petOwnerId}</small>}
          </label>

          <label className="full-width">
            <span>Observações</span>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="3" />
          </label>

          <div className="full-width">
            <div className="section-header">
              <h4>Itens do plano</h4>
              <button type="button" className="btn btn-secondary btn-small" onClick={addItem}>Adicionar item</button>
            </div>

            {fieldErrors.items && <small className="field-error">{fieldErrors.items}</small>}

            {form.items.map((item, index) => (
              <div key={index} className="item-box">
                <label>
                  <span>Título</span>
                  <input value={item.title} onChange={(e) => handleItemChange(index, 'title', e.target.value)} className={fieldErrors[`itemTitle_${index}`] ? 'input-error' : ''} />
                  {fieldErrors[`itemTitle_${index}`] && <small className="field-error">{fieldErrors[`itemTitle_${index}`]}</small>}
                </label>
                <label>
                  <span>Descrição</span>
                  <input value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                </label>
                <label>
                  <span>Data</span>
                  <input type="date" value={item.dueDate} onChange={(e) => handleItemChange(index, 'dueDate', e.target.value)} className={fieldErrors[`itemDueDate_${index}`] ? 'input-error' : ''} />
                  {fieldErrors[`itemDueDate_${index}`] && <small className="field-error">{fieldErrors[`itemDueDate_${index}`]}</small>}
                </label>
                <label>
                  <span>Status</span>
                  <select value={item.status} onChange={(e) => handleItemChange(index, 'status', e.target.value)}>
                    <option value="PENDING">PENDING</option>
                    <option value="DONE">DONE</option>
                  </select>
                </label>
              </div>
            ))}
          </div>

          {submitError && <div className="error-box full-width">{submitError}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Criar care plan'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Planos de tratamento</h3>
        {plans.length === 0 ? (
          <p>Nenhum plano para este usuário.</p>
        ) : (
          <div className="plan-list">
            {plans.map((plan) => (
              <div key={plan.id} className="plan-item">
                <div className="plan-header">
                  <strong>Plano #{plan.id}</strong>
                  <small>{plan.status}</small>
                </div>
                <p>{plan.notes || 'Sem observações.'}</p>

                <ul>
                  {(plan.items || []).map((item) => (
                    <li key={item.id} className="plan-item-row">
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                      <div className="item-meta">
                        <span>{item.status}</span>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => handleMarkDone(plan.id, item.id)}
                          disabled={item.status === 'DONE'}
                        >
                          {item.status === 'DONE' ? 'Concluído' : 'Marcar como concluído'}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
