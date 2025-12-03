import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../services/api';

interface UserContextType {
  getStorePoints: (storeId: string) => Promise<number>;
  lastVisitedStore: string | null;
  setLastStore: (storeId: string) => void;
  loadUserData: () => void;
  getCurrentUserId: () => Promise<string | null>;
  getFavoriteStore: () => Promise<any>;
  getEstablishmentRanking: () => Promise<any[]>;
  refreshUserPoints: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [lastVisitedStore, setLastVisitedStore] = useState<string | null>(null);
  const [pointsRefreshTrigger, setPointsRefreshTrigger] = useState(0);

  const loadUserData = async () => {
    try {
      const lastStore = await AsyncStorage.getItem('lastVisitedStore');
      if (lastStore) {
        setLastVisitedStore(lastStore);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const userData = await AsyncStorage.getItem('usuario');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch (error) {
      console.error('Erro ao obter ID do usuário:', error);
    }
    return null;
  };

  const getStorePoints = async (storeId: string): Promise<number> => {
    try {
      const clientId = await getCurrentUserId();
      if (!clientId) return 0;
      
      const response = await ApiService.getClientPointsFromOrders(clientId, storeId);
      return response.points || 0;
    } catch (error) {
      console.error('Erro ao buscar pontos:', error);
      return 0;
    }
  };

  const setLastStore = async (storeId: string) => {
    setLastVisitedStore(storeId);
    try {
      await AsyncStorage.setItem('lastVisitedStore', storeId);
      
      // Atualizar lista de estabelecimentos visitados
      const visited = await AsyncStorage.getItem('visitedEstablishments');
      let visitedList: string[] = visited ? JSON.parse(visited) : [];
      
      // Remover se já existe e adicionar no início
      visitedList = visitedList.filter(id => id !== storeId);
      visitedList.unshift(storeId);
      
      // Manter apenas os últimos 10
      visitedList = visitedList.slice(0, 10);
      
      await AsyncStorage.setItem('visitedEstablishments', JSON.stringify(visitedList));
    } catch (error) {
      console.error('Erro ao salvar última loja:', error);
    }
  };

  const getFavoriteStore = async () => {
    try {
      const clientId = await getCurrentUserId();
      if (!clientId) return null;
      
      const allPoints = await ApiService.getAllUserPoints(clientId);
      return allPoints.length > 0 ? allPoints[0] : null;
    } catch (error) {
      console.error('Erro ao buscar loja favorita:', error);
      return null;
    }
  };

  const getEstablishmentRanking = async () => {
    try {
      const clientId = await getCurrentUserId();
      if (!clientId) return [];
      
      const allPoints = await ApiService.getAllUserPoints(clientId);
      return allPoints;
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      return [];
    }
  };

  const refreshUserPoints = () => {
    setPointsRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <UserContext.Provider value={{ 
      getStorePoints, 
      lastVisitedStore, 
      setLastStore, 
      loadUserData,
      getCurrentUserId,
      getFavoriteStore,
      getEstablishmentRanking,
      refreshUserPoints
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};