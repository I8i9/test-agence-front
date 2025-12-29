import { Card, CardContent } from "@/components/ui/card";
import { Building2, Folder, User, Mail, Phone, CircleOff } from "lucide-react"; 
import DetailItem from "../../../customUi/detailitem";

const FournisseurTab = ({ depense }) => {
  if (!depense?.fournisseur) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-2 -mt-4">

          <span className="p-3 rounded-xl bg-rod-foreground mb-1">
           <CircleOff className="w-8 h-8  mx-auto " />
          </span>
          <p className="text-xl font-semibold">Aucun fournisseur lié</p>
          <p className="text-gray-500 text-lg leading-none">Aucun fournisseur lié à cette dépense</p>
      </div>
    );
  }

  const fournisseur = depense?.fournisseur;

  return (
    <Card className="shadow-none border">
      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-6">
          <DetailItem label="Nom" icon={Building2}>
            {fournisseur?.nom_fournisseur}
          </DetailItem>
          <DetailItem label="Type" icon={Folder}>
            {fournisseur?.type_fournisseur || "Non défini"}
          </DetailItem>
          {fournisseur?.contact_name_fournisseur && (
            <DetailItem label="Contact" icon={User}>
              {fournisseur?.contact_name_fournisseur}
            </DetailItem>
          )}
          {fournisseur?.email_fournisseur && (
            <DetailItem label="Email" icon={Mail}>
              {fournisseur?.email_fournisseur}
            </DetailItem>
          )}
          {fournisseur?.telephone_fournisseur && (
            <DetailItem label="Téléphone" icon={Phone}>
              {fournisseur?.telephone_fournisseur}
            </DetailItem>
          )}
          {fournisseur?.address_fournisseur && (
            <DetailItem label="Adresse" icon={Building2}>
              {fournisseur?.address_fournisseur}
            </DetailItem>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FournisseurTab;