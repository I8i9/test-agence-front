import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ReservationCardSkeleton = () => {
  return (
    <Card className="cursor-pointer py-4 shadow-none w-full h-[130px]">
      <CardContent className="px-4 space-y-3">
        <div className="flex justify-between items-start">
          {/* Left side */}
          <div className="flex flex-col items-start gap-0.5">
            <Skeleton className="h-5 w-16 rounded-md" /> {/* #sequence */}
            <Skeleton className="h-4 w-24 rounded-md" /> {/* client */}
          </div>

          {/* Right side */}
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-5 w-20 rounded-md" /> {/* status badge */}
            <Skeleton className="h-5 w-14 rounded-md" /> {/* price */}
          </div>
        </div>

        {/* Dates + duration */}
        <div className="flex flex-col gap-0.5 items-start">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Skeleton className="h-4 w-28 rounded-md" /> {/* start date */}
            <Skeleton className="h-4 w-28 rounded-md" /> {/* end date */}
            <Skeleton className="h-4 w-16 rounded-md" /> {/* duration */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReservationCardSkeleton
