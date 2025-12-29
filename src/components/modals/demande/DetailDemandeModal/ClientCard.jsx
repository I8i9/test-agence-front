import   DetailItem from '../../../customUi/detailitem';
import ToolTipCustom from '../../../customUi/tooltip';
import { capitalizeWords } from '../../../../utils/textConverter';

import { Barcode, Flag, IdCard, Mail, Phone, User, VenusAndMars } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
const ClientCard =({client}) => {
    return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle  className="flex items-center gap-2 font-medium text-lg">
          <User className="w-5 h-5" />
          Client
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-8 gap-y-7">
          <DetailItem label="Nom & Prénom" icon={IdCard}>
            <ToolTipCustom
                trigger={
            <p className="font-medium max-w-fit ">{client?.nom_client || 'N/A'}</p>
                }
                message={client?.nom_client || 'N/A'}
            />
          </DetailItem>

           {/* Téléphone */}
          <DetailItem label="Téléphone" icon={Phone}>
            <ToolTipCustom
                trigger={
                    <p className="font-medium max-w-fit ">{client?.telephone_client || 'N/A'}</p>
                }
                message={client?.telephone_client || 'N/A'}
            />
          </DetailItem>

          {/* Email */}

            {/* Pays */}
          <DetailItem label="Pays" icon={Flag}>
            <ToolTipCustom
                trigger={
                    <p className="font-medium max-w-fit truncate">{client?.region_client ? client?.pays_client + ", " + client?.region_client : client?.pays_client || 'N/A'}</p>
                }
                message={client?.pays_client || 'N/A'}
            />
          </DetailItem>

          {/* sexe */}
          <DetailItem label="Type Client" icon={VenusAndMars}>
            <ToolTipCustom
                trigger={
                    <p className="font-medium  max-w-fit ">{ capitalizeWords(client?.client_type === "INDIVIDUAL" ? "Particulier" : client?.client_type === "COMPANY" ? "Entreprise" : undefined) || '_'}</p>
                }
                message={capitalizeWords(client?.client_type === "INDIVIDUAL" ? "Particulier" : client?.client_type === "COMPANY" ? "Entreprise" : undefined)  || '_'}
            />
          </DetailItem>

           <DetailItem className={client?.mf_entreprise ? "" : "col-span-2"}  label="Email" icon={Mail}>
            <ToolTipCustom
                trigger={
                    <p className="font-medium max-w-fit ">{client?.email_client || '_'}</p>
                }
                message={client?.email_client || '_'}
            />
          </DetailItem>

          {
            client?.mf_entreprise ?
            <DetailItem  label="Matricule Fiscale" icon={Barcode}>
              <ToolTipCustom
                  trigger={
                      <p className="font-medium max-w-fit ">{client?.mf_entreprise || '_'}</p>
                  }
                  message={client?.mf_entreprise || '_'}
              />
            </DetailItem>
          : null
          }

      </CardContent>
    </Card>
    )
}
export default ClientCard