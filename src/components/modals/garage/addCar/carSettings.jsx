import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage ,
  FormDescription
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


// Zod schema for form validation
const formSchema = z.object({
  type_achat: z
    .enum(["COMPTANT", "LEASING", "CREDIT_BANCAIRE" ], { required_error:"Le type d'achat est requis." }),
  valeur_achat: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({
      invalid_type_error: "La valeur d'achat doit être un nombre.",
      required_error: "La valeur d'achat est requise.",
    }).min(1, "La valeur d'achat doit être positive.")
  ), 

  prix_achat: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number({
      invalid_type_error: "La valeur d'achat doit être un nombre.",
      required_error: "La valeur d'achat est requise.",
    }).min(1, "La valeur d'achat doit être positive.")
  ),

   annees_ammortissement: z
    .coerce
    .number({
      invalid_type_error: "Durée d'usage doit être un nombre.",
      required_error: "La durée d'usage est requise.",
    })
    .min(1, "La durée d'usage doit être d'au moins 1 an.")
    .max(5, "La durée d'usage doit être inférieure à 5 ans."),
    valeur_amortissement: z
    .coerce
    .number({
      invalid_type_error: "La valeur d'amortissement doit être un nombre.",
      required_error: "La valeur d'amortissement est requise.",
    })
    .min(1, "La valeur d'amortissement doit être positive."),
  });

const CarSettings = ({ next , prev , setCar , Car}) => {


  // Initialize form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type_achat: Car.type_achat || "COMPTANT",
      valeur_achat: Car.valeur_achat || "",
      valeur_amortissement: Car.valeur_amortissement || "",
      annees_ammortissement: Car.annees_ammortissement || "",
      prix_achat: Car.prix_achat || "", 
    }
  });


  const onSubmit = (data) => {
    console.log('onSubmit called!', data);
    setCar((prev) => ({
        ...prev,
        ...data
    }));
    next();
  };


  return (
    <div className="h-full flex flex-col bg-white">
      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto ">
        <div  className='flex flex-col justify-between h-full'>
          <Form {...form}>
            <form id="add-car-garage-data-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              {/* Basic Information Section */}

              <div className="grid grid-cols-2 gap-x-8">

                <FormField
                  control={form.control}
                  name="valeur_amortissement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amortissement annuel</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <Input
                              type="number"
                              placeholder="Ex: 12000"
                              {...field}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">DT</span>
                          </div>
                        
                      </FormControl>
                      {
                        form.formState.errors?.valeur_amortissement ? (
                          <FormMessage>
                            {form.getFieldState("valeur_amortissement").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription >
                            Montant de l’amortissement du véhicule calculé pour une année.
                          </FormDescription>
                        )
                      }

                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="annees_ammortissement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée d’usage (en années)</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <Input
                              type="number"
                              placeholder="Ex: 5"
                              {...field}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">ans</span>
                          </div>
                        
                      </FormControl>
                      {
                        form.formState.errors?.annees_ammortissement ? (
                          <FormMessage>
                            {form.getFieldState("annees_ammortissement").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription >
                            Saisissez le nombre d’années d’utilisation prévues.
                          </FormDescription>
                        )
                      }

                    </FormItem>
                  )}
                />
        
              </div>


              <div className="grid grid-cols-2 gap-x-8">

                <FormField
                  control={form.control}
                  name="valeur_achat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valeur Comptable</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <Input
                              type="number"
                              placeholder="Ex: 70000"
                              {...field}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">DT</span>
                          </div>
                        
                      </FormControl>
                      {
                        form.formState.errors?.valeur_achat ? (
                          <FormMessage>
                            {form.getFieldState("valeur_achat").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription >
                            Valeur du véhicule pour le calcul des amortissements.
                          </FormDescription>
                        )
                      }

                    </FormItem>
                  )}
                />
                

                <FormField
                  control={form.control}
                  name="prix_achat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix du véhicule</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <Input
                              type="number"
                              placeholder="Ex: 70000"
                              {...field}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">DT</span>
                          </div>
                        
                      </FormControl>
                      {
                        form.formState.errors?.prix_achat ? (
                          <FormMessage>
                            {form.getFieldState("prix_achat").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription >
                              Prix d’achat du véhicule d'après le concessionnaire {"("}sans intérêts{")"}.
                              </FormDescription>
                        )
                      }

                    </FormItem>
                  )}
                />

               

              </div>   

              <FormField
                  control={form.control}
                  name="type_achat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status de véhicule</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger  className="w-full cursor-pointer">
                                <SelectValue placeholder="Choisissez le statut de véhicule" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="COMPTANT">Payé en comptant</SelectItem>
                                <SelectItem value="LEASING">Payé / En cours en leasing</SelectItem>
                                <SelectItem value="CREDIT_BANCAIRE">Payé par crédit bancaire</SelectItem>
                            </SelectContent>
                        </Select>
                      </FormControl>
                      {
                        form.formState.errors?.type_achat ? (
                          <FormMessage>
                            {form.getFieldState("type_achat").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription>
                            Sélectionnez l’état de paiement du véhicule.
                          </FormDescription>
                        )
                      }
                    </FormItem>
                  )}
                />         
             
            </form>
          </Form>
         <div className='flex justify-between '>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prev}
                    >
                      <ChevronLeft />
                      Précédent
                    </Button>

                <Button
                  variant="default"
                  type="submit"
                  form="add-car-garage-data-form"
                  onClick={() => {
                    // Log validation errors
                    console.log('Form errors:', form.formState.errors);
                    console.log('Form values:', form.getValues());
                  }}
                >
                   Suivant
                    <ChevronRight />
                   
                </Button>
          </div>
              
        </div>
      </div>
    </div>
  );
};

export default CarSettings;