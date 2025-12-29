import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { SearchX , ArrowUp , ArrowDown, RefreshCcw} from "lucide-react";
import { flexRender } from "@tanstack/react-table";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";


// Make shadcn TableRow animatable
const MotionTableRow = motion.create(TableRow);

export const TableContent = ({
  table,
  // eslint-disable-next-line no-unused-vars
  icon : Icon = SearchX,
  NoContentTitle,
  NoContentDescription,
  SucessMode = false,
  isError = false,
  refetch = () => {},
}) => {
  const originalRows = table.getPreFilteredRowModel().rows;
  const rows = table.getRowModel().rows;
  const colSpan = table.getVisibleLeafColumns().length;

  const rowVariants = {
    initial: { opacity: 0, },
    animate: () => ({
      opacity: 1,
      transition: { duration: 0.25, }, // staggered
    }),
    exit: { opacity: 0,  transition: { duration: 0.2 } },
  };

  return (
    <Table
      className={`w-full text-rod-primary table-fixed ${
        originalRows.length === 0 || rows.length === 0 ? "h-full" : ""
      }`}
    >
      <TableHeader className="h-[40.4px]">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta;
              return (
                <TableHead
                  className="text-gray-600 h-[40.4px] cursor-pointer"
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ ...meta }}
                >
                <div className="flex items-center gap-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() && (
                      <span className="text-gray-400 flex-shrink-0">
                        {header.column.getIsSorted() === 'desc' ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
                      </span>
                    )}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {
          isError ? (
            <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="h-64">
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center ">
                
 
                <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl text-gray-600 desktop-xl:text-xl text-lg  text-center text-wrap max-w-[640px]">
                  Une erreur est survenue lors du chargement des données.
                </p>
                <Button className="mt-4" onClick={refetch}><RefreshCcw /> Rafraîchir </Button>
              </div>
            </TableCell>
          </TableRow>
          ) : originalRows.length === 0 ? (
          // --- Empty Table State (no data at all)
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="h-64">
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center ">
                <div className={`laptop:h-12 desktop:h-12 desktop-lg:h-16 desktop-xl:h-16 laptop:w-12 desktop:w-12 desktop-lg:w-16 desktop-xl:w-16 h-16 w-16 ${SucessMode ? 'bg-green-100' : 'bg-red-100'}  flex items-center justify-center rounded-xl`}>
                  <Icon className={`${SucessMode ? 'text-green-600' : 'text-rod-accent'} laptop:h-8 desktop:h-8 desktop-lg:h-10 desktop-xl:h-10 laptop:w-8 desktop:w-8 desktop-lg:w-10 desktop-xl:w-10`} />
                </div>
                <h3 className="laptop:text-xl desktop:text-xl desktop-lg:text-2xl desktop-xl:text-2xl text-xl font-semibold mt-2">
                  {NoContentTitle}
                </h3>
                <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl desktop-xl:text-xl text-lg text-gray-500 text-center text-wrap max-w-[640px]">
                  {NoContentDescription}
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : rows.length === 0 ? (
          // --- Filtered state but no results
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={colSpan} className="h-64">
              <div className="w-full h-full flex flex-col gap-1 items-center justify-center">
                <div className="laptop:h-12 desktop:h-12 desktop-lg:h-16 desktop-xl:h-16 laptop:w-12 desktop:w-12 desktop-lg:w-16 desktop-xl:w-16 h-16 w-16 bg-rod-foreground flex items-center justify-center rounded-full -mt-10">
                  <SearchX className="laptop:h-8 desktop:h-8 desktop-lg:h-10 desktop-xl:h-10 laptop:w-8 desktop:w-8 desktop-lg:w-10 desktop-xl:w-10" />
                </div>
                <h3 className="laptop:text-xl desktop:text-xl desktop-lg:text-2xl desktop-xl:text-2xl text-xl font-semibold mt-2">
                  Oups... Aucun résultat trouvé
                </h3>
                <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl desktop-xl:text-xl text-lg text-gray-500 text-center max-w-[640px]">
                  Essayez d’ajuster vos filtres
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          // --- Animated Rows
          <AnimatePresence mode="wait">
            {rows.map((row, index) => (
              <MotionTableRow
                key={row.id}
                variants={rowVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={index}
                className="group"
                layout
              >
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta;
                  return (
                    <TableCell key={cell.id} style={{ ...meta }}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </MotionTableRow>
            ))}
          </AnimatePresence>
        )}
      </TableBody>
    </Table>
  );
};
