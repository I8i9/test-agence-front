import React, { useState } from 'react'
import OperationsKpi from './operationsKpi'
import AreaChartOperations from './AreaChart'
import TableOperations from './table'
import { formatDateOnly } from '../../../../utils/datautils'
import { useFetchOperationsKpis } from '../../../../api/queries/performance/operations/useFetchOperationsKpi'

const OperationsContent = ({ range }) => {

  const [chart , setChart] = useState("clicks");
  const [table , setTable] = useState("offre");  

  // Format dates for API
  const debut = range?.from ? formatDateOnly(range?.from) : null;
  const fin = range?.to ? formatDateOnly(range?.to) : null;

  // Fetch KPI data based on the selected date range
  const {data: kpiData, isLoading: loadingKpi, isError: errorKpi } = useFetchOperationsKpis({
    date_debut: debut,
    date_fin: fin
  });

  

  return (
    <div className='w-full h-full flex-1 flex flex-col gap-4 overflow-y-auto '>
        <OperationsKpi
            data={kpiData} 
            loading={loadingKpi} 
            error={errorKpi}  />
        <div className='grid gap-x-4 grid-cols-[55%_1fr] desktop:grid-cols-[60%_1fr] desktop-lg:grid-cols-[63%_1fr] h-full w-full'>
            {/* Area Chart */}
           <AreaChartOperations DataKey={chart} setDataKey={setChart} debut={debut} fin={fin}/> 
            {/* Table */}
            <TableOperations DataKey={table} setDataKey={setTable} debut={debut} fin={fin}/>

        </div>
    </div>

  )
}

export default OperationsContent