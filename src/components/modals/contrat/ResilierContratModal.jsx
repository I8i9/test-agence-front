import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '../../customUi/animatedCheckbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';
import { ReceiptText } from 'lucide-react';
import useFetchOldKilometrage from '../../../api/queries/garage/useFetchOldKilometrage';
import { useResillierContrat } from '../../../api/queries/contrat/useResillierContrat'; 
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Separator } from "@/components/ui/separator";
import ToolTipCustom from '../../customUi/tooltip';
import { useCancelContrat } from '../../../api/queries/contrat/useCancelContrat';
import { DateTimePicker } from '../../customUi/dateTimePicker';
import { formatDateTime } from '../../../utils/datautils';

export const ResilierContratModal = ({id_contrat, id_garage , contractNumber , kilometrage , open, onClose}) => {

  const { data: oldKilometrage , isLoading } = useFetchOldKilometrage(id_garage , { enabled: kilometrage == null || kilometrage === undefined });
  const {mutate : resilliercontrat, isPending : isResilling } = useResillierContrat();
  const {mutate : cancelContrat, isPending : isCancelling } = useCancelContrat();

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
      .min(0, "Le kilométrage doit être positif.")
      .refine((val) => {
        if (oldKilometrage && val < oldKilometrage) {
          return false;
        }
        return true;
      }, {
        message: `Le kilométrage doit être supérieur à ${oldKilometrage || 0} km`
      })
    ),
    date_fin_contrat: z.date().optional(),
    countDays: z.boolean().default(true),
    penalite : z.string().optional().refine((val) => {
      if (val === undefined || val === '') return true;
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 9999999;
    } , { message: "La pénalité doit être un nombre positif" })
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      kilometrage: oldKilometrage  || '',
      date_fin_contrat: new Date(),
      countDays: true,
      penalite: '',
    },
  });

  // Update form default value when oldKilometrage is loaded
  React.useEffect(() => {
    if (oldKilometrage) {
      form.setValue('kilometrage', oldKilometrage);
    }
  }, [oldKilometrage, form]);

  const handleSubmit = (data) => {
    data.countDays ?
      resilliercontrat({
        id_contrat: id_contrat,
        kilometrage: data?.kilometrage,
        penalite: data?.penalite ? Number(data.penalite) : 0,
        date_fin : formatDateTime(data.date_fin_contrat)
      })
    :
      cancelContrat({
        id_contrat: id_contrat,
        kilometrage: data?.kilometrage,
        penalite: data?.penalite ? Number(data.penalite) : 0,
        date_fin : formatDateTime(data.date_fin_contrat)
      })

    onClose();
  } 


  const isResilier = form.watch("countDays");

  return (
    <Dialog open={open} onOpenChange={onClose}> 

      <DialogContent className="pb-2 pt-5 px-6 w-[650px]">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-rod-accent/10 text-rod-accent rounded-full flex items-center justify-center">
                <ReceiptText size={16} />
              </span>
              <span className="text-base align-middle text-rod-accent">{isResilier ? 'Résilier' : 'Annuler'} le contrat {contractNumber || ''} ?</span>
            </div>
          </DialogTitle>
          <DialogDescription className='pb-1 leading-tight'>
            Veuillez définir la date de fin effective et choisir la modalité de facturation pour cet arrêt de contrat.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-3">

            <FormField
              control={form.control}
              name="date_fin_contrat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Fin Effective</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      className="!text-sm"
                      date={field.value}
                      setDate={(date) => field.onChange(date)}
                      title="Choisir la date de paiement" 
                    /> 
                  </FormControl>
                  {form.formState.errors.date_paiement ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Sélectionnez la date {isResilier ? 'de résiliation' : 'd\'annulation'} du contrat, elle sera la date de fin effective.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />


              <FormField
              control={form.control}
              name="kilometrage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau Kilométrage</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} className="pr-12" placeholder="Ex: 15000" />
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
                        trigger={<span className='flex items-start'>Pénalité appliquée (Optionelle)</span>}
                        message={<span>Ce champ permet d’ajouter une pénalité si vous le souhaitez.
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
                        Saisissez le montant de la pénalité à appliquer pour la résiliation du contrat
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="countDays"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center ">
                    <FormControl>
                      <Checkbox id="countDays" checked={field.value} onCheckedChange={field.onChange}  />
                    </FormControl>
                    <FormLabel htmlFor="countDays">
                      <span className='flex items-start cursor-pointer mt-0.5'>Facturer les frais de location pour les jours déjà écoulés de contrat.</span>
                    </FormLabel>
                  
                  </FormItem>
                )}
              />
            

            <DialogFooter className="w-full pt-2">
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Annuler
              </Button>
              <Button type="submit" variant="destructive" disabled={isCancelling || isLoading || isResilling }>
                {isResilling || isCancelling ? (
                  <>
                  { isResilier ? "Résiliation en cours..." : "Annulation en cours..." }
                    <Loader2 className="text-mute-foreground animate-spin"/>
                  </>
                ) :  
                <>
                  {isResilier ? "Résilier le contrat" : "Annuler le contrat"}
                </>
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
};