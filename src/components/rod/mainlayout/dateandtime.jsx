import { useState,useEffect } from "react";
function DateAndTime() {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentDate(new Date());
      }, 1000);
      return () => clearInterval(intervalId);
    }, []);
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const options = { 
        weekday: 'long', 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      let newForm= currentDate.toLocaleDateString('fr-FR', options).split(' ');
      const jour = newForm[0].charAt(0).toUpperCase() + newForm[0].slice(1); 
      const mois = newForm[2].charAt(0).toUpperCase() + newForm[2].slice(1); 
      newForm= `${jour}, ${mois} ${newForm[1]}, ${newForm[3]}`;

  return (
    <div className="flex flex-col items-end h-auto w-auto ">
      <div className="text-rod-primary leading-tight font-semibold text-xl transition-all duration-300 ease-in-out hover:scale-110 cursor-none flex gap-0.5 "><span className="px-0.5">{hours}</span>:<span className="px-0.5">{minutes<10 ? '0':''}{minutes}</span>:<span className="px-0.5">{seconds<10 ? '0':''}{seconds}</span></div>
      <div className="text-gray-500 leading-tight gap-1  ">{newForm}</div>
    </div>
  );
}

export default DateAndTime;