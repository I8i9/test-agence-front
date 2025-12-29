import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, CheckCircle2, Eye , Info, ReceiptText } from 'lucide-react';
import { useCloturerContrat } from '../../../api/queries/contrat/useCloturerContrat';
import useFetchOldKilometrage from '../../../api/queries/garage/useFetchOldKilometrage';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Separator } from "@/components/ui/separator";
import ToolTipCustom from '../../customUi/tooltip';




export const CloturerContratModal = ({id_contrat, id_garage, contractNumber, kilometrage ,open, onClose}) => {

  const { data: oldKilometrage , isLoading } = useFetchOldKilometrage(id_garage , {enabled: kilometrage == null || kilometrage === undefined });

  const {mutate : CloturerContrat , isPending } = useCloturerContrat();

  // Use oldKilometrage data in schema validation
  const schema = z.object({
    kilometrage: z.preprocess(
      (val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        return Number(val);
      },
      z.number({
        required_error: "Le kilométrage est requis.",
        invalid_type_error: "Le kilométrage doit être un nombre.",
      })
      .min(0, "Le kilométrage doit être supérieur ou égal à 0")
      .max(9999999, "Le kilométrage ne peut pas dépasser 999 999 km")
      .refine((val) => {
        if (oldKilometrage && val < oldKilometrage) {
          return false;
        }
        return true;
      }, {
        message: `Le kilométrage doit être supérieur à ${oldKilometrage || 0} km`
      })
    ),
    penalite : z.preprocess(
      (val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        return Number(val);
      }
      ,z.number(
        {
          required_error: "La pénalité est requise.",
          invalid_type_error: "La pénalité doit être un nombre.",
        }
      ).optional().refine((val) => val === undefined || val >= 0, {
        message: "La pénalité doit être un nombre positif.",
      })
    ),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      kilometrage: oldKilometrage || kilometrage || 0,
      penalite: "" ,
    },
  });

  // Update form default value when oldKilometrage is loaded
  React.useEffect(() => {
    if (oldKilometrage) {
      form.setValue('kilometrage', oldKilometrage);
    }
  }, [oldKilometrage, form]);

  const handleSubmit=(data)=>{

    CloturerContrat({
      id_contrat: id_contrat,
      new_kilometrage: data.kilometrage,
      prix_penalite: data.penalite || null ,
    }) 
    onClose();
  } 

return (
    <Dialog open={open} onOpenChange={onClose}>  
      <DialogContent className="pb-2 pt-5 px-6 w-[650px]">
        <DialogHeader>
          <DialogTitle>
         <div className="w-full flex items-center gap-2">
          <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
            <ReceiptText size={16} />
          </span>
          <span className="text-base align-middle">Clôturer le contrat {contractNumber || ''} ?</span>
        </div>
          </DialogTitle>
          <DialogDescription className=' pb-1 leading-tight'>
            Merci de mettre à jour le kilométrage du véhicule avant de clôturer ce contrat.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-3">
            <FormField
              control={form.control}
              name="kilometrage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau Kilomètrage</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} className="pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">Km</span>
                    </div>
                  </FormControl>
                  {form.formState.errors.kilometrage ? (
                    <FormMessage />
                  ) : (
                    <FormDescription> 
                      Indiquez le nouveau kilométrage de voiture (doit être supérieur au kilométrage actuel)
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="penalite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <ToolTipCustom
                      trigger={<span className='flex items-start'>Pénalité appliquée (Optionelle)<Info className='ml-1 h-3 w-3'/></span>}
                      message={<span>Ce champ permet d’ajouter une pénalité en cas de retard, de dommages, ou de non-respect des conditions du contrat.
                        <br /> Si aucune pénalité n’est due, vous pouvez laisser ce champ vide.</span>}
                    />
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Ex: 50 DT" type="number" {...field} className="pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">DT</span>
                    </div>
                  </FormControl>
                  {form.formState.errors.penalite ? (
                    <FormMessage />
                  ) : (
                    <FormDescription> 
                      Saisissez le montant de la pénalité à appliquer en cas de non-respect des conditions
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter className="w-full pt-2">
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending || isLoading}>
                {isPending ? <>Mise à jour en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  : <><CheckCircle className=" mb-0.5" /> Mettre à jour et clôturer</>}
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
};