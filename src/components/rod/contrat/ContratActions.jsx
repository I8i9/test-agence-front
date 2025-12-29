import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Eye, RefreshCcw, Ban, ReceiptText, CheckCircle, CreditCard, Maximize2, CalendarPlus2, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CloturerContratModal } from "../../modals/contrat/CloturerContratModal";
import { PaymentListModal } from "../../modals/contrat/ListPaiementModal";
import { RenouvellerContratModal } from "../../modals/contrat/RenouvellerContratModal";
import PaymentModal from "../../modals/contrat/PayerModal";
import { ResilierContratModal } from "../../modals/contrat/ResilierContratModal";
import DetailContratModal from "../../modals/contrat/DetailContratModal/DetailContratModal";
import { usePayContrat } from "../../../api/queries/contrat/usePayContrat";
import useFetchPaimentContrat from "../../../api/queries/contrat/useFetchPaiementContrat";
import RefundModal from "../../modals/contrat/DetailContratModal/RefundModal";

const ContratActions = ({ id, contratData }) => {
  const [isDetailContratOpen, setIsDetailContratOpen] = useState(false);
  const [isCloturerModalOpen, setIsCloturerModalOpen] = useState(false);
  const [isRenouvellerModalOpen, setIsRenouvellerModalOpen] = useState(false);
  const [isResilierModalOpen, setIsResilierModalOpen] = useState(false);
  const [isPayerContratModalOpen, setIsPayerContratModalOpen] = useState(false);
  const [isListPaiementModalOpen, setIsListPaiementModalOpen] = useState(false);
  const [isRembourserContratModalOpen, setIsRembourserContratModalOpen] = useState(false);

  // Hooks for payment functionality
  const { mutate: payContrat, isPending } = usePayContrat();
  const { data: paymentsData, isLoading, isError } = useFetchPaimentContrat(id);

  const openDetailContratModal = () => setTimeout(() => setIsDetailContratOpen(true), 200);
  const openCloturerModal = () => setTimeout(() => setIsCloturerModalOpen(true), 200);
  const openRenouvellerModal = () => setTimeout(() => setIsRenouvellerModalOpen(true), 200);
  const openResilierModal = () => setTimeout(() => setIsResilierModalOpen(true), 200);
  const openPayerContratModal = () => setTimeout(() => setIsPayerContratModalOpen(true), 200);
  const openListPaiementModal = () => setTimeout(() => setIsListPaiementModalOpen(true), 200);
  const openRembourserContratModal = () => setTimeout(() => setIsRembourserContratModalOpen(true), 200);

  const closeDetailContratModal = () => setIsDetailContratOpen(false);
  const closeCloturerModal = () => setIsCloturerModalOpen(false);
  const closeRenouvellerModal = () => setIsRenouvellerModalOpen(false);
  const closeResilierModal = () => setIsResilierModalOpen(false);
  const closePayerContratModal = () => setIsPayerContratModalOpen(false);
  const closeListPaiementModal = () => setIsListPaiementModalOpen(false);
  const closeRembourserContratModal = () => setIsRembourserContratModalOpen(false);
  
  // Check if renewal is possible (at least one renewal date is null)
  const canRenew = contratData.canprolonge;

  // check if termination is possible (contract is active)
  const canTerminate =
    contratData.status === "En_cours" || contratData.status === "Planifiee";

  // check if closure is possible (contract is expired)
  const canClose = contratData.status === "Termine";
  

  // check if payment is possible (contract is active)
  const canPay = contratData.payment_status?.is_fully_paid === false;
  const canRefund = contratData?.payment_status?.is_overpaid;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="[&>svg]:!h-5 [&>svg]:!w-5">
          <Ellipsis className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent collisionPadding={32} avoidCollisions={true}>
        <DropdownMenuGroup>
          {canClose && (
            <DropdownMenuItem
              className="text-base py-2 px-2 cursor-pointer"
              onClick={openCloturerModal}
            >
              <div className="flex items-center gap-4 leading-none">
                <CheckCircle size={20} />
                <span>Clôturer</span>
              </div>
            </DropdownMenuItem>
          )}
          {canPay && (
            <DropdownMenuItem
              className="text-base py-2 px-2 cursor-pointer"
              onClick={openPayerContratModal}
            >
              <div className="flex items-center gap-4 leading-none">
                <CreditCard size={20} />
                <span>Payer</span>
              </div>
            </DropdownMenuItem>
          )}

          {canRefund && (
            <DropdownMenuItem
              className="text-base py-2 px-2 cursor-pointer"
              onClick={openRembourserContratModal}
            >
              <div className="flex items-center gap-4 leading-none">
                <MinusCircle size={20} />
                <span>Rembourser</span>
              </div>
            </DropdownMenuItem>
          )}


          <DropdownMenuItem
            className="text-base py-2 px-2 cursor-pointer"
            onClick={openListPaiementModal}
          >
            <div className="flex items-center gap-4 leading-none">
              <ReceiptText size={20} />
              <span>Liste des paiements</span>
            </div>
          </DropdownMenuItem>

          {canRenew && (
            <DropdownMenuItem
              className="text-base py-2 px-2 cursor-pointer"
              onClick={openRenouvellerModal}
            >
              <div className="flex items-center gap-4 leading-none">
                <CalendarPlus2 size={20} />
                <span>Prolonger</span>
              </div>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem
            className="text-base py-2 px-2 cursor-pointer"
            onClick={openDetailContratModal}
          >
            <div className="flex items-center gap-4 leading-none">
              <Eye size={20} />
              <span>Détails</span>
            </div>
          </DropdownMenuItem>
          {canTerminate && (
            <DropdownMenuItem
              className="text-base py-2 px-2 cursor-pointer"
              onClick={openResilierModal}
            >
              <div className="flex items-center gap-4 leading-none">
                <Ban className="text-red-600" size={20} />
                <span className="text-red-600">Résilier</span>
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>

      {/* Modal Components */}
      {isRenouvellerModalOpen && (
        <RenouvellerContratModal
          open={isRenouvellerModalOpen}
          onClose={closeRenouvellerModal}
          id_contrat={id}
          contractNumber={contratData.sequence_contrat}
          currentEndDate={contratData.date_retour}
        />
      )}
      {isDetailContratOpen && (
        <DetailContratModal
          open={isDetailContratOpen}
          onClose={closeDetailContratModal}
          badge={contratData.badge}
          id={id}
        />
      )}
      {isCloturerModalOpen && (
        <CloturerContratModal
          open={isCloturerModalOpen}
          onClose={closeCloturerModal}
          kilometrage={contratData.kilometrage_garage}
          id_contrat={id}
          id_garage={contratData.garage.id_garage}
          contractNumber={contratData.sequence_contrat} 
        />
      )}
      {isResilierModalOpen && (
        <ResilierContratModal
          open={isResilierModalOpen}
          onClose={closeResilierModal}
          kilometrage={contratData.kilometrage_garage}
          id_contrat={id}
          id_demande={contratData.id_demande}
          id_garage={contratData.garage.id_garage}
          contractNumber={contratData.sequence_contrat} 
        />
      )}
      {isPayerContratModalOpen && (
        <PaymentModal
          entityId={id}
          entityType="contrat"
          entityNumber={contratData.sequence_contrat}
          open={isPayerContratModalOpen}
          onClose={closePayerContratModal}
          paymentStatus={contratData.payment_status}
          onSubmit={payContrat}
          isPending={isPending}
        />
      )}

      {isRembourserContratModalOpen && (
        <RefundModal
          entityId={id}
          entityNumber={contratData.sequence_contrat}
          open={isRembourserContratModalOpen}
          onClose={closeRembourserContratModal}
          paymentStatus={contratData.payment_status}
        />
      )}


      {isListPaiementModalOpen && (
        <PaymentListModal
          open={isListPaiementModalOpen}
          onClose={closeListPaiementModal}
          entityId={id}
          entityType="contrat"
          entityNumber={contratData.sequence_contrat}
          totalAmount={contratData.payment_status.total_amount}
          isOverPaid={contratData.payment_status.is_overpaid}
          paymentsData={paymentsData}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </DropdownMenu>
  );
};

export default ContratActions;