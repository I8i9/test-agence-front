import { ArrowDown, ArrowDownRight, Banknote, BanknoteArrowUp, CalendarCheck, Check, CheckCircle, CheckCircle2, Coins, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import DetailItem from '../../../customUi/detailitem'

const Status = ({ vehicule }) => {
  return (
    <div className='h-full w-full'>
         <Card className="shadow-none h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-medium text-lg">
                <BanknoteArrowUp className="w-5 h-5" />
                Statut de paiement
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6  ">
                <div className="flex flex-col gap-y-12">

                  
                  <div className='flex justify-between '>

                    
                    <DetailItem icon={CheckCircle2} label="Prix / Paiement" className='w-fit'>
                      {vehicule.prix_achat_garage} DT
                        {vehicule.type_achat_garage  === "COMPTANT" ?
                          " en Comptant" :
                          vehicule.type_achat_garage === "LEASING" ?
                          " par Leasing" :
                          " à crédit"
                        }
                        
                    </DetailItem>
                  <DetailItem icon={Coins} label="Valeur Comptable">
                            {vehicule.valeur_achat_garage} DT
                    </DetailItem>

                 

                    <DetailItem icon={ArrowDown} label="Amortissement annuel">
                            {vehicule.ammortissement_valeur} DT
                        </DetailItem>

                    <DetailItem icon={CalendarCheck} label="Durée d'usage">
                            {vehicule.ammortissement_period} {vehicule.ammortissement_period > 1 ? 'ans' : 'an'}
                        </DetailItem>

                    

                    </div>

                    <div className='col-span-full'>
                            <AmortizationTable vehicule={vehicule} />   
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
  )
}

export default Status;


import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import {  addMonths, format } from 'date-fns'

export const AmortizationTable = ({ vehicule }) => {
  const today = new Date();

  const {
    valeur_achat_garage,
    ammortissement_valeur,
    ammortissement_period,
    date_achat_garage,
  } = vehicule;

  const rows = useMemo(() => {
    const startDate = new Date(date_achat_garage);
    const totalMonths = ammortissement_period * 12;
    const monthlyDepreciation = ammortissement_valeur / 12;

    const allRows = [];

    for (let i = 0; i <= totalMonths; i++) {
      const current = addMonths(startDate, i);
      const ageYears = Math.floor(i / 12);
      const ageMonths = i % 12;
      const valeur = Math.max(valeur_achat_garage - monthlyDepreciation * i, 0);

      allRows.push({
        date: current,
        year: current.getFullYear(),
        month: format(current, "LLL"), // abbreviated month
        age: `${ageYears > 0 ? ageYears + " an" + (ageYears > 1 ? "s" : "") : ""} ${ageMonths > 0 ? ageMonths + " mois" : ""}`.trim(),
        valeur,
      });
    }

    return allRows;
  }, [vehicule]);

  // Find the current month index
  const currentMonthIndex = rows.findIndex(
    (r) =>
      r.date.getFullYear() === today.getFullYear() &&
      r.date.getMonth() === today.getMonth()
  );

  const displayedRows = [];

  rows.forEach((row, index) => {
    // Past years before month-before-current
    if (index < currentMonthIndex - 1) {
      if (index % 12 === 0) displayedRows.push({ type: "year", age: row.age, ...row });
      if (index === currentMonthIndex - 2) displayedRows.push({ type: "ellipsis" });
    }
    // One month before, current, one month after
    else if (index >= currentMonthIndex - 1 && index <= currentMonthIndex + 1) {

        if(index === currentMonthIndex) {   
            displayedRows.push({ type: "month", ...row, isCurrent: true });
        } else {
        displayedRows.push({ type: "month", ...row, isCurrent: index === currentMonthIndex });
        }
    }
    // Future years after month-after-current
    else if (index > currentMonthIndex + 1) {
      if ((index - currentMonthIndex) % 12 === 2) displayedRows.push({ type: "ellipsis" });
      if (index % 12 === 0) displayedRows.push({ type: "year", ...row });
    }
  });

  return (
    <Table className="w-full ">
      <TableHeader className="text-muted-foreground">
        <TableRow>
          <TableCell >Année</TableCell>
          <TableCell >Mois</TableCell>
          <TableCell >Âge</TableCell>
          <TableCell className="text-end ">Valeur Comptable</TableCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {displayedRows.map((row, i) => {
          if (row.type === "ellipsis") {
            return null
          }

          if (row.type === "year") {
            return (
              <TableRow className="" key={i} >
                <TableCell>{row.year}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell className="text-end">{Math.ceil(row.valeur)} DT</TableCell>
              </TableRow>
            );
          }

          return (
            <TableRow key={i} className={row.isCurrent ? "bg-blue-100 text-blue-600 font-semibold hover:bg-blue-100" : ""}>
              <TableCell>{row.year}</TableCell>
              <TableCell>{row.month}</TableCell>
              <TableCell>{row.age || "< mois"}</TableCell>
              <TableCell className="text-end">{Math.ceil(row.valeur)} DT</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

