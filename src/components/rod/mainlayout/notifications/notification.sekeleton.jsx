import { Skeleton } from "@/components/ui/skeleton"

const NotificationSkeleton = () => {
    return (
        <div className="px-0 py-0 space-y-0 ">
            {Array.from({ length: 4 }).map((_, index) => {
                return (
                    <div
                        key={index}
                        className="flex items-start gap-4 px-4 py-3 cursor-pointer  "
                    >
                        <Skeleton
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0 ">
                            <div className="flex items-start gap-1.5">
                                <Skeleton className="h-4 w-48 mb-1.5" />
                                <Skeleton className="w-2 h-2 mt-0.5 rounded-full" />
                            </div>
                            <Skeleton className="h-3.5 mb-1 leading-none break-words w-full" />
                            <div className="flex items-center gap-1">
                                <Skeleton className="h-3.5 w-16 leading-tight mt-0.5" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default NotificationSkeleton
