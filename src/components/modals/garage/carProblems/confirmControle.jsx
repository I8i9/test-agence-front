import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"
import React, { useState } from "react";

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { useUpdateGarage } from "../../../../api/queries/garage/useUpdateGarage"
import { DatePicker } from "../../../ui/date-picker";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import {  formatDateTime, luxonToJSDate } from "../../../../utils/datautils";

export const ConfirmControle = ({id,next,setCost}) => {

    const {mutate : updateGarage } = useUpdateGarage();


    const schema = z.object({
      date_assurance: z.date({
        required_error: "La date d'assurance est requise.",
        invalid_type_error: "La date d'assurance doit être une date valide.",
      }),
    });
    console.log("next wey",luxonToJSDate(next));
    
      const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
          date_assurance: luxonToJSDate(next) || null ,
        },
      });

    
      const handleSubmit=(data)=>{
        console.log("daatata",data);
        updateGarage({
            id_garage: id,
            visite_technique: formatDateTime(data.date_assurance),
        },
        {
            onSuccess : () => {console.log("successss" , next); setCost ({open : true , id : id , type : "VIGNETTES_ET_TAXES_SUR_LES_VEHICULES" , title : "la visite technique" } );setOpen(false);}
        }
    
    ); 
      }

    const [open, setOpen] = useState(false);

    return(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    className="text-rod-primary self-start absolute right-4 top-1/2 -translate-y-1/2"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                >
                    <CheckCheck/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        <div className="w-full flex items-center gap-3">
                            <span className="p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                                <CheckCheck className="w-5 h-5"/>
                            </span>
                            <span className="text-lg">Confirmer la visite technique?</span>
                        </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                    <div>
                        <Form {...form}>
                            <form
                                id="confirm-controle-form"
                                onSubmit={form.handleSubmit((data) => {
                                    handleSubmit(data);
                                })}
                                className="space-y-6 py-3"
                            >
                                <FormField
                                    control={form.control}
                                    name="date_assurance"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nouvelle date de visite technique</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={field.value}
                                                    setDate={field.onChange}
                                                    placeholder="Sélectionner une date"
                                                    disabled={date => date < luxonToJSDate(next)}
                                                />
                                            </FormControl>
                                            {form.formState.errors.date_assurance ? (
                                                <FormMessage />
                                            ) : (
                                                <FormDescription>
                                                    En cas de retard, veuillez indiquer la nouvelle date de visite technique.
                                                </FormDescription>
                                            )}
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='w-full'>
                    <AlertDialogCancel onClick={() => setOpen(false)}>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        type="submit"
                        form="confirm-controle-form"
                    >
                        Confirmer
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}