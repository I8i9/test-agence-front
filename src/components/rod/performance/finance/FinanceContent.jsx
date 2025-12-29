import React  from 'react'
import FinanceKpi from './FinanceKpi';
import AreaChartFinance from './AreaCharts';
import DurationFinance from './durations';
import TypeFinance from './types';
import DepensesFinance from './depenses';
import PieChartFinance from './PieChart';
import { useFetchFinanceKpis } from '../../../../api/queries/performance/finances/useFetchFinanceKpis';
import { formatDateOnly } from '../../../../utils/datautils';
import { useFetchDepensesList } from '../../../../api/queries/performance/finances/useFetchFinanceDepenseList';
import { useFetchLocationsList } from '../../../../api/queries/performance/finances/useFetchFinanceLocationsList';

const FinanceContent = ({ range }) => {

  const [chart , setChart] = React.useState("revenu&depense");
  const [type , setType] = React.useState("revenu");
  const [pie , setPie] = React.useState("duree");

  // Format dates for API
  const debut = range?.from ? formatDateOnly(range?.from) : null;
  const fin = range?.to ? formatDateOnly(range?.to) : null;

  // Fetch KPI data based on the selected date range
  const { data: kpiData, isLoading: loadingKpi, isError: errorKpi } = useFetchFinanceKpis({ date_debut: debut , date_fin: fin });

  // Fetch data 
  const { data: DepensesData = [], isLoading: expensesLoading, error: expensesError } = useFetchDepensesList({
    date_debut: debut,
    date_fin: fin
  });

  const { data: Locationsdata = [], isLoading: locationsLoading, isError: locationsError } = useFetchLocationsList({ 
    date_debut: debut, 
    date_fin: fin 
  });


  console.log("Locationsdataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", Locationsdata);
  return (
    <div className='w-full h-full flex flex-col gap-4 overflow-y-auto pr-1'>
        {/* Viewport section - KPI + Chart/Table fills available space */}
        <div className='h-fit desktop:h-full flex flex-col gap-4 flex-shrink-0'>
            <FinanceKpi 
              data={kpiData} 
              loading={loadingKpi} 
              error={errorKpi}
            />
            <div className='grid gap-x-4 h-full  grid-cols-[66.3%_1fr]  '>
                <AreaChartFinance DataKey={chart} setDataKey={setChart} debut={debut} fin={fin}/> 
                <PieChartFinance DataKey={pie} setDataKey={setPie} debut={debut} fin={fin} depensesData={DepensesData} depenseLoading={expensesLoading} depenseError={expensesError} />
            </div>
        </div>

        {/* Additional scrollable content below */}
        <div  className='grid grid-cols-3 gap-4 mb-8 min-h-[450px]'>
          <div className='h-full'>
            <TypeFinance DataKey={type} setDataKey={setType}  debut={debut} fin={fin} />
          </div>

          <div className='h-full '>
            <DepensesFinance data={DepensesData} loading={expensesLoading} error={expensesError} />
          </div>

          <div className='h-full '>
            <DurationFinance data={Locationsdata} loading={locationsLoading} error={locationsError} />


          </div>
          
        </div>
    </div>
  )
}

export default FinanceContent