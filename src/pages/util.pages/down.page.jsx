import React from 'react'
import Logo from '../../assets/logos/rod_logo_1.svg'

const DownPage = () => {
  
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="font-medium text-6xl text-rod-accent">Hors Ligne</h1>
      <h3 className="text-3xl font-semibold mt-4">Rod Temporairement Indisponible</h3>
      <p className="text-2xl text-gray-500 text-center max-w-[832px]">
        La plateforme Rod n'est pas accessible pour le moment.
        Veuillez réessayer dans quelques instants.
      </p>
      <img src={ Logo } alt="rod logo" className='mt-4 laptop:h-8 desktop:h-10 desktop-lg:h-12 desktop-xl:h-14 h-8' />
    </div>
  )
}

export default DownPage