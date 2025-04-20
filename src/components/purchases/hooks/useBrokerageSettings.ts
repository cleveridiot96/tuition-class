
import { useCallback } from 'react';

export const useBrokerageSettings = (setFormState: any) => {
  const updateBrokerageSettings = useCallback((type: string, value: number) => {
    setFormState(prev => ({
      ...prev,
      brokerageType: type,
      brokerageRate: value
    }));
  }, [setFormState]);

  return { updateBrokerageSettings };
};
