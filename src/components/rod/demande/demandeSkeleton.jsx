import { Skeleton } from "../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"


const DemandeSkeleton = ({pageSize}) => {
  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[13%] text-gray-600">
                
            </TableHead>
            <TableHead className="w-[10%] text-gray-600">
                Reçue le
                
            </TableHead>
            <TableHead className="w-[8%] text-gray-600">
                Offre
              
            </TableHead>
            <TableHead className="w-[19%] text-gray-600">
                Lieu Départ & Retour
               
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
                 Date Départ
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
              Date Retour
                
            </TableHead>
            <TableHead className="w-[7%] text-gray-600">
              Jours
            </TableHead>
            <TableHead className="w-[14%] text-gray-600">
              Montant Total
            </TableHead>
            <TableHead className=" flex justify-end w-[5%] text-gray-600">
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(pageSize)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center justify-center">
                  <Skeleton className="size-12 desktop:size-13 ml-[20%] mr-auto  rounded-full " />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                    <Skeleton className="h-3.5 desktop:h-4 w-1/3" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                    <Skeleton className="h-3.5 desktop:h-4 w-1/3" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                    <Skeleton className="h-3.5 desktop:h-4 w-1/3" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className=" ">
                  <Skeleton className="size-8  mr-4 ml-auto  rounded-full" />
                </TableCell>
                <TableCell className=" ">
                  <Skeleton className="size-8  mr-4 ml-auto  rounded-full" />
                </TableCell>
                </TableRow>
        ))}
        </TableBody>
      </Table>
  )
}

export default DemandeSkeleton