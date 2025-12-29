
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Ban } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Separator } from "@/components/ui/separator";
import { raisonsAnnulationOptionsAgency , reasons } from '@/utils/demandReasons';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useUpdateDemande } from '../../../api/queries/demande/useUpdateDemandes';



export const RefuseDemand = ({id_demande ,disabled, loading}) => {

  const schema = z.object({
   raison: z
       .string({
         required_error: "Veuillez sélectionner un raison de refus valide.",
         invalid_type_error : "Veuillez sélectionner un raison de refus valide."
       })
       .refine(val => reasons.includes(val), {
         message: "Veuillez sélectionner un raison de refus valide.",
       }),
});

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      raison: "",
    },
  });

  const {mutate , isPending , isSuccess} = useUpdateDemande();

  const handleSubmit=(data)=>{

    mutate({ id_demande, status_demande: "REFUSE", raison: data.raison });
    setOpen(false);
  }



  const [open, setOpen] = useState(false);

return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
       <Button className="w-1/2" variant="outline" disabled={disabled} onClick={close}>
       {
        ((loading && isSuccess) || isPending) ? <> <Loader2 className="animate-spin mr-2" /> En cours...</> : <> <Ban className='mb-0.75' />
            Refuser </>
       }
           
        </Button>
      </DialogTrigger>

      <DialogContent className="pb-2 pt-5 px-8 w-[650px]">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                <Ban  className="w-5 h-5" />
              </span>
              <span className="text-xl leading-tight">Refuser la demande de location?</span>
            </div>
          </DialogTitle>
          <DialogDescription className=' pb-1 leading-tight'>
            Indiquez la raison pour laquelle cette demande a été refusée.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-3">
           <FormField
              control={form.control}
              name="raison"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raison de refus</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Ex : Documents invalides, Véhicule non disponible" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                      {
                        raisonsAnnulationOptionsAgency.map((dep,i)=>{
                          return (
                        <SelectItem value={dep.value} key={i}>{
                            <span className="leading-tight">{dep.label}</span>
                        }</SelectItem>
                          )
                        })
                      } 
                    </SelectContent>
                  </Select>
                </FormControl>
                {form.formState.errors.raison ? (
                  <FormMessage />
                  ) : (
                    <FormDescription>Sélectionnez la raison du refus de cette demande</FormDescription>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter className="w-full">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <>En cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Confirmer"}

              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
};