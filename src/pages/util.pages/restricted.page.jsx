import React from 'react'
import { ArrowUp, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'


const RestrictedPage = (props) => {
  return (
     <div className="w-full h-full flex flex-col items-center justify-center">
        <div className='w-full h-fit flex flex-col items-center justify-center space-y-2 -mt-[9vh]'>
          <div className="laptop:h-12 desktop:h-12 desktop-lg:h-16  desktop-xl:h-16 laptop:w-12 desktop:w-12 desktop-lg:w-16 desktop-xl:w-16  h-16  w-16  bg-red-200 flex items-center justify-center rounded-xl">
                <Lock className='text-rod-accent laptop:h-8 desktop:h-8 desktop-lg:h-10  desktop-xl:h-10 laptop:w-8 desktop:w-8 desktop-lg:w-10 desktop-xl:w-10' />
          </div>
          <h3 className="laptop:text-xl desktop:text-xl  desktop-lg:text-2xl desktop-xl:text-2xl text-xl font-semibold mt-2">Accès restreint</h3>
          <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl desktop-xl:text-xl text-lg text-gray-500 text-center max-w-[640px]">
            Le module {props.type} n'est pas activé dans votre configuration actuelle. Contactez-nous pour l'ajouter à votre plan.
          </p>

          {/* mpodal for requesting upgrade */}
          <Button className="laptop:mt-2 desktop:mt-2 desktop-lg:mt-4 desktop-xl:mt-4"> <ArrowUp/> Demander une mise à niveau</Button>
        </div>
    </div>
  )
}

export default RestrictedPage