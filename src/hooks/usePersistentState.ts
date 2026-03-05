
import { useState, useEffect, useRef } from 'react';

interface PersistentStateOptions {
  key: string;
  defaultValue: any;
  serialize?: (value: any) => string;
  deserialize?: (value: string) => any;
}

export const usePersistentState = <T>({
  key,
  defaultValue,
  serialize = JSON.stringify,
  deserialize = JSON.parse,
}: PersistentStateOptions & { defaultValue: T }): [T, (value: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        const parsed = deserialize(stored);
        console.log(`🔄 [usePersistentState] Recuperando estado persistido para ${key}:`, parsed);
        return parsed;
      }
    } catch (error) {
      console.warn(`⚠️ [usePersistentState] Erro ao recuperar estado para ${key}:`, error);
    }
    return defaultValue;
  });

  const isInitialMount = useRef(true);

  // Função para sincronizar estado imediatamente
  const syncState = (newState: T) => {
    try {
      const serialized = serialize(newState);
      localStorage.setItem(key, serialized);
      console.log(`💾 [usePersistentState] Estado sincronizado imediatamente para ${key}:`, newState);
    } catch (error) {
      console.error(`❌ [usePersistentState] Erro ao sincronizar estado para ${key}:`, error);
    }
  };

  // Setter aprimorado com sincronização imediata
  const setStateWithSync = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const newState = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
      
      // Sincronizar imediatamente no localStorage para casos críticos
      if (key.includes('variante') && typeof newState === 'object' && newState !== null) {
        const varianteObj = newState as any;
        if (varianteObj.url_imagem) {
          console.log(`🎯 [usePersistentState] Sincronização crítica de imagem para ${key}:`, varianteObj.url_imagem);
          syncState(newState);
        }
      }
      
      return newState;
    });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    try {
      const serialized = serialize(state);
      localStorage.setItem(key, serialized);
      console.log(`💾 [usePersistentState] Estado salvo para ${key}:`, state);
    } catch (error) {
      console.error(`❌ [usePersistentState] Erro ao salvar estado para ${key}:`, error);
    }
  }, [key, state, serialize]);

  // Listener para mudanças no localStorage (sincronização entre abas/contextos)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = deserialize(e.newValue);
          console.log(`🔄 [usePersistentState] Detectada mudança externa no localStorage para ${key}:`, newValue);
          setState(newValue);
        } catch (error) {
          console.error(`❌ [usePersistentState] Erro ao processar mudança externa para ${key}:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, deserialize]);

  return [state, setStateWithSync];
};

export const clearPersistentState = (key: string) => {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ [usePersistentState] Estado limpo para ${key}`);
  } catch (error) {
    console.error(`❌ [usePersistentState] Erro ao limpar estado para ${key}:`, error);
  }
};

export const forceUpdatePersistentState = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    console.log(`🔧 [usePersistentState] Atualização forçada para ${key}:`, value);
    
    // Disparar evento customizado para notificar outros componentes
    window.dispatchEvent(new CustomEvent('persistentStateUpdate', {
      detail: { key, value }
    }));
  } catch (error) {
    console.error(`❌ [usePersistentState] Erro na atualização forçada para ${key}:`, error);
  }
};
