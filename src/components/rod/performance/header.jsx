import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '../../ui/button'
import { BookOpenText, ChevronDown, Sparkles } from 'lucide-react'
import { Separator } from '@//components/ui/separator'
import { Label } from '../../ui/label'
import ToolTipCustom from '../../customUi/tooltip'
import { DatePicker } from '../../ui/date-picker'
import Tablist from '../archive/tablist'
import {  subDays, subMonths, subYears, startOfDay , isBefore , differenceInDays } from 'date-fns'
import React, { useEffect } from 'react'
import RapportModal from '../../modals/performance/rapport/rapportModal'
import { toast } from 'sonner'


const tabs = [
  {
    name: 'Commerciale',
    value: 'operations',
  },
  {
    name : "Clientéle",
    value : "clients",
  },
  {
    name : "Financiers",
    value : "financiers",
  }
]

const PerformanceHeader = ({range , setRange ,activeTab , setActiveTab }) => {
    const [open , setOpen] = React.useState(false);
    const [popoverOpen , setPopoverOpen] = React.useState(false);
    const [rangeBefore , setRangeBefore] = React.useState(range);

    const applyRange = () => {
        setRange(rangeBefore);
        setPopoverOpen(false);
    }
    const ranges = {
        "LASTWEEK": { label :"Dernière semaine" , button : "1 semaine" },
        "LASTMONTH": { label :"Dernier mois" , button : "1 mois" },
        "LAST3MONTHS": { label :"Derniers 3 mois" , button : "3 mois" },
        "LAST6MONTHS": { label :"Derniers 6 mois" , button : "6 mois" },
        "LASTYEAR": { label :"Dernière année" , button : "1 an" },
        "CUSTOM": { label :"Personnalisé" , button : "Personnalisé" }
    }

    useEffect(() => {
    const from = startOfDay(rangeBefore.from).getTime()
    const to = startOfDay(rangeBefore.to).getTime()

    const today = startOfDay(new Date()).getTime()

    const check = (expectedFrom) =>
        from === startOfDay(expectedFrom).getTime()

    const update = (type) => {
        if (rangeBefore.type !== type) {
        setRangeBefore(r => ({ ...r, type }))
        }
    }

    if (to === today) {
        if (check(subDays(rangeBefore.to, 7))) {
        update("LASTWEEK"); return
        }

        if (check(subMonths(rangeBefore.to, 1))) {
        update("LASTMONTH"); return
        }

        if (check(subMonths(rangeBefore.to, 3))) {
        update("LAST3MONTHS"); return
        }

        if (check(subMonths(rangeBefore.to, 6))) {
        update("LAST6MONTHS"); return
        }

        if (check(subYears(rangeBefore.to, 1))) {
        update("LASTYEAR"); return
        }
    }

    update("CUSTOM")
}, [rangeBefore.from, rangeBefore.to])


    const setPredefined = (key) => {
    if (key === "CUSTOM") return;

    const today = startOfDay(new Date());
    let fromDate;

    switch (key) {
        case "LASTWEEK":
            fromDate = subDays(today, 7);
            break;

        case "LASTMONTH":
            fromDate = subMonths(today, 1);
            break;

        case "LAST3MONTHS":
            fromDate = subMonths(today, 3);
            break;

        case "LAST6MONTHS":
            fromDate = subMonths(today, 6);
            break;

        case "LASTYEAR":
            fromDate = subYears(today, 1);
            break;

        default:
            return;
    }
    
    const newRange = { 
        from: fromDate, 
        to: today,
        type: key 
    }; 
    setRangeBefore(newRange);
    
    setRange(newRange);
    setPopoverOpen(false);
};
    const handleFromChange = (newDate) => {
        if (!newDate) return;
        setRangeBefore(prev => {
            // 'From' cannot be after 'To'
            if (isAfter(newDate, prev.to)) {
                return { ...prev, from: newDate, to: newDate };
            }
            // Max 1 year duration
            if (differenceInDays(prev.to, newDate) > 365) {
                toast.error("La période ne peut pas dépasser un an");
                return prev;
            }
            return { ...prev, from: newDate };
        });
    };

    const handleToChange = (newDate) => {
        if (!newDate) return;
        setRangeBefore(prev => {
            // 'To' cannot be before 'From'
            if (isBefore(newDate, prev.from)) {
                return { ...prev, from: newDate, to: newDate };
            }
            // Max 1 year duration
            if (differenceInDays(newDate, prev.from) > 365) {
                toast.error("La période ne peut pas dépasser un an");
                return prev;
            }
            return { ...prev, to: newDate };
        });
    };

    console.log("range in header", rangeBefore);
  return (
    <div className='w-full flex justify-between '>
        <div>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant='ghost' className={"text-base !w-[184px]"}>{ranges[rangeBefore.type].label} <ChevronDown /></Button>
                </PopoverTrigger>
                <PopoverContent className='data-[state=open]:!zoom-in-0 data-[state=closed]:!zoom-out-0 origin-center duration-400 w-fit'>
                    <div className='grid grid-cols-3 gap-x-2 w-fit '>
                       {Object.keys(ranges)
                            .filter(key => key !== "CUSTOM")
                            .map(key => (
                                <Button
                                key={key} // safer than using index
                                variant={key === rangeBefore.type ? "default" : "ghost"}
                                onClick={()=> setPredefined(key)}
                                className={'w-[80px]'}
                                >
                                {ranges[key].button}  {/* only render the label */}
                                </Button>
                            ))}
                            
                    </div>

                    <Separator className=' mt-4 mb-2' />
                    <span className='text-sm font-medium '>
                        Plage Pérsonnalisée
                    </span>
                    <div className='mt-2 space-y-2'>
                        <div>
                            <Label htmlFor="dateDebut" className={"text-xs text-zinc-600"} >Début</Label>
                            <DatePicker alwaysButtom={true} date={rangeBefore.from} setDate={(date) => setRangeBefore(prev => ({...prev, from: date}))} />
                        </div>
                        <div>
                            <Label htmlFor="dateFin" className={"text-xs text-zinc-600"} >Fin</Label>
                            <DatePicker alwaysButtom={true} date={rangeBefore.to} setDate={(date) => setRangeBefore(prev => ({...prev, to: date}))} />
                        </div>
                        </div>
                    <Button className='w-full mt-4' onClick={applyRange} >Appliquer</Button>
                </PopoverContent>
        </Popover>
        {/*<span className='text-sm text-muted-foreground'>
            15-06-24 → 15-07-24 <span className='text-xs'>vs.</span> 15-05-24 → 14-06-24
        </span>*/}
        </div>

        <div className='flex gap-4'>
            <div key="performance-tablist" id='performance-tablist' ><Tablist keyRef="performance-tablist" activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} /></div>

            {/*<Button  id="ia" className='fixed z-20 bottom-4 right-6 overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] bg-gradient-to-r from-[#D31027] to-[#EA384D]' >
                <Sparkles />
                Analyser avec Rod IA
            </Button>*/}
            
            <ToolTipCustom
                    side="bottom"
                    trigger={
                    <Button onClick={() => setOpen(true)} >
                        <BookOpenText />
                        Générer rapport
                    </Button>
                    }
                    message={
                    <span className='flex flex-col  text-sm '>
                        <span >Générer un rapport de performance détaillé pour </span>
                            <span >un Véhicule, Marque, Modèle, Type de véhicule</span>

                        </span>
                    } />
            
        </div>

        <RapportModal open={open} close={() => setOpen(false)} dateRange={rangeBefore}/>
        
    </div>
  )
}

export default PerformanceHeader