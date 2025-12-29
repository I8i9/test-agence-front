import React from 'react'
import TableRender from './tableRender'
import { Car } from 'lucide-react'


const TypesTable = ({data}) => {
  if (!data || data?.length===0){
    return  <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
      <span className='p-2 bg-rod-foreground rounded-full'><Car className='size-5'/></span>
      <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
    </div>
  }
  return (
    <TableRender data={data} title="Type"/>
  )
}

export default TypesTable