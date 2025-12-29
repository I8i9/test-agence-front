import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import First from '../../../../../assets/icons/1st_place_medal.svg'
import Second from '../../../../../assets/icons/2nd_place_medal.svg'
import Third from '../../../../../assets/icons/3rd_place_medal.svg'
import ToolTipCustom from "../../../../customUi/tooltip";
import { TrendingUp, TrendingDown, Minus, Tag } from "lucide-react";


const PromosTable = ({data}) => {
  const containerRef = useRef(null);
  const [lockedHeight, setLockedHeight] = useState(null);

  // Measure height (initial + on resize)
  useLayoutEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const h = containerRef.current.offsetHeight;
      if (h > 0) {
        setLockedHeight(h);
      }
    };

    // Initial measure
    measure();

    // Re-measure on resize
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (!data || data?.length === 0){
    return  <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
      <span className='p-2 bg-rod-foreground rounded-full'><Tag className='size-5'/></span>
      <span className='text-sm font-medium text-gray-800'>Pas de promotions pour cette periode</span>
    </div>
  }

  const renderGrowth = (growth) => {
    if (growth === null || growth === undefined) {
      return (
        <span className="flex items-center gap-1 text-gray-400">
          <Minus className="w-3 h-3" />
          <span className="text-xs">N/A</span>
        </span>
      );
    }

    const isPositive = growth > 0;
    const isNeutral = growth === 0;

    return (
      <span className={`flex items-center gap-1 ${
        isNeutral ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isNeutral ? (
          <Minus className="w-3 h-3" />
        ) : isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span className="text-xs font-medium">
          {isPositive ? '+' : ''}{growth}%
        </span>
      </span>
    );
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={lockedHeight ? { maxHeight: lockedHeight } : {}}
    >
      {/* Render only after height is locked */}
      {lockedHeight ? 
         <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-9"></TableHead>
              <TableHead className="w-[25%] max-w-[25%]">Promo</TableHead>
              <TableHead className="w-[13%] max-w-[13%]">
                <ToolTipCustom 
                  trigger={<span>Vues</span>}
                  message="Nombre de clics"
                />
              </TableHead>
              <TableHead className="w-[13%] max-w-[13%]">
                <ToolTipCustom 
                  trigger={<span>Dem.</span>}
                  message="Demandes"
                />
              </TableHead>
              <TableHead className="w-[13%] max-w-[13%]">
                <ToolTipCustom 
                  trigger={<span>Cont.</span>}
                  message="Contrats"
                />
              </TableHead>
              <TableHead className="w-[18%] max-w-[18%]">
                <ToolTipCustom 
                  trigger={<span>Conv./Suc.</span>}
                  message="Taux de conversion / Taux de succès"
                />
              </TableHead>
              <TableHead className="w-[18%] max-w-[18%]">
                <ToolTipCustom 
                  trigger={<span>Croiss.</span>}
                  message="Croissance vs baseline (revenu quotidien)"
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((item, i) => (
              <TableRow key={i}>
                <TableCell>  
                  {i === 0 ? <img src={First} className="w-5 h-5" alt="1st" />
                    : i === 1 ? <img src={Second} className="w-5 h-5" alt="2nd" /> 
                    : i === 2 ? <img src={Third} className="w-5 h-5" alt="3rd" /> 
                    : <span className="text-xs font-medium ml-1.5">{i + 1}</span>}
                </TableCell>

                <TableCell className="font-normal max-w-[25%] w-[25%] truncate">
                  <ToolTipCustom
                    trigger={<span className="max-w-full truncate">{item.sequence}</span>}
                    message={item.sequence}
                  />
                </TableCell>

                <TableCell>{item.clicks}</TableCell>
                <TableCell>{item.demandes}</TableCell>
                <TableCell>{item.contracts}</TableCell>
                
                <TableCell className="text-xs">
                  {item.conversion_rate}% / {item.succes_rate}%
                </TableCell>

                <TableCell>
                  {renderGrowth(item.growth)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> : null
      }
    </div>
  );
};

export default PromosTable;