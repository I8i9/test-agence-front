import React, { useLayoutEffect, useRef, useState } from 'react'
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
import { Loader2, Map, Users } from 'lucide-react'


const Regions = ({data , loading, error}) => {

  const containerRef = useRef(null);
    const [lockedHeight, setLockedHeight] = useState(null);
  
    // Measure height (initial + on resize)
    useLayoutEffect(() => {
      const measure = () => {
        if (!containerRef.current) return;
        const h = containerRef.current.offsetHeight;
        if (h > 0) {
          setLockedHeight(h);
        }
      };
  
      // Initial measure
      measure();
  
      // Re-measure on resize
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, []);

  return (
    <Card className="pt-0 h-full w-full">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex  items-center ">
            Emplacement des Clients
          </CardTitle>
        <CardDescription>
            Aperçu des Emplacements de mes Clients.
        </CardDescription>

        </div>
        
      </CardHeader>
      <CardContent ref={containerRef} style={lockedHeight ? { maxHeight: lockedHeight } : {}} className=" h-full overflow-auto mr-1 ">

      {
        lockedHeight ?
          loading ?
          <div className='flex justify-center items-center h-full w-full '>
            <Loader2 className="animate-spin size-6" />
          </div>
          : error ?
          <div className='flex justify-center items-center h-full w-full '>
            <span className='text-destructive text-sm'>Erreur de chargement des données.</span>
          </div>
          : (!data || data?.length===0) ?
            <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                <span className='p-2 bg-rod-foreground rounded-full'><Users className='size-5'/></span>
                <span className='text-sm font-medium text-gray-800'>Pas des clients pour cette periode</span>
              </div>
        :
        <div className='grid grid-rows '>
            { data && data.map((item, index) => ( 
              <div key={`${item.region}-${index}`} className='flex  flex-col mb-4  py-1.5 px-3 border rounded-lg  gap-2 justify-between items-start '>
                <div className='text-base flex justify-between w-full items-center '>
                    
                    <span className='w-full max-w-full truncate text-rod-primary text-sm font-normal '>{item.region}</span>
                    <span >
                        {index === 0 ? <img src={First} className="w-5 h-5" />
                        : index === 1 ?<img src={Second} className="w-5 h-5" /> 
                        : index === 2 ? <img src={Third} className="w-5 h-5" /> : "" }
                    </span>
                    </div>
                <div className='w-full bg-rod-foreground h-2 rounded-md'>
                  <div
                    className='bg-red-500 h-2 rounded-md'
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                  </div>
                <div className='flex justify-between text-gray-800   w-full'>
                <div className='text-sm  font-semibold '>{item.nbre} Clients</div>
                <div className='text-sm  font-semibold '>{item.percentage} %</div>

                </div>
              </div>
              ) )
          }
          
        </div>
        : null
      }
      </CardContent>
    </Card>
  )
}

export default Regions