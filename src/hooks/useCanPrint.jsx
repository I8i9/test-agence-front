import {  useMemo } from 'react';
import { useStore } from '../store/store';

export const useCanPrint = () => {
  const  user  = useStore((state) => state.user);

  console.log('useCanPrint user ', user);
  const result = useMemo(() => {
    const canPrintOver = user?.agency?.subscription?.includes("Printing_over");
    const canPrintTotal = user?.agency?.subscription?.includes("Printing_total");
    
    // Logic: Must have a config AND at least one of the subscriptions
    const canPrint = !!(user?.config && (canPrintOver || canPrintTotal));

    return {
      canPrint,
      config: user?.config || null,
    };
  }, [user]);

  return result;
};