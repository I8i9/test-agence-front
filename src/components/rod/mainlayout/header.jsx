import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

import DateAndTime from './dateandtime'
import {useStore} from '../../../store/store' 
import Notifications from './notifications/notifications.jsx'

import AgencyProfileSheet from '../../sheets/AgencyProfile/agencyProfile.jsx'
import DemandNotification from './notifications/demandsNotification.jsx'

const Header = () => {
  const user = useStore((state) => state.user); 
  // Get current hour
  const hour = new Date().getHours();

  // Determine greeting based on time
  let greeting = "Bienvenue";
  if (hour >= 5 && hour < 12) {
    greeting = "Bonjour";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Bienvenue";
  } else {
    greeting = "Bonsoir";
  }

  return (
    <div id='Header' className='flex flex-col h-full w-full'>
      <div className='w-full h-full py-2 desktop:py-3 desktop-lg:py-4 desktop-xl:py-5 px-4 desktop:px-6 desktop-lg:px-8 desktop-xl:px-12 flex items-center justify-between'>
        <div id='agency-profile' className='flex items-center laptop:gap-3 gap-4'>
          <Avatar className="transition-all duration-300 ease-in-out hover:scale-110 cursor-none laptop:h-10 laptop:w-10 desktop:h-12 desktop:w-12 desktop-lg:h-14 desktop-lg:w-14 desktop-xl:h-16 desktop-xl:w-16">
            <AvatarImage className="object-cover" src={user.agency?.logo_path} />
            <AvatarFallback className="text-lg font-medium">{user.agency?.name_agency.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col laptop:gap-0 desktop:gap-0 desktop-lg:gap-0.25 desktop-xl:gap-2'>
            <h1 className='text-rod-primary font-semibold text-base leading-tight'>
              {greeting}, {user.agency?.name_agency}
            </h1>
            <div><AgencyProfileSheet/></div>
          </div>
        </div>
        <div className='flex justify-end items-center gap-4'>         
          <DateAndTime />
          <DemandNotification/>         
        </div>
      </div>
      <Separator className='px-0 h-0.5' />
    </div>
  )
}

export default Header