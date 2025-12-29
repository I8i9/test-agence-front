import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, User, FileText, Cherry , PercentCircle, Hash, BanknoteX, Banknote } from "lucide-react"
import DetailItem from "../../../customUi/detailitem"
import ToolTipCustom from "../../../customUi/tooltip"
import { fournisseurTypes } from "../../../../utils/fournisseur"

const DetailsTab = ({ fournisseur }) => {

  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join("")
  }


  return (
    <div className="flex gap-8 py-6">
      {/* Left Column - Header Section with Logo and Basic Info */}
      <div className="flex-shrink-0 w-48 ">
        <div className="flex flex-col w-full items-center text-center h-full justify-center">
          <Avatar className="size-24 border rounded-full mb-2">
            <AvatarImage
              className="object-cover"
              src={fournisseur?.logo_fournisseur}
              alt={fournisseur.nom_fournisseur}
            />
            <AvatarFallback className="text-4xl font-semibold ">
              {getInitials(fournisseur.nom_fournisseur)}
            </AvatarFallback>
          </Avatar>

          <ToolTipCustom
            trigger={
          <h2 className="text-lg truncate max-w-[192px] min-w-0 font-semibold text-foreground">{fournisseur.nom_fournisseur}</h2> 
            }
            message={fournisseur.nom_fournisseur}
          />

          <ToolTipCustom
            trigger={
          <h4 className="text-base max-w-[192px] truncate text-wrap text-muted-foreground">  {fournisseurTypes[fournisseur.type_fournisseur] || "—"}</h4>
            }
            message=  {fournisseurTypes[fournisseur.type_fournisseur] || "—"}
          />
        </div>
      </div> 
        {/* Contact Information Card */}
        <Card className="shadow-none w-full">
          <CardContent className="grid w-full grid-cols-3 gap-x-8 gap-y-6 py-2"> 

            <DetailItem icon={User} label="Contact Principal">
              <ToolTipCustom
              trigger={
              <span className="text-base whitespace-nowrap leading-none">
                {fournisseur.contact_name_fournisseur || "—"}
              </span>
              }
              message={fournisseur.contact_name_fournisseur || "—"}
              />
            </DetailItem>

            <DetailItem icon={Phone} label="Téléphone">
              <ToolTipCustom
              trigger={
              <span className="text-base whitespace-nowrap leading-none">
                {fournisseur.telephone_fournisseur || "—"}
              </span>
              }
              message={fournisseur.telephone_fournisseur || "—"}
              />
            </DetailItem>

          

            <DetailItem icon={Mail} label="Email">
              <ToolTipCustom
              trigger={
              <span className="text-base whitespace-nowrap leading-none">
                {fournisseur.email_fournisseur || "—"}
              </span>
              }
              message={fournisseur.email_fournisseur || "—"}
              />
            </DetailItem>

            <DetailItem icon={Hash} label="Matricule Fiscal">
              <ToolTipCustom
              trigger={
              <span className="text-base whitespace-nowrap leading-none">
                {fournisseur.matricule_fiscale || "—"}
              </span>
              }
              message={fournisseur.matricule_fiscale || "—"}
              />
            </DetailItem> 


            <DetailItem icon={Banknote} label="Montant Payé">
              <ToolTipCustom
              trigger={
              <span className="text-base whitespace-nowrap leading-none">
                {fournisseur.montant_paye || 0} DT
              </span>
              }
              message={fournisseur.montant_paye || 0 + " DT"}
              />
            </DetailItem> 

            <DetailItem icon={BanknoteX} label="Reste à Payer">
              <ToolTipCustom
              trigger={
              <span className="text-base whitespace-nowrap leading-none">
                {fournisseur.reste_a_payer || 0} DT
              </span>
              }
              message={fournisseur.reste_a_payer || 0 + " DT"}
              />
            </DetailItem> 

            <DetailItem icon={MapPin} label="Adresse" className="col-span-3">
              <span className="text-base whitespace-nowrap leading-none">
                {fournisseur.address_fournisseur || "—"}
              </span>
            </DetailItem>

            

            
          </CardContent>
        </Card> 
    </div>
  )
}

export default DetailsTab