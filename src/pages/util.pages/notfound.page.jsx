import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/logos/rod_logo_1.svg'

const NotFound = () => {
  
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="font-medium text-7xl text-rod-accent">404</h1>
      <h3 className="text-3xl font-semibold">Oups, rien n’a été trouvé</h3>
      <p className="text-2xl text-gray-500 text-center max-w-[832px]">
        La page que vous recherchez semble introuvable. Peut-être avez-vous mal tapé l'URL ou la page a été déplacée.
        Retournez à <Link to="/dashboard" className="text-rod-accent underline">la page d'accueil</Link>
      </p>
      <img src={ Logo } alt="rod logo" className='mt-4 laptop:h-8 desktop:h-10 desktop-lg:h-12 desktop-xl:h-14 h-8' />
    </div>
  )
}

export default NotFound