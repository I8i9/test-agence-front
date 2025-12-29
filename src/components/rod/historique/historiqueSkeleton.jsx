import { Skeleton } from "../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"


const HistoriqueSkeleton = ({pageSize}) => {
  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[15%] text-gray-600">
                Date & heure
            </TableHead>
            <TableHead className="w-[15%] text-gray-600">
                Agent
                
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
                Type d\'objet
              
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
                Action               
            </TableHead>
            <TableHead className="w-[13%] text-gray-600">
                 Ref Objet
            </TableHead>
            <TableHead className="w-[33%] text-gray-600">
              Détails
                
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {[...Array(pageSize)].map((_, index) => (
              <TableRow className="h-[65px]" key={index}>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                    <Skeleton className="h-3.5 desktop:h-4 w-1/3 mt-1" />  
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell className="space-y-1">
                    <Skeleton className="h-4 desktop:h-4.5 w-3/4" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 desktop:h-4.5 w-full" />
                </TableCell>

                </TableRow>
        ))}
        </TableBody>
      </Table>
  )
}

export default HistoriqueSkeleton