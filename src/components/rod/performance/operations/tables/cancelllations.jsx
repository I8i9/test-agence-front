import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { raisonsShow , raisonSource} from '../../../../../utils/demandReasons'
import First from '../../../../../assets/icons/1st_place_medal.svg'
import Second from '../../../../../assets/icons/2nd_place_medal.svg'
import Third from '../../../../../assets/icons/3rd_place_medal.svg'
import ToolTipCustom from "../../../../customUi/tooltip";
import { XCircle } from "lucide-react";


const CancellationsTable = ({data}) => {

  
  const containerRef = useRef(null);
  const [lockedHeight, setLockedHeight] = useState(null);


  const readyData = data?.map(item => {
    return {
      ...item,
      sequence: raisonsShow[item.sequence] || "Inconnu",
      nature: raisonSource[item.sequence] || "Inconnu"
    }
  });

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

  if (!data || data?.length===0){
    return  <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
      <span className='p-2 bg-rod-foreground rounded-full'><XCircle className='size-5'/></span>
      <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
    </div>
  }

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
              <TableHead  className={'w-[35%] max-w-[35%]'}>Raison</TableHead>
              <TableHead className="w-[25%] max-w-[25%]">
                Nature
              </TableHead>
              <TableHead className="w-[25%] max-w-[25%]">
                Occurences
              </TableHead>
              <TableHead className="w-[15%] max-w-[15%]">
                 Taux
                </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {readyData?.map((item, i) => (
              <TableRow key={i}>
                <TableCell >  
                {i === 0 ? <img src={First} className="w-5 h-5" />
                  : i === 1 ?<img src={Second} className="w-5 h-5" /> 
                  : i === 2 ? <img src={Third} className="w-5 h-5" /> : <span className="text-xs font-medium">#{i + 1}</span> }</TableCell>


                <TableCell className="font-normal max-w-[25%] w-[25%] truncate ">
                  <ToolTipCustom
                    trigger={<span className="max-w-full truncate">{item.sequence}</span>}
                    message={item.sequence}
                  />
                </TableCell>
                <TableCell>{item.nature}</TableCell>
                <TableCell>{item.nbre}</TableCell>
                <TableCell>{item.pourcentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> : null
      }
    </div>
  );
};

export default CancellationsTable;
