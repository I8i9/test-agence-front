import {
  Form,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, TagIcon } from 'lucide-react';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {  useEffect, useState } from 'react';
import { addDays, differenceInCalendarDays } from 'date-fns';
import { DatePicker } from '../../../ui/date-picker';

const CreateStep2 = ({ setOffreData, offreData, next, prev, fromGarageMode }) => {
  const [hasMinJourDemande, setHasMinJourDemande] = useState(
    offreData.has_min_jour_demande !== undefined ? offreData.has_min_jour_demande : false
  );
  const [hasMaxJourDemande, setHasMaxJourDemande] = useState(
    offreData.has_max_jour_demande !== undefined ? offreData.has_max_jour_demande : false
  );
 

  const AvailabilityFormSchema = z
    .object({
      date_debut: z.date({
        invalid_type_error: "La date de début doit être une date valide.",
      }),
      date_fin: z.date({
        required_error: "La date de fin est requise.",
        invalid_type_error: "La date de fin doit être une date valide.",
      }),
      min_jour_demande_offre: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (hasMinJourDemande) {
              if (!val || val.trim() === '') return false;
            }
            return true;
          },
          "Le minimum de jours doit être au moins 1."
        ),
      max_jour_demande_offre: z
        .string()
        .optional()
        .refine(
          (val) => {
            if (hasMaxJourDemande) {
              if (!val || val.trim() === '' || parseInt(val) < 2) return false;
            }
            return true;
          },
          "Le maximum de jours doit être au moins 2."
        ),
      offreLongTerm: z.boolean().default(false),
    })
    .refine(
      (data) => {
        console.log("Refine check:", data);
        if (data.min_jour_demande_offre && data.max_jour_demande_offre ) {
          return Number(data.min_jour_demande_offre) < Number(data.max_jour_demande_offre);
        }

        return true;
      },
      {
        message: "Le minimum de jours doit être inférieur au maximum de jours.",
        path: ["min_jour_demande_offre"],
      }
    ).refine(
      (data) => {
                console.log("Refine check for max days:", Number(data.min_jour_demande_offre) , differenceInCalendarDays(data.date_fin, data.date_debut));

        if(data.min_jour_demande_offre) {
          return Number(data.min_jour_demande_offre) < differenceInCalendarDays(data.date_fin, data.date_debut);
        }
        return true;
      },
      {
        message: "Le minimum de jours est supérieur à la durée totale de l'offre.",
        path: ["min_jour_demande_offre"],
      }
    ).refine(
      (data) => {
        if(data.max_jour_demande_offre ) {
          return Number(data.max_jour_demande_offre) <= differenceInCalendarDays(data.date_fin, data.date_debut);
        }
        return true;
      },
      {
        message: "Le maximum de jours est supérieur à la durée totale de l'offre.",
        path: ["max_jour_demande_offre"],
      }
    ) ;
    

  const AvailabilityForm = useForm({
    resolver: zodResolver(AvailabilityFormSchema),
    defaultValues: {
      date_debut: offreData?.date_debut_offre || new Date(),
      date_fin: offreData?.date_fin_offre || undefined,
      min_jour_demande_offre: offreData?.min_jour_demande_offre || 1,
      max_jour_demande_offre: offreData?.max_jour_demande_offre || 1,
      offreLongTerm: offreData?.offreLongTerm || false,

    },
  });

  useEffect(() => {
    const minJour = AvailabilityForm.watch("min_jour_demande_offre");
    const maxJour = AvailabilityForm.watch("max_jour_demande_offre");
    if (hasMinJourDemande && minJour < 14) {
      AvailabilityForm.setValue("offreLongTerm", false);
    }
    if (hasMaxJourDemande && maxJour < 15) {
      AvailabilityForm.setValue("offreLongTerm", false);
    }
    
  }, [AvailabilityForm.watch("min_jour_demande_offre"), AvailabilityForm.watch("max_jour_demande_offre")]);


  useEffect(() => {
    if (!hasMinJourDemande) {
      AvailabilityForm.setValue('min_jour_demande_offre', '');
      AvailabilityForm.clearErrors('min_jour_demande_offre');
    }
    if (!hasMaxJourDemande) {
      AvailabilityForm.setValue('max_jour_demande_offre', '');
      AvailabilityForm.clearErrors('max_jour_demande_offre');
    }
  }, [hasMinJourDemande, hasMaxJourDemande]);

  const handleSubmit = (data) => {
    console.log("Step 2 Data:", data);
    setOffreData({
      ...offreData,
      date_fin_offre: data.date_fin,
      date_debut_offre: new Date(),
      min_jour_demande_offre: hasMinJourDemande
        ? data.min_jour_demande_offre 
        : null,
      max_jour_demande_offre: hasMaxJourDemande
        ? data.max_jour_demande_offre 
        : null,
      has_min_jour_demande: hasMinJourDemande,
      has_max_jour_demande: hasMaxJourDemande,
      offreLongTerm : AvailabilityForm.getValues("offreLongTerm"),


    });

    next();
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Content Area */}
      <div className='flex-1 no-scrollbar overflow-y-scroll px-0.75'>
        <Form {...AvailabilityForm}>
          <form
            id="govs-select-add-offre"
            onSubmit={AvailabilityForm.handleSubmit(handleSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='space-y-4 '>
              <h3 className="flex items-center gap-2 font-semibold text-lg">
                Période de disponibilité
              </h3>

              <div className='flex flex-col gap-4'>
                    
                {/* Date fin */}
                <FormField
                  control={AvailabilityForm.control}
                  name="date_fin"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fin de l'offre</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        disabled={(date) => {
                          const startDate = AvailabilityForm.getValues("date_debut");
                          return date < new Date() || (startDate && date < addDays(startDate, 1));
                        }}
                      />
                      {AvailabilityForm.formState.errors.date_fin ? (
                        <FormMessage>
                          {AvailabilityForm.getFieldState("date_fin").error?.message}
                        </FormMessage>
                      ) : (
                        <FormDescription>Sélectionnez la date de fin</FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                {/* Long term switch */}


    <div className='grid grid-cols-2 gap-x-8'>
                  {/* Min jours */}
        <div>
  <div className="flex items-center justify-between mb-2">
    <label className="text-sm font-medium">Durée minimale de location</label>
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">
        {hasMinJourDemande ? "Minimum appliqué" : "Sans minimum"}
      </span>
      <Switch
        checked={hasMinJourDemande}
        onCheckedChange={setHasMinJourDemande}
      />
    </div>
  </div>

  <FormField
    control={AvailabilityForm.control}
    name="min_jour_demande_offre"
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormControl>
          <div className="relative">
            <Input
              type="number"
              placeholder="Ex: 2 jours"
              {...field}
              value={field.value}
              className="pr-13"
              disabled={!hasMinJourDemande}
            />
            <span
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                !hasMinJourDemande ? 'opacity-50' : ''
              } text-gray-500 text-sm pointer-events-none`}
            >
              Jours
            </span>
          </div>
        </FormControl>
        {AvailabilityForm.formState.errors.min_jour_demande_offre ? (
          <FormMessage>
            {AvailabilityForm.getFieldState("min_jour_demande_offre").error?.message}
          </FormMessage>
        ) : (
          <FormDescription>
            Durée minimale de location pour cette offre
          </FormDescription>
        )}
      </FormItem>
    )}
  />
        </div>

    {/* Max jours */}
            <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Durée maximale de location</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {hasMaxJourDemande ? "Maximum appliqué" : "Sans maximum"}
                        </span>
                        <Switch
                          checked={hasMaxJourDemande}
                          onCheckedChange={setHasMaxJourDemande}
                        />
                      </div>
                    </div>

                    <FormField
                      control={AvailabilityForm.control}
                      name="max_jour_demande_offre"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="Ex: 30 jours"
                                {...field}
                                value={field.value}
                                className="pr-13"
                                disabled={!hasMaxJourDemande}
                              />
                              <span
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                                  !hasMaxJourDemande ? 'opacity-50' : ''
                                } text-gray-500 text-sm pointer-events-none`}
                              >
                                Jours
                              </span>
                            </div>
                          </FormControl>
                          {AvailabilityForm.formState.errors.max_jour_demande_offre ? (
                            <FormMessage>
                              {
                                AvailabilityForm.getFieldState("max_jour_demande_offre")
                                  .error?.message
                              }
                            </FormMessage>
                          ) : (
                            <FormDescription>
                               Durée maximale de location pour cette offre
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
            </div>
                </div>

              </div>
            </div>

            {/* offre lld */}
            <FormField
              
              control={AvailabilityForm.control}
              name="offreLongTerm"
              render={({ field }) => (
                <FormItem className="flex flex-col px-1 mt-4">
                   <div className='border-input  relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none'>
                    <Switch
                      disabled={ (hasMaxJourDemande &&  AvailabilityForm.watch("max_jour_demande_offre") < 15) || (hasMinJourDemande &&  AvailabilityForm.watch("min_jour_demande_offre") < 14) }
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id={"lld"}
                      className='order-1  after:absolute after:inset-0'
                    />
                    <div className='flex grow gap-3'>
                      <TagIcon
                        className='size-5'
                      />
                      <div className='grid grow gap-2'>
                        <Label htmlFor={"lld"} className={`text-base`}>Offre Longue Durée</Label>
                        <p className='text-muted-foreground text-base'>
                          Cochez cette option si : 
                          <br />
                          - Cette offre est pensée pour les clients souhaitant une <span className='font-medium'>location longue durée</span>  
                          <br />
                          - Assurez-vous que le <span className='font-medium'>tarif correspond</span> à un usage longue durée  
                          <br />
                          - La plateforme indiquera automatiquement cette offre comme <span className='font-medium'>LLD</span> pour les utilisateurs
                        </p>
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />
          
          </form>
        </Form>
      </div>

      {/* Footer */}
      <div
        className={`flex ${fromGarageMode ? 'justify-end' : 'justify-between'} pt-4 border-t`}
      >
        {!fromGarageMode && (
          <Button variant="outline" onClick={prev} className="rounded-sm">
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Button>
        )}

        <Button form="govs-select-add-offre" onClick={() => {}} className="rounded-sm">
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreateStep2;
