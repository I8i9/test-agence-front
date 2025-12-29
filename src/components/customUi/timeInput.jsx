"use client";

import  { useRef } from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./time-picker-input";

export function TimeInput({ date, setDate,disabled }) {
  const minuteRef = useRef(null);
  const hourRef = useRef(null);

  return (
    <div className="flex items-end gap-2">
      <div className="grid relative gap-1 text-center">
        <Label htmlFor="hours" className="text-xs absolute leading-none  -top-5">
          Heures
        </Label>
        <TimePickerInput
          disabled={disabled}
          picker="hours"
          date={date}
          setDate={setDate}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>

      <div className="grid gap-1  relative text-center">
        <Label htmlFor="minutes" className="text-xs leading-none absolute -top-5">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={setDate}
          disabled={disabled}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
        />
      </div>


      
    </div>
  );
}
