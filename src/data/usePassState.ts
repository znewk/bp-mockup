import { useEffect, useState } from 'react';
import { readState, type PassState } from './mock';

/**
 * Подписка на состояние демо. Роль SignalR-хаба в макете играет localStorage:
 * фото, снятое посетителем, тут же появляется на странице охранника
 * в соседней вкладке.
 */
export function usePassState(): PassState {
  const [state, setState] = useState<PassState>(readState);

  useEffect(() => {
    const sync = () => setState(readState());
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
    };
  }, []);

  return state;
}
