import { Skeleton } from "../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"


const ClientSkeleton = ({pageSize}) => {
  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[7%] text-gray-600">
                
            </TableHead>
            <TableHead className="w-[20%] text-gray-600">
                Client
                
            </TableHead>
            <TableHead className="w-[14%] text-gray-600">
                Téléphone
              
            </TableHead>
            <TableHead className="w-[20%] text-gray-600">
               Dernière location
               
            </TableHead>
            <TableHead className="w-[10%] text-gray-600">
                 Locations
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
              Revenus générés
                
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
              Reste à payer
            </TableHead>
            <TableHead className=" flex justify-end w-[5%] text-gray-600">
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(pageSize)].map((_, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center justify-center">
                  <Skeleton className="size-12 ml-[20%] mr-auto  rounded-full " />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell >
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell >
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell>
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell >
                  <Skeleton className="size-8  mr-4 ml-auto  rounded-full" />
                </TableCell>
                </TableRow>
        ))}
        </TableBody>
      </Table>
  )
}

export default ClientSkeleton