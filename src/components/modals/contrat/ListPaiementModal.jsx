import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftRight, Banknote, ClockFading, DollarSign, FileText, Loader2, Receipt, ReceiptIcon, SquareSigma } from "lucide-react";

export const PaymentListModal = ({ 
  open, 
  onClose, 
  entityType, // "contrat" or "depense"
  entityNumber,
  totalAmount,
  paymentsData,
  isOverPaid = false,
  isForDepense = false,
  isLoading,
  isError
}) => {
  // Access the data correctly: paymentsData = { paiements, total_paid, count }
  const payments = paymentsData?.paiements || [];
  const totalPaid = paymentsData?.total_paid || 0;
  const remainingAmount = Math.abs(paymentsData?.remaining || 0);
  const rts = paymentsData?.rts || 0; // Retenus à la source for depense

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini";
    const date = new Date(dateString);
    if (isNaN(date)) return "Non défini";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const getMethodeLabel = (methode) => {
    const labels = {
      ESPECE: "Espèce",
      VIREMENT: "Virement",
      CHEQUE: "Chèque",
      TRAITE : "Traite",
    };
    return labels[methode] || methode;
  };

  const getIconForMethode = (methode) => {
    const icons = {
      ESPECE: <Banknote className="w-5 h-5" />,
      VIREMENT: <ArrowLeftRight className="w-5 h-5" />,
      CHEQUE: <Receipt className="w-5 h-5" />,
      TRAITE : <FileText className="w-5 h-5" />,
    };
    return icons[methode] || <DollarSign className="w-5 h-5" />;
  };

  const getEntityLabel = () => {
    return entityType === "contrat" ? "contrat" : "dépense";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-w-[676px] h-[601px] flex-col ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"> 
            <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
              <ReceiptIcon size={16} />
            </span> 
                          Résumé des paiements
          </DialogTitle>
          <DialogDescription className='pb-1 leading-tight'>
            Détails des transactions associées à {getEntityLabel()} {entityNumber}
          </DialogDescription>
          <Separator />
        </DialogHeader>
      <div className="flex flex-col h-full flex-1 gap-4">


        <div key={"history-total"} className="h-fit" >
          <div className={`p-3 bg-rod-foreground rounded-md px-12 ${isForDepense ? 'grid grid-cols-4' : 'grid grid-cols-3'}`}>
          <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              Total:
            </span>
            <span className="text-lg font-bold">{parseFloat(totalAmount.toFixed(2))} DT</span>
          </div>

          <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              Payé:
            </span>
            <span className="text-lg font-bold text-green-700">{parseFloat(totalPaid.toFixed(2))} DT</span>
          </div>

          <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              {!isForDepense && isOverPaid ?  'À rembourser' : 'Reste à payer'}
            </span>
            <span className={`text-lg font-bold ${remainingAmount > 0 ? "text-red-700" : "text-gray-800"}`}>{parseFloat(remainingAmount.toFixed(2))} DT</span>
          </div>
           {
              isForDepense ? 
           <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              Rétenus à la source:
            </span>
            <span className="text-lg font-bold">{parseFloat(rts?.toFixed(2)) || 0} DT</span>
          </div>
          : null
          }
        </div>
        </div>

         {/* Liste des paiements (défilante) */}
          {isLoading ? (
            <div className="flex-1   flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : isError ? (
            <div className=" text-center flex-1 flex items-center justify-center">
              <p className="text-destructive text-sm font-normal">Erreur lors du chargement des paiements</p>
            </div>
          ) : payments.length === 0 && !isLoading  ? (
             <div className="flex-1 w-full flex flex-col items-center justify-center gap-1 mb-8">
                <span className="p-3 rounded-xl bg-rod-foreground mb-1">
                <ClockFading className="  mx-auto " />
                </span>
                <p className="text-base font-semibold">Aucun paiement enregistré</p>
                <p className="text-gray-500 text-base leading-none">Les paiements effectués sur ce {getEntityLabel()} apparaîtront ici.</p>
            </div>
          ) : payments.length > 0 ? (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {payments.map((payment) => (
                <div key={payment.id_paiement} className="flex items-start justify-between p-2 border rounded-lg hover:bg-rod-foreground">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 ${ payment.montant < 0 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} rounded-full flex items-center justify-center`}>
                     {getIconForMethode(payment?.methode)}
                    </div>
                    <div>
                       <p className="font-medium text-base">
                        {formatDate(payment.date_paiement)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Par {getMethodeLabel(payment?.methode)}
                        {payment.reference ? ` • Réf : ${payment.reference}` : " • Pas de référence"}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-lg p-2 ">
                    {payment.montant.toFixed(2)} DT
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Aucun paiement enregistré</p>
            </div>
          )}
      </div>
      </DialogContent>
    </Dialog>
  );
};