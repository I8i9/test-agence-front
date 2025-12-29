import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RefreshCcw, Loader2, Maximize2, CalendarPlus2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Separator } from "@/components/ui/separator";
import { DateTimePicker2 } from '../../customUi/dateTimePicker';
import { format } from 'date-fns';
import { useFetchNextReservation } from '../../../api/queries/reservations/useGetNextReservation';
import { useExtendContrat } from '../../../api/queries/contrat/useExtendContrat';
import { AlertOrange, AlertRed } from '../../customUi/Alert';

const schema = z.object({
  nouvelleDateFin: z.date({
    required_error: "Choisissez une nouvelle date de fin.",
    invalid_type_error: "Date invalide.",
  }).refine(date => date > new Date(), {
    message: "La date doit être dans le futur."
  })
});

const getDisableRule = (caseType, minDate, maxDate) => {
  const min = minDate ? new Date(minDate) : undefined;
  const max = maxDate ? new Date(maxDate) : undefined;

  return (date) => {
    if (!(date instanceof Date)) return true;
    if (caseType === "RESERVATION_TOO_CLOSE") return true;
    if (caseType === "PROLONGATION_LIMIT") {
      if (min && date <= min) return true;
      if (max && date >= max) return true;
    }
    if (caseType === "NO_NEXT_RESERVATION") {
      if (min && date < min) return true;
    }
    return false;
  };
}

const formatDateSafe = (date) => {
  if (!date) return "Non défini";
  const d = new Date(date);
  return isNaN(d) ? "Non défini" : format(d, "dd-MM-yyyy HH:mm");
};

export const RenouvellerContratModal = ({ id_contrat, contractNumber, currentEndDate, open, onClose }) => {
  const { data, isLoading } = useFetchNextReservation(id_contrat);
const { mutate: renouvellercontrat, isPending } = useExtendContrat()
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nouvelleDateFin: currentEndDate ? new Date(currentEndDate) : undefined,
    },
  });

  const handleSubmit = (values) => {
    renouvellercontrat({
      id_contrat,
      new_date_fin: values.nouvelleDateFin,
      id_reservation: data?.id_reservation ?? null,
    },
    {
    onSuccess: () => {
      onClose();
    },
    }
  
  )
  };

  const caseType = data?.case;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[650px]  min-h-[280px]  px-6 flex flex-col">
        {/* Header */}
        <DialogHeader className="h-fit">
          <DialogTitle className="flex items-center gap-2">
            <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
              <CalendarPlus2 size={16} />
            </span>
            Prolonger la location {contractNumber || ''}
          </DialogTitle>
          <DialogDescription className="pb-1 leading-tight">
            {caseType === "NO_NEXT_RESERVATION" && "Vous pouvez prolonger sans limite."}
            {caseType === "RESERVATION_TOO_CLOSE" && "Impossible de prolonger car une réservation est trop proche."}
            {caseType === "PROLONGATION_LIMIT" && "Prolongation possible mais limitée."}
          </DialogDescription>
          <Separator />
        </DialogHeader>
        {
          isLoading ?
            <div className='flex justify-center items-center flex-1 w-full -mt-1 '>
              <Loader2 className="animate-spin " />
            </div>
            : 
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-3">
              <FormField
                control={form.control}
                name="nouvelleDateFin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de retour</FormLabel>
                    <FormControl>
                      <DateTimePicker2
                        disabledbutton={caseType === "RESERVATION_TOO_CLOSE"}
                        disabled={getDisableRule(caseType, data?.min_date, data?.max_date)}
                        date={field.value}
                        defaultMonth={data?.min_date ? new Date(data.min_date) : new Date()}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    {form.formState.errors.nouvelleDateFin ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Choisissez la nouvelle date de retour du véhicule.</FormDescription>
                    )}
                  </FormItem>
                )}
              />

          {!isLoading && caseType === "RESERVATION_TOO_CLOSE" && (
              <AlertRed
                title="Prolongation impossible"
                description="Une autre réservation est trop proche."
              />
            )}

          {!isLoading && caseType === "PROLONGATION_LIMIT" && (
                  <AlertOrange
                    title="Prolongation limitée"
                    description={
                      <span className='inline-flex gap-1'>
                        Votre contrat peut être prolongé jusqu’au <span className='font-semibold'>{formatDateSafe(data?.max_date)}</span>
                      </span>
                    }
                  />
                )}
              <DialogFooter className="w-full pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                <Button type="submit" disabled={caseType === "RESERVATION_TOO_CLOSE" || isLoading || isPending}>
                  {isPending ? <>Prolongation... <Loader2 className="animate-spin ml-2" /></> : <><CalendarPlus2 className='mb-0.5' /> Prolonger</>}
                </Button>
              </DialogFooter>

            </form>
          </Form>
        }
      </DialogContent>
    </Dialog>
  );
};
