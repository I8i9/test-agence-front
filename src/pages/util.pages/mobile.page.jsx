import React from 'react'
import Logo from "../../assets/logos/rod_logo_1.svg"
import { TabletSmartphone } from 'lucide-react'

const MobilePage = () => {
  return (
     <div className="w-full h-screen flex flex-col items-center justify-center laptop:space-y-2 desktop:space-y-4 desktop-lg:space-y-4 desktop-xl:space-y-4 space-y-2">
      <div className="laptop:h-16 desktop:h-[72px] desktop-lg:h-20 desktop-xl:h-20  h-16 laptop:w-16 desktop:w-[72px] desktop-lg:w-20 desktop-xl:w-20 w-16  bg-red-200 flex items-center justify-center rounded-xl">
            <TabletSmartphone className='text-rod-accent laptop:h-10 desktop:h-12 desktop-lg:h-12 desktop-xl:h-12 h-10 laptop:w-10 desktop:w-12 desktop-lg:w-12 desktop-xl:w-12 w-10' />
      </div>
      <h3 className="laptop:text-2xl desktop:text-3xl desktop-lg:text-3xl desktop-xl:text-3xl text-2xl font-semibold">Appareil Mobile Détecté</h3>
      <p className="laptop:text-xl desktop:text-2xl desktop-lg:text-2xl desktop-xl:text-2xl text-xl text-gray-500 text-center laptop:max-w-[560px] desktop:max-w-[832px] desktop-lg:max-w-[832px] desktop-xl:max-w-[832px] md:max-w-[440px] max-w-[clamp(300px,80vw,440px)]">
        La platforme Rod n'est disponible que sur les appareils de bureau.
        Veuillez y accéder depuis un ordinateur
      </p>
      <img src={ Logo } alt="rod logo" className='mt-4 laptop:h-8 desktop:h-10 desktop-lg:h-12 desktop-xl:h-14 h-8' />
    </div>
  )
}

export default MobilePage