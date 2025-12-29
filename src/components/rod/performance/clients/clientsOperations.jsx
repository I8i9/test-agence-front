import React from 'react'
import ClientsKpi from './ClientsKpi';
import Clients from './clients';
import Sources from './sources';
import Regions from './regions';
import { formatDateOnly } from '../../../../utils/datautils';
import { useFetchClientTypes } from '../../../../api/queries/performance/clients/useFetchClientTypes';
import { useFetchClientSources } from '../../../../api/queries/performance/clients/useFetchClientSources';
import { useFetchClientRegions } from '../../../../api/queries/performance/clients/useFetchClientRegions';
import { useFetchClientKpis } from '../../../../api/queries/performance/clients/useFetchClientKpis';


const ClientsContent = ({range}) => {
  
  // Format dates for API
  const debut = range?.from ? formatDateOnly(range?.from) : null;
  const fin = range?.to ? formatDateOnly(range?.to) : null;
  
  
  // Fetch client KPIs
  const { data: kpisData, isLoading, isError } = useFetchClientKpis({ date_debut: debut , date_fin: fin });

  // Fetch client types distribution (Pie chart)
  const { data: typesData, isLoading: loadingTypes, isError: errorTypes } = useFetchClientTypes();

  // Fetch client sources distribution (Radar chart)
  const { data: sourcesData, isLoading: loadingSources, isError: errorSources } = useFetchClientSources();

  // Fetch client regions distribution
  const { data: regionsData, isLoading: loadingRegions, isError: errorRegions } = useFetchClientRegions();

  return (
    <div className='w-full h-full flex-1 flex flex-col gap-4  '>
        <ClientsKpi data={kpisData} loading={isLoading} error={isError} />
         <div  className='grid gap-x-4 grid-cols-3 h-full w-full '>
          <Clients data={typesData} loading={loadingTypes} error={errorTypes} />

          <Sources data={sourcesData} loading={loadingSources} error={errorSources} />
          <Regions data={regionsData} loading={loadingRegions} error={errorRegions} />

          
        </div>
    </div>

  )
}

export default ClientsContent