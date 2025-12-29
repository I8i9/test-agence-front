import React from 'react'
import { AlertCircle, ArrowUpRight, Calendar, Car, CircleAlert, ClockAlertIcon, File, FileWarning, Gauge, HandCoins, Handshake, ImageMinus } from 'lucide-react';

const Tasks = ({data}) => {

  console.log(data)
    
  return (
    <div className='flex-1 min-h-0 w-full overflow-y-auto mt-2 mb-2'>
        {
          data?.returning > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full '>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><Car className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Voitures à récupérer aujourd'hui</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold   p-1 rounded-full '>{data.returning}</span>
              </div>
            </div>
        }

        {
          data?.going > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full'>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><ArrowUpRight className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Voitures à livrer aux clients</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold  p-1 rounded-full '>{data.going}</span>
              </div>
            </div>
        }

        {
          data?.overdue > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full'>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><AlertCircle className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Retours de voitures en retard</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold  p-1 rounded-full '>{data.overdue}</span>
              </div>
            </div>
        }

        {
          data?.facture_due > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full '>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><File className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Factures impayées dues aujourd'hui</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold   p-1 rounded-full '>{data.facture_due}</span>
              </div>
            </div>
        }

        {
          data?.facture_overdue > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full'>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><FileWarning className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Factures impayées en retard</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold  p-1 rounded-full '>{data.facture_overdue}</span>
              </div>
            </div>
        }


        {
          data?.demandes > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full'>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><ClockAlertIcon className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Demandes à valider avant expiration</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold  p-1 rounded-full '>{data.demandes}</span>
              </div>
            </div>
        }

        {
          data?.reminders > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full'>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><HandCoins className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Paiements attendus aujourd’hui</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold p-1 rounded-full '>{data.reminders}</span>
              </div>
            </div>
        }

        {
          data?.images > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full'>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><ImageMinus className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Véhicules sans photos à jour</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold p-1 rounded-full '>{data.images}</span>
              </div>
            </div>
            
        }

        {
          data?.garages > 0 &&
            <div className='p-2 flex hover:bg-muted border-b w-full'>
              <div className='flex items-center'>
                <span className='p-1 flex items-center  rounded-full bg-rod-foreground'><Gauge className='h-4  w-4 ' /></span>
                <span className='text-sm font-medium text-gray-700 leading-none ml-4'>Véhicules sans kilomètrage à jour</span>
              </div>
              <div className='ml-auto'>
                <span className='text-base font-semibold p-1 rounded-full '>{data.garages}</span>
              </div>
            </div>
        }

    </div>
  )
}

export default Tasks