import { Input } from "@/components/ui/input"
import { DatePicker } from "../ui/date-picker"
import { setHours, setMinutes, format } from "date-fns"
import { FormatDateEEEEddMMyyyy} from "../../utils/dateConverter"

export const DateTimePicker = ({disabled , title , date, setDate ,className= "" }) => {
  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":").map(Number)

    if (!isNaN(hours) && !isNaN(minutes)) {
      let updated = setHours(date ?? new Date(), hours)
      updated = setMinutes(updated, minutes)

      setDate(updated)
    }
  }

  const getTimeString = () => {
    if (!date) return ""
    return format(date, "HH:mm")
  }


  return (
    <div className="flex gap-2 p-0.5 w-full">
      <div className="w-full">
        <DatePicker disabled={disabled} title={title} className={"!text-base " + className} date={date} setDate={setDate} />
      </div>
      <div>
        <Input
          type="time"
          id="time-picker"
          value={getTimeString()}
          onChange={handleTimeChange}
          className={"!text-base " + className}
        />
      </div>
    </div>
  )
}

import { TimeInput } from "./timeInput"

export const DateTimePicker2 = ({ date, setDate ,title ,disabled,disabledbutton=false,defaultMonth}) => {

  return (
    <div className="flex gap-4 pl-0.5 pr-1 w-full">
      <div className="w-full">
        <DatePicker title={title} disabled={disabled} defaultMonth={defaultMonth} disabledButton={disabledbutton} className={"!text-sm"} date={date} setDate={setDate} />
      </div>
      <span className="text-base font-medium flex items-center leading-none">à</span>
      <div>
       <TimeInput date={date} setDate={setDate} disabled={disabledbutton} />
      </div>
    </div>
  )
}