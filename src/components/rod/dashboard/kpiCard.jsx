import React from 'react'

const KpiCard = ({className, title, icon, children,titleStyle }) => {
  return (
    <div className={`bg-white h-full flex flex-col gap-0 desktop:gap-2 desktop-lg:gap-4 rounded-lg shadow-card-garage p-3 desktop-lg:p-4 hover:shadow-card-garage-hover transition-shadow duration-500 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-medium text-gray-800 ${titleStyle}`}>{title}</h3>
        <div className='bg-rod-foreground ring-2 ring-rod-foreground text-gray-800 p-1 rounded-full'>
          {icon}
        </div>
      </div>
      <div className='flex-1 flex flex-col min-h-0'>{children}</div>
    </div>
  )
}

export default KpiCard
