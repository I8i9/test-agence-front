import { Skeleton } from '../../ui/skeleton';


const GarageCarCardSkeleton = ()=>{

    return(
        <div  className="relative w-full h-full grid grid-rows-[45%_55%] p-3 desktop-lg:p-4 bg-white rounded-lg shadow-card-garage  transition-all duration-100 ease-in-out overflow-hidden">

                {/* matricule */}
                <Skeleton className="absolute   top-3 left-3 desktop-lg:top-4 desktop-lg:left-4 w-20 h-4 rounded-sm px-1.5 desktop-lg:px-2 py-0.5">
            </Skeleton>

            {/* status and alert */ }
            <div className="absolute top-3 right-3 desktop-lg:top-4 desktop-lg:right-4  flex flex-col items-end gap-2">
                <Skeleton className={"w-20 h-4 rounded-sm px-1.5 desktop-lg:px-2 py-0.5"}>
                </Skeleton>

            </div>

            {/* car image */}
            <div className="w-full flex items-center justify-center px-6 mt-4">
                <Skeleton  className="size-24 desktop-lg:size-28 rounded-full" />
            </div>

            <div className="flex flex-col justify-between items-center h-full">

                {/* car details */}
                <div className="flex flex-col gap-2 items-center mt-6 desktop-lg:mt-8">
                    <Skeleton className="h-3.5  desktop-lg:h-4 w-28"></Skeleton>
                    <Skeleton className="h-3.5  desktop-lg:h-4 w-16">
                    </Skeleton>

                </div>


                {/* car kilometrage & color */}
                <div className="flex  gap-2 desktop:gap-4 items-center">
                        
                    <Skeleton className="w-24 h-4">
                    </Skeleton>

                    <Skeleton className="w-24 h-4">
                    </Skeleton>
       
                </div>


                {/* actions Buttons */}

                <div className="w-full flex justify-between gap-2 desktop-lg:gap-3 ">
                    <Skeleton className="flex-1 h-6 desktop-lg:h-7 rounded-sm" > {/* hedhi felsa mta trigger el modal gedo style ldekhel */}
                    </Skeleton>

                    
                    <div className="flex items-center gap-2 desktop-lg:gap-3">
                        <Skeleton variant="outline" size="icon" className=" size-6 desktop-lg:size-7 rounded-sm ">
                        </Skeleton>

                        <Skeleton variant="outline" size="icon" className=" size-6 desktop-lg:size-7 rounded-sm ">
                        </Skeleton>

                        <Skeleton variant="outline" size="icon" className=" size-6 desktop-lg:size-7 rounded-sm ">
                        </Skeleton>
                    </div>                    
                    
                </div>

            </div>

        </div>
    )
}

export default GarageCarCardSkeleton;