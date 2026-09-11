import { useEffect, useState } from 'react';
import { getUsers } from '../api/client';

export function useAvailableUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await getUsers();
        setUsers((response.data || []).map((u) => u.idUsuario || u.id));
      } catch (error) {
        console.error('Erro ao carregar usuários', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const userExists = (userId) => users.includes(Number(userId));

  return { users, loading, userExists };
}

