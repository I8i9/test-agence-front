import React from 'react'
import { PaymentListModal } from '../contrat/ListPaiementModal';

const ViewHistory = ({ 
  open, 
  onClose, 
  entityType, // "contrat" or "depense"
  id,
  entityNumber,
  totalAmount,
  isForDepense = false,
  useMutate
}) => {
    const { data: paymentsData, isLoading, isError } = useMutate(id , { enabled: open });
    
  return (
    <PaymentListModal
        open={open}
        onClose={onClose}
        entityType={entityType}
        entityNumber={entityNumber}
        totalAmount={totalAmount}
        paymentsData={paymentsData}
        isForDepense={isForDepense}
        isLoading={isLoading}
        isError={isError}
    />
  )
}

export default ViewHistory