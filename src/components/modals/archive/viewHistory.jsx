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
  isOverPaid = false,
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
        isOverPaid={isOverPaid}
        isLoading={isLoading}
        isError={isError}
    />
  )
}

export default ViewHistory