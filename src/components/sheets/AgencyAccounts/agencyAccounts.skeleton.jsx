import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"


const AgencyAccountsSkeleton = () => {
  return (
    <div className='px-4 space-y-8 pb-8'>

            <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
                <CardHeader className="w-full px-0">
                  <CardTitle className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Skeleton className='h-6 w-6 rounded-full' />
                        <Skeleton className='h-[18px] w-40'></Skeleton>
                    </div>
                    <Skeleton className='h-[18px] w-16'></Skeleton>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                    <div className='space-y-4'>

                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
                <CardHeader className="w-full px-0">
                  <CardTitle className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-6 rounded-full' />
                    <Skeleton className='h-[18px] w-40 leading-tight'></Skeleton>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                 
                </CardContent>
            </Card>

            </div>
  )
}

export default AgencyAccountsSkeleton