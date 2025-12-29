import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarDaysIcon,
  Folder,
  DollarSign,
  Barcode,
  NotebookText,
  Coins,
  Percent,
} from "lucide-react";
import DetailItem from "../../../customUi/detailitem";
import { FormatDateddMMyyyy } from "../../../../utils/dateConverter";

const DepenseDetailsTab = ({ depense }) => { 
  console.log("rrrrrrrrrrrr",depense);
  const getMethodeLabel = (methode) => {
    const labels = {
      ESPECE: "Espèce",
      VIREMENT: "Virement",
      CHEQUE: "Chèque",
    };
    return labels[methode] || methode;
  };

  return (
    <Card className="shadow-none">
      <CardContent className="py-3">
        <div className="grid grid-cols-3 gap-x-8 gap-y-7">
          <DetailItem label="Date Dépense" icon={CalendarDaysIcon}>
            {FormatDateddMMyyyy(depense?.date_depense) || "_"} 
          </DetailItem>

          <DetailItem label="Type de Dépense" icon={Folder}>
            {depense?.type_depense || "Non défini"}
          </DetailItem>

          <DetailItem label="Numéro de facture" icon={Barcode}>
            {depense?.recu_depense || "_"}
          </DetailItem>

          <DetailItem label="Montant de Dépense" icon={DollarSign}>
            {(depense?.montant_depense || 0).toFixed(2)} DT
          </DetailItem>

          <DetailItem label="Type de Paiement" icon={Coins}>
            {/* This would come from payments data */}
            _
          </DetailItem>

          <DetailItem label="TVA" icon={Percent}>
            {depense?.tva_depense || 0}%
          </DetailItem>

          <DetailItem className="col-span-3" label="Description Dépense" icon={NotebookText}>
            {depense?.description_depense || "_"}
          </DetailItem>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepenseDetailsTab;