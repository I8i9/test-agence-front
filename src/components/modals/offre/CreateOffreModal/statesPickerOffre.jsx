import React, {  useEffect } from 'react'
import { Select, SelectContent , SelectTrigger , SelectItem , SelectValue } from "@/components/ui/select";
import { TunisianStates } from '../../../../utils/states';
import { Plus, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ToolTipCustom from '../../../customUi/tooltip';


const StatesPickerOffre = ({form , defaultStock}) => {
    const [value, setValue] = React.useState("");
    const [stock, setStock] = React.useState(defaultStock);
    const [isAll, setIsAll] = React.useState(
        Array.isArray(defaultStock) && defaultStock.length === TunisianStates.length 
    );

    useEffect(() => {
        if (isAll) {
            setStock(form.getValues("gouvernorat") || []);
            console.log("All states selected" , form.getValues("gouvernorat"));
            form.setValue("gouvernorat", TunisianStates);
        } else {
            console.log("Not all states selected", form.getValues("gouvernorat"));
            if (stock.length === TunisianStates.length ) {
                setStock([]);
                form.setValue("gouvernorat", []);
            } else {
                form.setValue("gouvernorat", stock);
            }
           
        }

    }, [isAll]);

    useEffect(() => {
        if (!value || value === "") return;
        const currentStates = form.getValues("gouvernorat") || [];
        
        if (currentStates.includes(value)) {
            setValue("");
            return;
        }
        const updatedStates = [...currentStates, value];
        form.setValue("gouvernorat", updatedStates);
        setValue("");
        console.log(form.getValues("gouvernorat"));
    }, [value]);


return (
    <div className="flex  gap-2">
    <Select value={value} onValueChange={setValue} className="w-full">
        <SelectTrigger className="w-full">
           <SelectValue placeholder={"Ajouter un gouvernorat à la liste "} />
        </SelectTrigger>
        <SelectContent align="start"  className="max-h-60 w-full p-2 overflow-y-auto">
            {TunisianStates.length === 0 ? (
                <SelectItem key="no-results" disabled>Aucun résultat trouvé</SelectItem>
            ) :
            TunisianStates.filter((state) => !(form.getValues("gouvernorat") || []).includes(state)).length === 0 ? (
                <SelectItem key="all-selected" disabled>Tous les gouvernorats sont déjà sélectionnés</SelectItem>
            ) :
            (
               TunisianStates.filter((state) => !(form.getValues("gouvernorat") || []).includes(state))
                .map((state) => (
                    <SelectItem value={state} key={state} className="hover:bg-gray-100">
                    {state}
                    </SelectItem>
                ))

            )}
        </SelectContent>
    </Select>
    <ToolTipCustom
    trigger={
    <Button type="button" onClick={()=> setIsAll(!isAll)} variant="ghost">
        {isAll ?
        <>
        <X className='mb-0.25' />
        Tous supprimer
        </>
        : 
        <>
        <Plus className='mb-0.25' />
        Tous ajouter
        </>
        }
    </Button>
    }
    message={
        isAll ? "Supprimer tous les gouvernorats" : "Ajouter tous les gouvernorats"
    }
    >
    </ToolTipCustom>
    </div>
);
}

export default StatesPickerOffre