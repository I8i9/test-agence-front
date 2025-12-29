import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import StatesPickerOffre from './statesPickerOffre';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const CreateStep7 = ({ setOffreData, offreData, next, prev, fromGarageMode }) => {


  const AvailabilityFormSchema = z
    .object({
      gouvernorat: z.array(z.string()).min(1, "Au moins un gouvernorat doit être sélectionné.").refine(
      (data) => {
        if (data.min_jour_demande_offre && data.max_jour_demande_offre) {
          return data.min_jour_demande_offre < data.max_jour_demande_offre;
        }
        return true;
      },
      {
        message: "Le minimum de jours doit être inférieur au maximum de jours.",
        path: ["min_jour_demande_offre"],
      }
    ),
    livraison_pol: z.preprocess(
      (val) => (val === "" ? undefined : val), // convert empty string to undefined
      z.enum(["TOUS", "HOTEL_AEROPORT", "AGENCE"], {
        required_error: "La politique de livraison est requise.",
        invalid_type_error: "La politique de livraison doit être une des options prédéfinies.",
      })
    )
    });
  const AvailabilityForm = useForm({
    resolver: zodResolver(AvailabilityFormSchema),
    defaultValues: {
      gouvernorat: offreData?.gouvernorat_offre || [],
        livraison_pol: offreData?.livraison_pol || "",
    },
  });

  useEffect(() => {
    if (AvailabilityForm.watch("gouvernorat").length !== 0) {
      AvailabilityForm.clearErrors("gouvernorat");
    }
  }, [AvailabilityForm.watch("gouvernorat")]);



  const handleSubmit = (data) => {
    console.log("Step 2 Data:", data);
    setOffreData({
      ...offreData,

      gouvernorat_offre: data.gouvernorat,
      livraison_pol: data.livraison_pol,

    });

    next();
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Content Area */}
      <div className='flex-1 no-scrollbar overflow-y-scroll'>
        <Form {...AvailabilityForm}>
          <form
            id="govs-select-add-offre"
            onSubmit={AvailabilityForm.handleSubmit(handleSubmit)}
            className='flex flex-col gap-4'
          >
            <div className='space-y-4'>
              <div>
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                  Zones de disponibilité
                </h3>
              </div>

              <FormField
                control={AvailabilityForm.control}
                name="gouvernorat"
                render={() => (
                  <FormItem className="flex flex-col px-1">
                    <FormLabel>Gouvernorats</FormLabel>
                    <StatesPickerOffre
                      defaultStock={AvailabilityForm.getValues("gouvernorat")}
                      form={AvailabilityForm}
                    />
                    {AvailabilityForm.formState.errors.gouvernorat ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>
                        Ajouter les gouvernorats où votre offre sera disponible.
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <div>
                {AvailabilityForm.watch("gouvernorat").length > 0 && (
                  <div className="space-y-2 mb-2">
                    <div className="flex flex-wrap gap-2">
                      {AvailabilityForm.getValues("gouvernorat").map((gouvernorat) => (
                        <span
                          key={gouvernorat}
                          onClick={() => {
                            const updatedStates = AvailabilityForm
                              .getValues("gouvernorat")
                              .filter((state) => state !== gouvernorat);
                            AvailabilityForm.setValue("gouvernorat", updatedStates);
                          }}
                          className="flex items-center group cursor-pointer font-medium gap-1 px-2 py-0.5 bg-gray-100 rounded-sm text-sm"
                        >
                          {gouvernorat}
                          <X
                            key={gouvernorat + "-icon"}
                            className="w-3 h-3 group-hover:text-red-600"
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="mb-2" />

            <FormField
                control={AvailabilityForm.control}
                className='col-span-2'
                name="livraison_pol"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Politiques de livraison</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Sélectionner une option"/>
                                </SelectTrigger>
                            </FormControl>  
                            <SelectContent>
                                <SelectItem value="TOUS">Livraison possible partout</SelectItem>
                                <SelectItem value="HOTEL_AEROPORT">Livraison possible uniquement à l'aéroport ou à l'hôtel</SelectItem> 
                                <SelectItem value="AGENCE">La voiture doit être récupérée uniquement à l'agence</SelectItem>
                            </SelectContent>
                        </Select>
                        {
                            AvailabilityForm.formState.errors?.livraison_pol ? (
                                <FormMessage>
                                    {AvailabilityForm.getFieldState("livraison_pol").error?.message}
                                </FormMessage>
                            ) : (
                                <FormDescription>
                                    Indiquez la politique de livraison
                                </FormDescription>
                            )
                        }
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

export default CreateStep7;
