import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, 
} from "@/components/ui/form";

import { DateTimePicker2 } from "../../../customUi/dateTimePicker";
import { getAllPlaces } from "../../../../utils/states";
import { Checkbox } from "../../../customUi/animatedCheckbox";
import { addDays, differenceInCalendarDays, isAfter, isBefore, isEqual, startOfDay} from "date-fns"
import { ComboboxPlace } from "../../../customUi/placeCombobox";

const ChooseParams = ({next ,ContratSpData, setContratSpData}) => {

  const [same, setSame] = useState(ContratSpData.same || true);
  const formSchema = z.object({
    lieu_depart : z.enum(getAllPlaces(), {required_error: "Le lieu de départ est requis" , invalid_type_error: "Lieu de départ doit être dans la liste",}),
    lieu_retour : same 
    ? z.enum(getAllPlaces()).optional()  // field hidden, not required
    : z.enum(getAllPlaces(), { required_error: "Le lieu de retour est requis", invalid_type_error: "Lieu de retour doit être dans la liste",}), // field shown, required
    date_debut : z.date({
      required_error: "La date de début est requise",
    }),   
    date_fin : z.date({
      required_error: "La date de fin est requise",
    }),
  }).refine((data) => {
    // Validate that there is a calendar day at lease between date_debut and date_fin
    if (data.date_debut && data.date_fin) {
     const diff = differenceInCalendarDays(data.date_fin, data.date_debut);
     return diff > 0;
    }
    return true;
  }, {
    message: "la durée du contrat doit être au moins de 1 jour",
    path: ["date_fin"],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lieu_depart: ContratSpData.lieu_depart || undefined,
      lieu_retour: ContratSpData.lieu_retour || undefined,
      date_debut: ContratSpData.date_debut || undefined,
      date_fin: ContratSpData.date_fin || undefined,
    },
  });

  const date_debut =form.watch("date_debut");

  const handleSubmit = (data) => {
    console.log(data);
    setContratSpData(
      {
        lieu_depart: data.lieu_depart,
        lieu_retour: same ? data.lieu_depart : data.lieu_retour,
        date_debut: data?.date_debut,
        date_fin: data?.date_fin, 
        same: same 
      }
    )
    next();
  }
  
  return (
    <div className=' flex flex-col gap-4 mt-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="flex gap-2 w-full">
           <FormField
            control={form.control}
            name="lieu_depart"
            render={({ field }) => (
              <FormItem className="w-full px-0.5">
                <FormLabel>Lieu de début</FormLabel>
                <ComboboxPlace title={"Choisir le lieu de début"} field={field} />
                <FormMessage />
              </FormItem>
            )}
          />

          {
            !same &&
              <FormField
              control={form.control}
              name="lieu_retour"
              render={({ field }) => (
                <FormItem className="w-full px-0.5">
                  <FormLabel>Lieu de retour</FormLabel>
                  <ComboboxPlace title={"Choisir le lieu de retour"} field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          }
          
          </div>

          <FormField
            control={form.control}
            name="date_debut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <DateTimePicker2 disabled={(date) => isBefore(date, startOfDay(new Date())) || isAfter(date, form.watch("date_fin")) || isEqual(date, form.watch("date_fin"))} title={"Choisir la date de début"}  date={field.value} setDate={field.onChange} />
                
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_fin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <DateTimePicker2 disabled={(date) =>
                    date_debut
                      ? isBefore(date, addDays(startOfDay(date_debut), 1))
                      : isBefore(date, addDays(startOfDay(new Date()), 1))
                  } title={"Choisir la date de fin"}  date={field.value} setDate={field.onChange} />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 px-4 rounded-sm py-3 bg-rod-foreground w-full  ml-1 items-center">
            <Checkbox checked={same} onCheckedChange={setSame} className=" cursor-pointer bg-white" id="terms" />
            <Label htmlFor="terms" className="text-base cursor-pointer mt-0.5">
              Méme lieu de départ et de retour
            </Label>
          </div>
          <Button type="submit" className='w-full [&>svg]:size-8'> <Search className="mb-1" />Rechercher</Button>
        </form>
      </Form>
      
    </div>
  )
}

export default ChooseParams;