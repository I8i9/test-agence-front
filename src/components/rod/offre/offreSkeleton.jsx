import { Skeleton } from "../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"


const OffreSkeleton = ({pageSize}) => {
    

  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[13%] text-gray-600">
              
            </TableHead>
            <TableHead className="w-[8%] text-gray-600">
                Offre  
            </TableHead>
            <TableHead className="w-[16%] text-gray-600">
                Voiture
            </TableHead>
            <TableHead className="w-[16%] text-gray-600">
            Lieux               
            </TableHead>
            <TableHead className="w-[10%] text-gray-600">
                Prix/Jour
            </TableHead>
            <TableHead className="w-[8%] text-gray-600">
                Promo                
            </TableHead>
            <TableHead className="w-[8%] text-gray-600">
                Vue
            </TableHead>
            <TableHead className='w-[15%] text-gray-600'>
                Status
            </TableHead>
            <TableHead className=" flex justify-end w-[5%] text-gray-600">
              
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(pageSize)].map((_, index) => (
              <TableRow key={index} >
                <TableCell className="flex items-center justify-center">
                  <Skeleton className="size-12 desktop:size-13 desktop-lg:size-15 rounded-full " />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-2/3" />
                </TableCell>
                    <TableCell className='space-y-1'>
                    <Skeleton className="h-4 desktop:h-4.5 w-2/3" />
                    <Skeleton className="h-3.5 desktop:h-4 w-1/3" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-start items-center h-full gap-2">
                  <Skeleton className="h-4 desktop:h-4 w-1/3" />
                  <Skeleton className="h-4 desktop:h-4 w-1/3" />
                  </div>
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-2/3" />
                </TableCell>
                <TableCell className="space-y-1">
                  <Skeleton className="h-4 desktop:h-4.5 w-2/3" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-2/3" />
                </TableCell>
                <TableCell className="">
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell>
              <Skeleton className="size-8 rounded-full" />
                </TableCell>
                </TableRow>
        ))}
        </TableBody>
      </Table>
  )
}

export default OffreSkeleton