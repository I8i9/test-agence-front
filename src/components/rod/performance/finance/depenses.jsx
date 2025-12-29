import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { allCosts } from '../../../../utils/costs';
import First from '../../../../assets/icons/1st_place_medal.svg'
import Second from '../../../../assets/icons/2nd_place_medal.svg'
import Third from '../../../../assets/icons/3rd_place_medal.svg'
import { HandCoins, Loader2 } from 'lucide-react';


const DepensesFinance = ({ data , loading, error }) => {
  
  return (
    <Card className="pt-0 h-full w-full max-h-[468px] ">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle  className="flex  items-center ">
            Dépenses
          </CardTitle>
        <CardDescription>
            Aperçu des dépenses les plus fréquentes.
        </CardDescription>

        </div>
        
      </CardHeader>
      <CardContent className="h-full overflow-auto mr-1">
        {
          loading ?
          <div className='flex justify-center items-center h-full w-full '>
            <Loader2 className="animate-spin size-6" />
          </div>
          : error ?
          <div className='flex justify-center items-center h-full w-full '>
            <span className='text-destructive text-sm'>Erreur de chargement des données.</span>
          </div>
        :
        (!data || data?.length===0) ?
            <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                <span className='p-2 bg-rod-foreground rounded-full'><HandCoins className='size-5'/></span>
                <span className='text-sm font-medium text-gray-800'>Pas de dépenses pour cette periode</span>
              </div>
        :
        <div className='grid grid-rows '>
          {data && data.length > 0 &&
            data.map((depense, index) => {
              const cost = allCosts.find(cost => cost.value === depense.type);
              const IconComp = cost?.icon;
              const name = cost?.label ;

              return (
              <div key={depense.type} className='w-full min-w-0 flex  flex-col mb-4 py-1.5 px-3 border rounded-lg  gap-2 justify-between items-start '>
                <div className='text-base flex justify-between w-full items-center '>
                  
                  <span className='w-full max-w-full text-sm text-nowrap flex items-center gap-2 truncate text-rod-primary font-normal '>
                    {
                    IconComp && <IconComp className='size-4 shrink-0 text-muted-foreground' />
                    }
                    {name || depense.type || '-'}</span>
                  
                  <span >
                    {index === 0 ? <img src={First} className="w-5 h-5" />
                     : index === 1 ?<img src={Second} className="w-5 h-5" /> 
                     : index === 2 ? <img src={Third} className="w-5 h-5" /> : "" }
                  </span>
                  </div>
                <div className='w-full bg-rod-foreground h-2 rounded-md'>
                  <div
                    className='bg-orange-500 h-2 rounded-md'
                    style={{ width: `${depense.percentage}%` }}
                  ></div>
                  </div>
                <div className='flex justify-between text-gray-800   w-full'>
                <div className='text-sm  font-semibold '> {depense.couts} DT - {depense.nbre_depenses} occurences</div>
                <div className='text-sm  font-semibold '> {depense.percentage} %</div>

                </div>
              </div>
              )
            })
          }
          
        </div>
      }
      </CardContent>
    </Card>
  )
}

export default DepensesFinance