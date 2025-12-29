import React from 'react'
import useFetchDates from '../api/queries/archive/useGetDates';
import Header from '../components/rod/archive/header';
import { Jelly } from 'ldrs/react';

import ArchiveContent from '../components/rod/archive/content';

const ArchivePage = () => {
  const [year , setYear] = React.useState(null);
  const [month , setMonth] = React.useState(null);
  const [selectedTab , setSelectedTab] = React.useState("archive");
  const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  
  const {isLoading, data: dates} = useFetchDates();
  console.log(dates);

 



  if (isLoading) {
    return <div className='h-full w-full flex  flex-col items-center justify-center'>
          <span  className='mt-1' >

            {
              <Jelly
                size="40"
                speed="0.9"
                color="#D90429" 
              /> 
            }

          </span>

      </div>
  }

  return (
    <div className='h-full w-full flex flex-col '>
      {/* archive header */}
      <Header months={months} selectedTab={selectedTab} setSelectedTab={setSelectedTab} dates={dates} setMonth={setMonth} month={month} setYear={setYear} year={year} />

              <ArchiveContent year={year} month={months.indexOf(month) + 1} />

    </div>
  )
}

export default ArchivePage