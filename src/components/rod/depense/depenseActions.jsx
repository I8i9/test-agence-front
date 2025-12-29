import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Eye, Trash, CreditCard, ReceiptText, ReceiptIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import PaymentModal from "../../modals/contrat/PayerModal";
import { PaymentListModal } from "../../modals/contrat/ListPaiementModal";
import { usePayDepense } from "../../../api/queries/depense/usePayDepense";
import useFetchPaimentDepense from "../../../api/queries/depense/useFetchPaiementDepense";



export const DepenseActions = ({ 
  id,
  depenseData,
  openDeleteModal, 
  openDetailModal 
}) => {
  const [isPayerDepenseModalOpen, setIsPayerDepenseModalOpen] = useState(false);
  const [isListPaiementModalOpen, setIsListPaiementModalOpen] = useState(false);

  // Hooks for payment functionality
  const { mutate: payDepense, isPending } = usePayDepense();
    const { data: paymentsData, isLoading, isError } = useFetchPaimentDepense(id , { enabled: isListPaiementModalOpen });

  const openPayerDepenseModal = () => setTimeout(() => setIsPayerDepenseModalOpen(true), 200);
  const openListPaiementModal = () => setTimeout(() => setIsListPaiementModalOpen(true), 200);

  const closePayerDepenseModal = () => setIsPayerDepenseModalOpen(false);
  const closeListPaiementModal = () => setIsListPaiementModalOpen(false);

  // Calculate payment status
  const totalPaid = paymentsData?.total_paid || 0;
  const paymentStatus = {
    total_amount: depenseData.montant_depense,
    total_paid: totalPaid,
    rts : depenseData?.rts_depense, 
    remaining_amount: depenseData.remaining_amount,
  };

  // Check if payment is possible (depense is not fully paid)
  const canPay = depenseData?.remaining_amount > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="[&>svg]:!h-5 [&>svg]:!w-5">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent collisionPadding={32} avoidCollisions={true}>
          <DropdownMenuGroup>
            {canPay && (
              <DropdownMenuItem
                className="text-base py-2 px-2 cursor-pointer"
                onClick={openPayerDepenseModal}
              >
                <div className="flex items-center gap-4 leading-none">
                  <CreditCard size={20} />
                  <span>Payer</span>
                </div>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              className="text-base py-2 px-2 cursor-pointer"
              onClick={openListPaiementModal}
            >
              <div className="flex items-center gap-4 leading-none">
                <ReceiptIcon size={20} />
                <span>Liste des paiements</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="text-base py-2 px-2 cursor-pointer" 
              onClick={() => setTimeout(() => openDetailModal(), 200)}
            >
              <div className="flex items-center gap-4 leading-none">
                <Eye size={20} />
                <span>Détails</span>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem 
              className="text-base py-2 px-2 cursor-pointer" 
              onClick={() => setTimeout(() => openDeleteModal(), 200)}
            >
              <div className="flex items-center gap-4 leading-none text-destructive">
                <Trash className="text-destructive" size={20} />
                <span>Supprimer</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Payment Modal */}
      {isPayerDepenseModalOpen && (
        <PaymentModal
          isForDepense={true}
          entityId={id}
          entityType="depense"
          entityNumber={depenseData.sequence_depense}
          open={isPayerDepenseModalOpen}
          onClose={closePayerDepenseModal}
          paymentStatus={paymentStatus}
          onSubmit={payDepense}
          isPending={isPending}
        />
      )}

      {/* Payment List Modal */}
      {isListPaiementModalOpen && (
        <PaymentListModal
          open={isListPaiementModalOpen}
          onClose={closeListPaiementModal}
          entityId={id}
          entityType="depense"
          isForDepense={true}
          entityNumber={depenseData.sequence_depense}
          totalAmount={depenseData.montant_depense}
          paymentsData={paymentsData}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </>
  );
};