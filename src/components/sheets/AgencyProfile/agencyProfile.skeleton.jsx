import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const AgencyProfileSkeleton = () => {
  return (
    <div className='px-4 space-y-8'>
        <Card className="w-full max-full pb-8 px-4 pt-4 shadow-none ">
          <CardHeader className="w-full px-0">
            <CardTitle className='flex items-center gap-2'>
               <Skeleton className="h-6 w-6 rounded-full" />
               <Skeleton className="h-5 w-36 rounded-xl" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className='flex justify-between items-center'>
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-32 w-64 rounded-lg" />
            </div>
          </CardContent>
      </Card>
      
      <Card className="w-full max-full pb-8 px-4 pt-4 shadow-none ">
          <CardHeader className="w-full px-0">
            <CardTitle className='flex items-center gap-2'>
               <Skeleton className="h-6 w-6 rounded-full" />
               <Skeleton className="h-5 w-36 rounded-xl" />
            </CardTitle>
          </CardHeader>
          <CardContent className ="space-y-8 px-2">
            <div className='flex flex-col'>
              <Skeleton className="h-4 w-44 rounded-lg " />
              <Skeleton className="h-10 w-full rounded-lg mt-2" />
              <Skeleton className="h-4 w-68 rounded-lg mt-2" />
            </div>

            <div className='flex flex-col'>
              <Skeleton className="h-4 w-52 rounded-lg " />
              <Skeleton className="h-32 w-full rounded-lg mt-2" />
              <Skeleton className="h-4 w-64 rounded-lg mt-2" />
            </div>

            <div className='flex flex-col'>
              <Skeleton className="h-4 w-48 rounded-lg " />
              <Skeleton className="h-10 w-full rounded-lg mt-2" />
              <Skeleton className="h-4 w-60 rounded-lg mt-2" />
            </div>

            <div className='flex flex-col'>
              
              <Skeleton className="h-4 w-48 rounded-lg " />
              <div className='flex gap-4 w-full mt-2'>
                <Skeleton className="h-10 w-full rounded-lg " />
                <Skeleton className="h-10 w-10 rounded-full " />
              </div>
              <Skeleton className="h-4 w-60 rounded-lg mt-2" />
            </div>
          </CardContent>
      </Card>

      <Card className="w-full max-full pb-8 px-4 pt-4 shadow-none ">
          <CardHeader className="w-full px-2">
            <CardTitle className='flex items-center gap-2'>
               <Skeleton className="h-6 w-6 rounded-full" />
               <Skeleton className="h-5 w-36 rounded-xl" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className='flex justify-between items-center'>
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </CardContent>
      </Card>
    </div>
  )
}

export default AgencyProfileSkeleton