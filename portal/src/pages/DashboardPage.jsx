import { useEffect, useState } from 'react';
import { getPets, getVeterinaries, getCarePlansByUser } from '../api/client';

export default function DashboardPage() {
  const [pets, setPets] = useState([]);
  const [veterinaries, setVeterinaries] = useState([]);
  const [carePlans, setCarePlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [petsResponse, vetsResponse] = await Promise.all([getPets(), getVeterinaries()]);
        setPets(petsResponse.data || []);
        setVeterinaries(vetsResponse.data || []);

        const userId = Number(localStorage.getItem('elo-vet-user-id') || 1);
        try {
          const carePlansResponse = await getCarePlansByUser(userId);
          setCarePlans(carePlansResponse.data || []);
        } catch {
          setCarePlans([]);
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="card">⏳ Carregando dashboard...</div>;
  }

  return (
    <div className="page-stack">
      <div className="summary-grid">
        <div className="summary-card">
          <span>🐾 Total de pets</span>
          <strong>{pets.length}</strong>
        </div>
        <div className="summary-card">
          <span>⚕️ Veterinários</span>
          <strong>{veterinaries.length}</strong>
        </div>
        <div className="summary-card">
          <span>📋 Planos ativos</span>
          <strong>{carePlans.length}</strong>
        </div>
        <div className="summary-card">
          <span>🟢 Status geral</span>
          <strong>Online</strong>
        </div>
      </div>

      <div className="card">
        <h3>📊 Visão geral</h3>
        <ul className="list">
          <li>🐾 Pets cadastrados: <strong>{pets.length}</strong></li>
          <li>⚕️ Veterinários ativos: <strong>{veterinaries.length}</strong></li>
          <li>📋 Planos de cuidados no sistema: <strong>{carePlans.length}</strong></li>
        </ul>
      </div>
    </div>
  );
}

