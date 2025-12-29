import React, { useEffect } from 'react'
import { Button } from '../../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const Header = ({ dates , setMonth , month , setYear , year }) => {
  return (
    <div className='w-full flex justify-between '>
        <DateNavigation dates={dates} setMonth={setMonth} month={month} setYear={setYear} year={year} /> 
    </div>
  )
}

export default Header


const DateNavigation = ({dates , setMonth , month , setYear , year}) => {
 const months = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const availableYears = [...new Set(dates.map(m => m.year))];
const maxYear = Math.max(...availableYears);

useEffect(() => {
  setYear(maxYear);
  // Pick the closest to my month and year
  const month = new Date().getMonth() + 1; // getMonth is 0-indexed
  const year = new Date().getFullYear();
  const isMonthAvailable = dates.some(d => d.year === year && d.month === month);
  if (isMonthAvailable) {
    setYear(year);
    setMonth(months[month-1]);
    return;
  }
  const monthsInYear = dates.filter(d => d.year === maxYear).map(d => d.month);
  setMonth(months[Math.max(...monthsInYear)-1]); // store as number
}, []);


// Navigation logic
function getNavigation(year, month) {
  const sorted = dates
    .map(d => ({ ...d, value: d.year * 12 + d.month }))
    .sort((a, b) => a.value - b.value);

  const currentValue = year * 12 + month;

  const prevDate = sorted.filter(d => d.value < currentValue).pop();
  const nextDate = sorted.find(d => d.value > currentValue);

  return { prevDate, nextDate, canGoPrev: !!prevDate, canGoNext: !!nextDate };
}

// On mount set default year and month

//On year change, reset month if current month is unavailable
const changeYear = (newYear) => {
  const isMonthAvailable = dates.some(d => d.year === newYear && d.month === (months.indexOf(month) + 1));
  console.log({isMonthAvailable});
  if (!isMonthAvailable) {
    const availableMonths = dates.filter(d => d.year === newYear).map(d => d.month);

    // get closest month
    const closestMonth = availableMonths.reduce((prev, curr) =>
      Math.abs(curr - month) < Math.abs(prev - month) ? curr : prev
    );

    setMonth(months[closestMonth-1]); // store as number
  }
  setYear(newYear);
}

const { prevDate, nextDate, canGoPrev, canGoNext } = getNavigation(year, months.indexOf(month) + 1);

  return (
    <div className='w-full flex items-center gap-2 '>
        <Button variant={"outline"} size="icon" disabled={!canGoNext} onClick={() => {
            if (canGoNext) {
                setMonth(months[nextDate.month-1]);
                setYear(nextDate.year);
            }
        }}>
            <ChevronLeft />
        </Button>
        <span className='font-semibold text-xl flex '>
             <Popover>
                <PopoverTrigger asChild>
                    <Button variant='ghost' className={"text-lg !w-[108px]"}>{month}</Button>
                </PopoverTrigger>
                <PopoverContent className='data-[state=open]:!zoom-in-0 data-[state=closed]:!zoom-out-0 origin-center duration-400 w-fit'>
                    <div className='grid grid-cols-2 gap-x-2 w-fit '>
                        {dates.filter(d => d.year === year).map((d , index) => (
                            <Button  className={`!w-[48px] !h-[32px] ${d.month === (months.indexOf(month) + 1) ? 'bg-rod-primary hover:text-white hover:bg-rod-primary/90 text-white' : ''}`} key={index} variant={"ghost"} onClick={() => setMonth(months[d.month-1])}>
                                {months[d.month-1].slice(0,3)}
                            </Button>
                        ))}
                    </div>
                    
                </PopoverContent>
                </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant='ghost' className={"text-lg !w-[68px]"}>{year}</Button>
                </PopoverTrigger>
                <PopoverContent className='data-[state=open]:!zoom-in-0 data-[state=closed]:!zoom-out-0 origin-center duration-400 w-fit'>
                    <div className='grid grid-cols-2 gap-x-2 w-fit '>
                        {availableYears.sort((a, b) => b - a).map((y, index) => (
                            <Button  
                                className={`!w-[48px] !h-[32px] ${y === year ? 'bg-rod-primary text-white hover:text-white hover:bg-rod-primary/90' : ''}`} 
                                key={index} 
                                variant="ghost" 
                                onClick={() => changeYear(y)}
                            >
                                {y}
                            </Button>
                        ))}
                    </div>
                    
                </PopoverContent>
                </Popover>
        </span>

        <Button variant={"outline"} size="icon" disabled={!canGoPrev} onClick={() => {
            if (canGoPrev) {
                setMonth(months[prevDate.month-1]);
                setYear(prevDate.year);
            }
        }}>
            <ChevronRight />
        </Button>
    </div>
  )
}


    