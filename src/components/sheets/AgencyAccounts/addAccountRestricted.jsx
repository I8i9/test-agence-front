import React from 'react'
import { Lock, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { UserPlus } from 'lucide-react'



const AddAccountRestricted = () => {
  return (
    <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
        <CardHeader className="w-full px-0">
            <CardTitle className='flex items-center gap-2'>
            <UserPlus  size={24} className=''/>
            <h2 className='text-xl font-medium  leading-tight'>Ajouter un autre compte</h2>
            </CardTitle>
        </CardHeader>
        <CardContent className="px-2 mt-8 mb-12">
                <div className='flex flex-col w-full items-center justify-center'>
                <div className="h-10  w-10  bg-red-200 flex items-center justify-center rounded-lg">
                        <Lock className='text-rod-accent h-6' />
                </div>
                <h3 className="text-lg font-semibold mt-2 ">Limite atteinte</h3>
                <p className=" text-gray-500 text-center text-base">
                    Vous avez atteint votre limite. Veuillez contacter le support pour augmenter votre limite de comptes.
                </p>
            </div>
        </CardContent>
    </Card>
  )   
}

export default AddAccountRestricted