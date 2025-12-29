import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import First from '../../../../assets/icons/1st_place_medal.svg'
import Second from '../../../../assets/icons/2nd_place_medal.svg'
import Third from '../../../../assets/icons/3rd_place_medal.svg'
import { CalendarDays, Loader2, Map } from 'lucide-react'

const DurationFinance = ({data , loading, error}) => {
  console.log("Locations data:", data);
  return (
    <Card className="pt-0 h-full w-full min-h-0 flex-1 max-h-[468px]  ">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex  items-center ">
            Les Lieux de Location 
          </CardTitle>
        <CardDescription>
            Aperçu des Lieux de location les plus rentables.
        </CardDescription>

        </div>
        
      </CardHeader>
      <CardContent className=" h-full overflow-auto mr-1 ">
        {
          loading ?
          <div className='w-full h-full flex justify-center items-center '>
            <Loader2 className="animate-spin size-6 " />
          </div>
          : error ?
          <div className='w-full h-full flex justify-center items-center '>
            <span className='text-destructive text-sm '>Erreur lors du chargement des données.</span>
          </div>
          :
           (!data || data?.length===0) ?
            <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                <span className='p-2 bg-rod-foreground rounded-full'><Map className='size-5'/></span>
                <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
              </div>
          :
      <div className='grid grid-rows '>
        {data && data.length > 0 &&
            data.map((location, index) => {
            return (
            <div key={`${location.label}-${index}`} className='flex  flex-col mb-4  py-1.5 px-3 border rounded-lg  gap-2 justify-between items-start '>
              <div className='text-base flex justify-between w-full items-center '>
                  
                  <span className='w-full max-w-full text-sm truncate text-rod-primary font-normal '>{location.label}</span>
                  <span >
                     {index === 0 ? <img src={First} className="w-5 h-5" />
                      : index === 1 ?<img src={Second} className="w-5 h-5" /> 
                      : index === 2 ? <img src={Third} className="w-5 h-5" /> : "" }
                  </span>
                  </div>
              <div className='w-full bg-rod-foreground h-2 rounded-md'>
                <div
                  className='bg-indigo-500 h-2 rounded-md'
                  style={{ width: `${location.percentage}%` }}
                ></div>
                </div>
              <div className='flex justify-between text-gray-800   w-full'>
              <div className='text-sm  font-semibold '>{location.revenu} DT - {location.nbre} contrats</div>
              <div className='text-sm  font-semibold '>{location.percentage} %</div>

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

export default DurationFinance