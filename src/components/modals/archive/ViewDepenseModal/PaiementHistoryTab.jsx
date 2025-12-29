import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatDateDDMMYYYYHHMM } from "../../../../utils/dateConverter";

const PaiementHistoryTab = ({ payments, isLoading }) => {
    
  const getMethodeLabel = (methode) => {
    const labels = {
      ESPECE: "Espèce",
      VIREMENT: "Virement",
      CHEQUE: "Chèque"
    };
    return labels[methode] || methode;
  };

  const paiements = payments?.paiements || [];
  const totalPaid = payments?.total_paid || 0;
  const remainingAmount = payments?.remaining_amount || 0;
  const totalAmount = totalPaid + remainingAmount;

  return (
    <div className="flex flex-col h-full">
      {/* Liste des paiements (défilante) */}
      <div className="flex-1 overflow-y-auto mb-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : paiements.length > 0 ? (
          <div className="space-y-3">
            {paiements.map((payment) => (
              <Card key={payment.id_paiement} className="p-4 shadow-none">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-base">
                      {formatDateDDMMYYYYHHMM(payment.date_paiement)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Méthode : {getMethodeLabel(payment.methode)}
                      {payment.reference && ` • Réf : ${payment.reference}`}
                    </p>
                  </div>
                  <p className="font-semibold text-lg">{payment.montant.toFixed(2)} DT</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun paiement enregistré</p>
          </div>
        )}
      </div>
      
      {/* Total payé et restant */}
      <div className="flex items-center border-t pt-4 justify-between">
        <p className="text-base leading-tight">  
          <span className="font-medium">Payé:</span>{" "}
          <span className="font-bold text-primary">{totalPaid.toFixed(2)} DT</span>
          {" "}<span className="text-muted-foreground">|</span>{" "}
          <span className="font-medium">Restant:</span>{" "}
          <span className={`font-bold ${remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
            {remainingAmount.toFixed(2)} DT
          </span>
        </p>
        <p className="text-base leading-tight"> 
          <span className="font-medium">Total:</span>{" "}
          <span className="font-bold">{totalAmount.toFixed(2)} DT</span>
        </p>
      </div>
    </div>
  );
};

export default PaiementHistoryTab;