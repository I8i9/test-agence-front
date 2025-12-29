import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {CircleArrowDown, Info} from "lucide-react"
import {Badge} from '../../components/ui/badge'
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

export const ToolTipGouvernorat = ({ list }) => {
    if (list && list.length <= 2) {
      return (
        <div className="flex items-center gap-2 text-sm desktop-lg:text-base font-medium">
          {list.map((item, i) => (
            <Badge key={i} variant='secondary' className='text-sm desktop-lg:text-base'>
                     {item}
            </Badge>
          ))}
        </div>
      )
    }
    return (
      <TooltipProvider skipDelayDuration={300}>
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild>
        <div className="w-fit  flex flex-col gap-1.5 font-medium">
          <div className="flex gap-2 items-center">
          <Badge variant='secondary' className='text-sm'>{list[0]}</Badge>
          <Badge variant='secondary' className='text-sm'>{list[1]}</Badge>
          </div>
          <div className='text-xs desktop-lg:text-sm w-fit  text-muted-foreground ml-1 '>+{list.length-2} Autre</div>
        </div>
        </TooltipTrigger>
        <TooltipContent side='bottom' avoidCollisions={true} collisionPadding="16" align="center" className="p-2 rounded shadow">
        <div className="flex flex-col items-start gap-2">
          {Array.from({ length: Math.ceil(list.length / 5) }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-2">
            {list.slice(rowIdx * 5, rowIdx * 5 + 5).map((item, i) => (
            <Badge key={i + rowIdx * 5} variant='secondary' className='text-sm'>
              {item}
            </Badge>
            ))}
          </div>
          ))}
        </div>
        </TooltipContent>
      </Tooltip>
      </TooltipProvider>
    )
  }




export const ToolTipPrix = ({ prix, prixdynamique, taux }) => {
  const applyDiscount = (value) => (taux ? value - (value * taux) / 100 : value);

  // If no dynamic pricing
  if (!prixdynamique || Object.keys(prixdynamique).length === 0) {
    return (
      <div className="flex flex-col items-start">
        {taux && (
          <div className="text-xs desktop-lg:text-sm line-through text-muted-foreground">
            {Math.ceil(prix)} DT
          </div>
        )}
        <div className="text-base desktop-lg:text-lg font-semibold">
          {Math.ceil(applyDiscount(prix))} DT
        </div>
      </div>
    );
  }

  // Prepare dynamic pricing ranges
  const sortedKeys = Object.keys(prixdynamique).map(Number).sort((a, b) => a - b);
  const ranges = [
    { min: 1, max: sortedKeys[0], price: prix },
    ...sortedKeys.map((key, index) => ({
      min: key + 1,
      max: sortedKeys[index + 1] ?? null,
      price: prixdynamique[key],
    })),
  ];

  return (
    <TooltipProvider skipDelayDuration={300}>
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-start cursor-pointer">
            {taux && (
              <div className="text-xs desktop-lg:text-sm line-through decoration-[1.5px] text-muted-foreground">
                {Math.ceil(prix)} DT
              </div>
            )}
            <div className="text-base desktop-lg:text-lg font-semibold flex items-center gap-1">
              {Math.ceil(applyDiscount(prix))} DT
              <CircleArrowDown className="text-rod-accent" size={16} />
            </div>
          </div>
        </TooltipTrigger>

        <TooltipContent
          side="bottom"
          align="end"
          className="bg-white border p-0.5 rounded shadow max-w-[320px]"
        >
          <Table className="w-full text-left">
            
            <TableBody>
              {ranges.map(({ min, max, price }, index) => {
                const isLast = max === null;
                const label = isLast ? `+${min}j` : `${min} -${max}j`;
                return (
                  <TableRow key={index}>
                    <TableCell className='text-start font-medium text-gray-600'>{label}</TableCell>
                    <TableCell className='flex justify-end'>
                      {taux ? (
                        <div className="flex items-baseline gap-1">
                          <span className="line-through decoration-[1.5px] text-muted-foreground text-xs desktop-lg:text-sm">
                            {Math.ceil(price)} DT
                          </span>
                          <span className="font-semibold">
                            {Math.ceil(applyDiscount(price))} DT
                          </span>
                        </div>
                      ) : (
                        <span className="font-medium">{Math.ceil(price)} DT</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};



export const ToolTipImage=({src,version,title})=>{
  return(
   <TooltipProvider skipDelayDuration={300}>
    <Tooltip delayDuration={700}>
    <TooltipTrigger asChild>
      <div className="w-fit min-w-22 desktop:min-w-24 desktop-lg:min-w-24  h-12 desktop:h-13 desktop-lg:h-13 max-w-24 relative cursor-pointer ">
        <img className="h-12 desktop:h-13 desktop-lg:h-13 w-auto object-contain" width={48} height={48} loading="eager" src={src} alt={title || version} />
       <Info className="absolute -right-2 w-3 h-3  desktop-lg:-right-3 top-0  desktop-lg:w-4 desktop-lg:h-4 text-gray-500" />
      </div>
    </TooltipTrigger>
        <TooltipContent align='center' className="text-sm bg-white border rounded shadow">
          <div className="flex flex-col items-start">
          {version}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}


