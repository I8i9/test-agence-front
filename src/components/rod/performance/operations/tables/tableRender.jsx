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



const TableRender = ({ data , title , hideViews = false }) => {
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
              <TableHead  className={'w-[30%] max-w-[30%]'}>{title}</TableHead>
              {!hideViews && <TableHead className="w-[15%] max-w-[15%]">Vues</TableHead>}
              <TableHead className="w-[16%] max-w-[16%]">
                <ToolTipCustom 
                trigger = {<span  >Dem.</span>}
                message = "Demandes"
                />
              </TableHead>
              <TableHead className="w-[16%] max-w-[16%]">
                 <ToolTipCustom 
                trigger = {<span  >Cont.</span>}
                message = "Contrats"
                />
                </TableHead>
              <TableHead className="w-[23%] max-w-[23%]">
                 <ToolTipCustom 
                trigger = {<span  >
                  {hideViews ? "Succés" : "Conv. / Suc."}
                </span>}
                message = {hideViews ? "Taux de succès" : "Taux de conversion / Taux de succès"}
                />
               
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((item, i) => (
              <TableRow key={i}>
                <TableCell >  
                {i === 0 ? <img src={First} className="w-5 h-5" />
                  : i === 1 ?<img src={Second} className="w-5 h-5" /> 
                  : i === 2 ? <img src={Third} className="w-5 h-5" /> : <span className="text-xs font-medium ml-1.5">{i + 1}</span> }</TableCell>


                <TableCell className="font-normal max-w-[25%] w-[25%] truncate ">
                  <ToolTipCustom
                    trigger={<span className="max-w-full truncate">{item.sequence}</span>}
                    message={item.sequence}
                  />
                </TableCell>

                {!hideViews ? <TableCell>{item.clicks}</TableCell> : null}
                <TableCell>{item.demandes}</TableCell>
                <TableCell>{item.contracts}</TableCell>
                <TableCell>
                  {
                    hideViews ? <>{item.succes_rate}%</> : <>{item.conversion_rate}% / {item.succes_rate}%</>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> : null
      }
    </div>
  );
};

export default TableRender;
