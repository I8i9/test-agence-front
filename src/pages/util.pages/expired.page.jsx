import React from 'react'
import Logo from "../../assets/logos/rod_logo_1.svg"
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'


const ExpiredPage = () => {
  return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className='w-full h-fit flex flex-col items-center justify-center space-y-2 -mt-[9vh]'>
          <div className="laptop:h-12 desktop:h-12 desktop-lg:h-16  desktop-xl:h-16 laptop:w-12 desktop:w-12 desktop-lg:w-16 desktop-xl:w-16  h-16  w-16  bg-red-200 flex items-center justify-center rounded-xl">
                <TriangleAlert className='text-rod-accent laptop:h-8 desktop:h-8 desktop-lg:h-10  desktop-xl:h-10 laptop:w-8 desktop:w-8 desktop-lg:w-10 desktop-xl:w-10' />
          </div>
          <h3 className="laptop:text-xl desktop:text-xl  desktop-lg:text-2xl desktop-xl:text-2xl text-xl font-semibold mt-2">Abonnement expiré</h3>
          <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl desktop-xl:text-xl text-lg text-gray-500 text-center max-w-[720px]">
            Votre abonnement a expiré et l'accès aux fonctionnalités a été suspendu. Renouvelez votre abonnement pour continuer à profiter de tous les avantages.
          </p>

          {/* mpodal for requesting upgrade */}
          <Button className="laptop:mt-2 desktop:mt-2 desktop-lg:mt-4 desktop-xl:mt-4"> <RefreshCw /> Renouveler l'abonnement</Button>
        </div>
    </div>
  )
}

export default ExpiredPage