import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"


const AgencySubscriptionSkeleton = () => {
  return (
    <div className='px-4 space-y-8 pb-8'>
              <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
                <CardHeader className="w-full px-0">
                  <CardTitle className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-6' />
                    <Skeleton className='h-[18px] w-40'></Skeleton>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  {/* Subscription details */}
                  <div className='space-y-2'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex w-full justify-between items-center'>
                          <Skeleton className='h-3.5 w-40'></Skeleton>
                          <Skeleton className='h-[18px] w-20 '></Skeleton>
                        </div>

                        <div className='flex w-full justify-between items-center'>
                          <Skeleton className='h-3.5 w-40'></Skeleton>
                          <Skeleton className='h-4 w-16 '>  </Skeleton>
                        </div>
                    </div>

                    <Skeleton className="my-4 h-0.5"/>

                    <div className="mt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <Skeleton className="h-4 w-48 flex gap-1 items-center"></Skeleton>
                                    <Skeleton className="h-4 w-24"></Skeleton>
                                </div>
                    </div>
                  </div>
                </CardContent>
            </Card>
            {/* next Subscription */}

            <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
                <CardHeader className="w-full px-0">
                  <CardTitle className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-6 rounded-full' />
                    <Skeleton className='h-[18px] w-40'></Skeleton>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  {/* Subscription details */}
                  <div className='space-y-2'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex w-full justify-between items-center'>
                          <Skeleton className='h-4 w-72'> </Skeleton>
                          <Skeleton className='h-[18px] w-24'></Skeleton>
                        </div>

                        <div className='flex w-full justify-between items-center'>
                          <Skeleton className='h-4 w-80'> </Skeleton>
                          <Skeleton className='h-[18px] w-16'></Skeleton>
                        </div>
                    </div>

                    <Skeleton className="mt-4 h-0.5 mb-2"/>
                    <Skeleton className='h-3.5 w-full '>
                    </Skeleton>
                  </div>
                </CardContent>
            </Card>

            {/* Active Modules Section */}


            <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
                <CardHeader className="w-full px-0">
                  <CardTitle className='flex items-center gap-2'>
                    <Skeleton className='h-6 w-6 rounded-full' />
                    <Skeleton className='h-[18px] w-40'></Skeleton>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 space-y-6">
                  <div className='space-y-4'> 
                      <div className="relative p-4 border border-gray-200 rounded-lg"> 
                              <Skeleton className="absolute top-3 right-3 w-5 h-3.5 rounded-full flex items-center gap-0.5">
                    
                              </Skeleton>
                              
                              <div className="flex items-center gap-3 mb-2">
                              <Skeleton className="h-8 w-8 rounded-full"> 
                              </Skeleton>
                              <div className="flex flex-col gap-1">
                                  <Skeleton className=" h-4 w-24"></Skeleton>
                                  <Skeleton className="h-4 w-40">  
                                  </Skeleton>
                              </div>
                              </div>
                          </div>

                      
                      <div className="relative p-4 border border-gray-200 rounded-lg"> 
                              <Skeleton className="absolute top-3 right-3 w-5 h-3.5 rounded-full flex items-center gap-0.5">
                             
                              </Skeleton>
                              
                              <div className="flex items-center gap-3 mb-2">
                                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center"> 
                                  </Skeleton>
                                  <div className="flex flex-col gap-1">
                                      <Skeleton className="h-4 w-24"></Skeleton>
                                      <Skeleton className="h-4 w-64">
                                      </Skeleton>
                                  </div>
                              </div>


                              <Skeleton className="my-4 h-0.5"/>
                              
                              <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Skeleton className="h-3.5 w-16 "></Skeleton>
                                    <Skeleton className="h-3.5 w-14"></Skeleton>
                                </div>
                              </div>
                          </div>
  
                          <div className="relative p-4 border border-gray-200 rounded-lg"> 
                              <Skeleton className="absolute top-3 right-3 w-5 h-3.5 rounded-full flex items-center gap-0.5">
                             
                              </Skeleton>
                              
                              <div className="flex items-center gap-3 mb-2">
                              <Skeleton className="h-8 w-8 rounded-full"> 
                              </Skeleton>
                              <div className="flex flex-col gap-1">
                                  <Skeleton className=" h-4 w-24"></Skeleton>
                                  <Skeleton className="h-4 w-40">  
                                  </Skeleton>
                              </div>
                              </div>
                          </div>
                  </div>
                </CardContent>
            </Card>
            </div>
  )
}

export default AgencySubscriptionSkeleton