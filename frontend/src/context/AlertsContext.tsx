import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceAlert } from '../types';
import { alertService } from '../services/api';

interface AlertsContextType {
  alerts: PriceAlert[];
  loading: boolean;
  createAlert: (productId: number, targetPrice: number) => Promise<PriceAlert>;
  removeAlert: (id: number) => Promise<void>;
  refreshAlerts: () => Promise<void>;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAlerts = async () => {
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch {
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const createAlert = async (productId: number, targetPrice: number) => {
    const newAlert = await alertService.createAlert(productId, targetPrice);
    await fetchAlerts();
    return newAlert;
  };

  const removeAlert = async (id: number) => {
    await alertService.deleteAlert(id);
    await fetchAlerts();
  };

  return (
    <AlertsContext.Provider value={{ alerts, loading, createAlert, removeAlert, refreshAlerts: fetchAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) throw new Error('useAlerts must be used within an AlertsProvider');
  return context;
};
