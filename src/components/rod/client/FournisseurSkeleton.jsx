import { Skeleton } from "../../ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"


const FournisseurSkeleton = ({pageSize}) => {
  return (
    <Table className="w-full">
        <TableHeader >
          <TableRow >
            <TableHead className="w-[7%] text-gray-600">
                
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
                Fournisseur
                
            </TableHead>
            <TableHead className="w-[18%] text-gray-600">
                Contact
              
            </TableHead>
            <TableHead className="w-[17%] text-gray-600">
               Matricule Fiscale
               
            </TableHead>
            <TableHead className="w-[17%] text-gray-600">
                 Type
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
              Montant Payé
                
            </TableHead>
            <TableHead className="w-[12%] text-gray-600">
              Reste à Payer
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

export default FournisseurSkeleton