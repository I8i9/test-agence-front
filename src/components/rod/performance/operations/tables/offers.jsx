import React from 'react'
import TableRender from './tableRender'
import { ShoppingCart } from 'lucide-react'


const OffersTable = ({data}) => {

  if (!data || data?.length===0){
    return  <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
      <span className='p-2 bg-rod-foreground rounded-full'><ShoppingCart className='size-5'/></span>
      <span className='text-sm font-medium text-gray-800'>Pas d'offre pour cette periode</span>
    </div>
  }
  return (
    <TableRender data={data} title="Offre"/>
  )
}

export default OffersTable