import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { z } from 'zod';
import { CreditCard, Loader2, RefreshCcw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Separator } from "@/components/ui/separator";
import { DateTimePicker } from '../../customUi/dateTimePicker'; 
import { formatDateTime } from '../../../utils/datautils';

const PaymentModal = ({ 
  entityId, 
  entityType = 'contrat',
  entityNumber, 
  open, 
  onClose, 
  paymentStatus,
  onSubmit,
  isPending = false,
  isForDepense = false
}) => { 
  // Calculate remaining amount
  const totalAmount = paymentStatus?.total_amount || 0;
  const totalPaid = paymentStatus?.total_paid || 0;
  const remainingAmount = paymentStatus?.remaining_amount || 0;

  // Dynamic labels based on entity type
  const labels = {
    contrat: {
      title: 'Enregistrer un paiement pour le contrat',
      description: 'Ajoutez un paiement pour ce contrat afin de mettre à jour son solde et son statut.',
      entityLabel: 'contrat'
    },
    depense: {
      title: 'Enregistrer un paiement pour la dépense',
      description: 'Enregistrez une partie du paiement pour cette dépense pour suivre précisément les transactions.',
      entityLabel: 'dépense'
    }
  };

  const currentLabels = labels[entityType] || labels.contrat;

  // Zod validation schema with dynamic max amount
  const paymentSchema = z.object({
    montant: z.string()
      .min(1, "Le montant est requis")
      .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: "Le montant doit être supérieur à 0"
      })
      .refine((val) => parseFloat(val) <= remainingAmount, {
        message: `Le montant ne peut pas dépasser ${remainingAmount.toFixed(2)} DT`
      }),
    methode: z.enum(['ESPECE', 'VIREMENT', 'CHEQUE', 'TRAITE'], {
      required_error: "La méthode de paiement est requise"
    }),
    reference_paiement: z.string().optional(),
    date_paiement: z.date({
      required_error: "La date de paiement est requise"
    })
  });

  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      montant: '',
      methode: '',
      reference_paiement: '',
      date_paiement: new Date()
    }
  });

  // Handle form submission
  const handleSubmit = (data) => {
    const payload = {
      // Dynamic field name based on entity type
      [`id_${entityType}_paiement`]: entityId,
      montant: parseFloat(data.montant),
      methode: data.methode,
      reference: data.reference_paiement || null,
      date_paiement: formatDateTime(data.date_paiement)
    };

    onSubmit(payload, {
      onSuccess: () => {
        form.reset();
        onClose();
      }
    });
  };

  const isReferenceDisabled = form.watch("methode") === "ESPECE"

  return (
    <Dialog open={open} onOpenChange={onClose}> 
      <DialogContent className="pb-2 pt-5 px-6 w-[750px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"> 
            <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
              <CreditCard size={16} />
            </span> 
            {currentLabels.title} {entityNumber || ''} 
          </DialogTitle>
          <DialogDescription className='pb-1 leading-tight'>
            {currentLabels?.description}
          </DialogDescription>
          <Separator />
        </DialogHeader>

        {/* Payment Status */}
        <div className={'p-3 bg-rod-foreground rounded-md ' + (isForDepense ? 'grid grid-cols-4' : 'grid grid-cols-3')}>
          <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              Total:
            </span>
            <span className="text-lg font-bold">{parseFloat(totalAmount.toFixed(2))} DT</span>
          </div>

          <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              Payé:
            </span>
            <span className="text-lg font-bold">{parseFloat(totalPaid.toFixed(2))} DT</span>
          </div>

          <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              Reste à payer:
            </span>
            <span className="text-lg font-bold">{parseFloat(remainingAmount.toFixed(2))} DT</span>
          </div>

          {
              isForDepense ? 
           <div className='text-xs flex flex-col '>
            <span className='text-gray-800'>
              Rétenus à la source:
            </span>
            <span className="text-lg font-bold">{parseFloat(paymentStatus?.rts?.toFixed(2)) || 0} DT</span>
          </div>
          : null
        }
          

        </div>
      
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-3">
            {/* Montant Field */}
            <FormField
              control={form.control}
              name="montant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        max={remainingAmount}
                        {...field} 
                        className="pr-12" 
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        DT
                      </span>
                    </div>
                  </FormControl>
                  {form.formState.errors.montant ? (
                    <FormMessage />
                  ) : (
                    <FormDescription> 
                      Montant maximum: {remainingAmount.toFixed(2)} DT
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            
            <div className='grid grid-cols-2 gap-4'>
            {/* Méthode de paiement Field */}
            <FormField
              control={form.control}
              name="methode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Méthode de paiement</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionnez une méthode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ESPECE">Espèce</SelectItem>
                      <SelectItem value="VIREMENT">Virement</SelectItem>
                      <SelectItem value="TRAITE">Traite</SelectItem>
                      <SelectItem value="CHEQUE">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.methode ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Paiement utilisée pour ce {currentLabels.entityLabel}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            {/* Référence de paiement Field */}
            <FormField
              control={form.control}
              name="reference_paiement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Référence de Paiement (Optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: 84591234" 
                      disabled={isReferenceDisabled}
                      {...field}
                    />
                  </FormControl>
                  {form.formState.errors.reference_paiement ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Numéro de chèque ou référence de transaction
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          </div>


            {/* Date de paiement Field */}
            <FormField
              control={form.control}
              name="date_paiement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de paiement</FormLabel>
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
                      Sélectionnez la date de paiement du {currentLabels.entityLabel}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter className="w-full pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    Enregistrement...
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  "Enregistrer le paiement"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 

export default PaymentModal;