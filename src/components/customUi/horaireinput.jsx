import { Checkbox } from "../customUi/animatedCheckbox";
import { Input } from "@/components/ui/input.jsx";
import { useState } from "react";
import { Label } from "@/components/ui/label.jsx";

const WorkingHoursInput = ({field,prev}) => {
const [semaine, setsemaine] = useState(prev);
const toggleDay = (jour) => {
  const updated ={...semaine};
  updated[jour]=updated[jour] ? false :{debut:'08:00',fin:'17:00'}
  console.log(updated[jour])
  setsemaine(updated);
  field.onChange(updated)
};

const updateStartTime = (value, jour) => {
  const updated = {
    ...semaine,
    [jour]: { ...semaine[jour], debut: value },
  };
  setsemaine(updated);
  field.onChange(updated);
};

const updateEndTime = (value, jour) => {
  const updated = {
    ...semaine,
    [jour]: { ...semaine[jour], fin: value },
  };
  setsemaine(updated);
  field.onChange(updated);
};

function formatTime(time) {
  if (!time) return "";
  // if "9:00" → "09:00"
  if (/^\d:\d{2}$/.test(time)) {
    return "0" + time;
  }
  return time;
}

const joursDeLaSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <div className="px-2 flex flex-col gap-6">
      {joursDeLaSemaine.map((jour,i) => {
        const value = semaine[jour] || false;
        return (
        <div key={i} className="flex gap-6 items-center mb-2 h-8">
           <Checkbox
            className="h-4 w-4 cursor-pointer"
            id={`horaire-input-jour-${i}`}
            checked={!!value}
            onCheckedChange={() => toggleDay(jour)}
          />
          <Label htmlFor={`horaire-input-jour-${i}`} className="w-[42px] cursor-pointer inline-block font-medium">{jour}</Label>
          {
            value ?
          <div className="flex items-center ml-6">
          
          <Input
            className="  px-1 h-fit  mr-2  "
            type="time"
            value={formatTime(value?.debut) || "09:00"}
            onChange={(e) => updateStartTime(e.target.value,jour)}
          />
          à 
          <Input
            className=" px-1 h-fit ml-2  "
            type="time"
            value={formatTime(value?.fin) || "17:00"}
            onChange={(e) => updateEndTime(e.target.value,jour)}
          />
          </div> : <div className="bg-rod-foreground px-4 font-medium leading-none py-1 text-sm  rounded-md ml-6">Fermé</div>}
        </div>)
      })}
    </div>
  );
};

export default WorkingHoursInput;
