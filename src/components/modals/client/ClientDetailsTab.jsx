import React from 'react'
import {SquareUser, ReceiptText ,Flag, VenusAndMars, CalendarSearch, Banknote, IdCard, Phone, Mail, FolderPen, DollarSign, User, CircleQuestionMark, CircleUser } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DetailItem from '../../customUi/detailitem';

const ClientDetailsTab = ({ client }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <CircleUser className="w-5 h-5" />
          Information du client
        </CardTitle>
      </CardHeader>
      <CardContent  className="grid grid-rows-2 grid-cols-4 gap-x-8 gap-y-8 py-2">          
          <DetailItem label="Nom & Prénom" icon={FolderPen}>
            <p className="font-medium leading-none">{client?.nom_client || '_'}</p>
          </DetailItem>

          {/* Email */}
          <DetailItem label="Email" icon={Mail}>
            <p className="font-medium leading-none">{client?.email_client || '_'}</p>
          </DetailItem>

          {/* Téléphone */}
          <DetailItem label="Téléphone" icon={Phone}>
            <p className="font-medium leading-none">{client?.telephone_client || '_'}</p>
          </DetailItem>
             {/* Pays */}
          <DetailItem label="Pays" icon={Flag}>
            <p className="font-medium leading-none">{client?.pays_client || '_'} {client?.region_client && `, ${client.region_client}`}</p>
          </DetailItem>

          {/* Dernière location */}
          <DetailItem label="Derniére location" icon={CalendarSearch}>
            <p className="font-medium leading-none">
              {client?.derniere_location ? new Date(client.derniere_location).toLocaleDateString('fr-FR') : '_'}
            </p>
          </DetailItem>

          {/* Nombre de locations */}
          <DetailItem label="Nombre de locations" icon={ReceiptText}>
            <p className="font-medium leading-none">{client?.nombre_contrats_termine || 0}</p>
          </DetailItem>

          {/* Révenus générés */}
          <DetailItem label="Revenus générés" icon={DollarSign}>
            <p className="font-medium leading-none">{client?.revenus_generes || 0} DT</p>
          </DetailItem>

          {/* Sexe */}
          <DetailItem label="Type " icon={CircleQuestionMark}>
            <p className="font-medium leading-none">{client?.client_type === "INDIVIDUAL" ? "Individuel" : client?.client_type === "COMPANY" ? "Entreprise" : '_'}</p>
          </DetailItem>
      </CardContent>
    </Card>
  )
}

export default ClientDetailsTab