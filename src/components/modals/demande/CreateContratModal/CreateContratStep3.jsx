import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DatePicker } from '../../../ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useDebounce } from '../../../../utils/useDebounce';


const formSchema = z.object({
    nom_prenom: z.string().min(1, "Le nom et prénom sont requis"),
    date_naissance: z.date({
            required_error: "La date de naissance est requise",
        }).refine(
            (date) => {
            const today = new Date();
            const minDate = new Date(
                today.getFullYear() - 18,
                today.getMonth(),
                today.getDate()
            );
            return date <= minDate;
            },
            {
            message: "Le conducteur doit avoir au moins 18 ans",
            }
        ), 
    cin_passport: z
        .string({
            required_error: "Le numéro de CIN ou de passeport est requis",
        }).min(1, "Le numéro de CIN ou de passeport est requis")
        ,
   nationalite: z.string({required_error: "La nationalité est requise lorsque le passeport est utilisé",invalid_type_error: "La nationalité doit être une chaîne de caractères"}).regex(/^[A-Za-z\s]+$/, "La nationalité doit contenir uniquement des lettres.").optional(),
    date_delivrance_cin: z.date({ required_error: "La date de délivrance du CIN est requise" }).optional(),
    permis_conduire: z.string().min(1, "Le numéro de permis de conduire est requis"),
    date_delivrance_permis: z.date({ required_error: "La date de délivrance du permis est requise", }),
    adresse: z.string().min(1, "L'adresse est requise"),
    telephone: z
    .string()
    .regex(
        /^[+-]?\d(?:\s?\d)*$/,
        "Le numéro de téléphone doit contenir uniquement des chiffres."
    ),

    })
    .superRefine((data, ctx) => {
    // Règle 1 : Si cin_passport ne respecte pas le format CIN (8 chiffres), c’est un passeport ⇒ nationalité requise
    const isCin = /^\d{8}$/.test(data.cin_passport);

    console.log("isCin dans superRefine:", isCin);


    if (!isCin) {
        if (!data.nationalite || data.nationalite.trim() === "") {
        ctx.addIssue({
            path: ["nationalite"],
            code: z.ZodIssueCode.custom,
            message: "La nationalité est requise lorsque le passeport est utilisé",
        });
        }
    

    // Règle 2 : nationalité ne doit pas contenir de chiffres
    if (data.nationalite && /\d/.test(data.nationalite)) {
        ctx.addIssue({
        path: ["nationalite"],
        code: z.ZodIssueCode.custom,
        message: "La nationalité ne doit pas contenir de chiffres",
        });
    }
    }else {
        // Règle 3 : Si cin_passport respecte le format CIN (8 chiffres) ⇒ date_delivrance_cin requise
        if (!data.date_delivrance_cin) {
        ctx.addIssue({
            path: ["date_delivrance_cin"],
            code: z.ZodIssueCode.custom,
            message: "La date de délivrance du CIN est requise lorsque le CIN est utilisé",
        });
        }
    }
    
    });

const CreateContratStep3 = ({ setContratData, contratData, next, prev, isOptional = true ,conducteur}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
    defaultValues: {
      nom_prenom: contratData?.conducteur_supp_nom_prenom || conducteur?.nom_prenom || '',
      date_naissance: contratData?.conducteur_supp_date_naissance ||( conducteur?.date_naissance ? new Date(conducteur?.date_naissance) : undefined) || undefined,
      cin_passport: contratData?.conducteur_supp_cin_passport || conducteur?.cin_passport || '',
      nationalite: contratData?.conducteur_supp_nationalite ||  conducteur?.nationalite || '' ,
      date_delivrance_cin: contratData?.conducteur_supp_date_delivrance_cin ||  (conducteur?.date_delivrance ? new Date(conducteur?.date_delivrance) : undefined) || undefined,
      permis_conduire: contratData?.conducteur_supp_permis_conduire || conducteur?.permis || '',
      date_delivrance_permis: contratData?.conducteur_supp_date_delivrance_permis || (conducteur?.date_delivrance_permis ? new Date(conducteur?.date_delivrance_permis) : undefined) || undefined,
      adresse: contratData?.conducteur_supp_adresse || conducteur?.adresse || '',
      telephone: contratData?.conducteur_supp_telephone || conducteur?.telephone || '',
    },
  });

  // handel switching between date and nationality 
  const watchedCinOrPassport = form.watch("cin_passport");
  const debouncedCinOrPassport = useDebounce(watchedCinOrPassport, 300);

  const isCIN = /^\d{8}$/.test(debouncedCinOrPassport);
      


  const onSubmit = (data) => {
    // When submitting via "Suivant", we always save the supplementary conductor data
    setContratData(prev => ({ 
      ...prev,
      has_conducteur_supplementaire: true,
      conducteur_supp_nom_prenom: data.nom_prenom,
      conducteur_supp_date_naissance: data.date_naissance,
      conducteur_supp_cin_passport: data?.cin_passport ,
      conducteur_supp_nationalite: !data?.date_delivrance_cin ? data?.nationalite || undefined : undefined,
      conducteur_supp_date_delivrance_cin: !data?.nationalite ? data?.date_delivrance_cin || undefined : undefined,
      conducteur_supp_permis_conduire: data.permis_conduire,
      conducteur_supp_date_delivrance_permis: data.date_delivrance_permis,
      conducteur_supp_adresse: data.adresse,
      conducteur_supp_telephone: data.telephone,
    }));
    next();
  };

  const handleSkipStep = () => {
    // Clear any supplementary conductor data and mark as not having one
    setContratData(prev => ({ 
      ...prev,
      has_conducteur_supplementaire: false,
      conducteur_supp_nom_prenom: '',
      conducteur_supp_date_naissance: undefined, 
      conducteur_supp_nationality: '',
      conducteur_supp_cin_passport: '',
      conducteur_supp_date_delivrance_cin: undefined, 
      conducteur_supp_permis_conduire: '',
      conducteur_supp_date_delivrance_permis: undefined, 
      conducteur_supp_adresse: '',
      conducteur_supp_telephone: '',
    }));
    next();
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-1">
        <div>
          <h3 className="flex items-center gap-1 font-semibold text-lg">
            Conducteur Supplémentaire
          </h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="grid grid-cols-2 gap-6">
              {/* Nom & Prénom */}
              <FormField
                control={form.control}
                name="nom_prenom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Nom & Prénom
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: John Doe"
                        {...field}
                      />
                    </FormControl>
                    {
                      form.formState.errors?.nom_prenom ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          Nom complet du conducteur supplémentaire
                        </FormDescription>
                      )
                    }
                  </FormItem>
                )}
              />

              {/* Date de naissance */}
              <FormField
                control={form.control}
                name="date_naissance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Date de naissance
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                        title="Choisir la date de naissance"
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                      />
                    </FormControl>
                    {
                      form.formState.errors?.date_naissance ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          Sélectionnez la date de naissance du conducteur
                        </FormDescription>
                      )
                    }
                  </FormItem>
                )}
              />

              {/* CIN ou Passeport */}
              <FormField
                control={form.control}
                name="cin_passport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      CIN ou Passeport
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 12345678 ou X1234567"
                        {...field}
                      />
                    </FormControl>
                    {
                      form.formState.errors?.cin_passport ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          Veuillez saisir le numéro de la CIN ou de passeport du conducteur
                        </FormDescription>
                      )
                    }
                  </FormItem>
                )}
              />

              {/* Date de délivrance du CIN (if CIN) */}

                {isCIN  ?

                <FormField
                    control={form.control}
                    name="date_delivrance_cin"
                    key='date_delivrance_cin'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >
                          Date de délivrance du CIN
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            date={field.value}
                            setDate={field.onChange}
                            title="Choisir la date de délivrance du CIN"
                            disabled={(date) => date > new Date()}
                          />
                        </FormControl>
                        {
                          form.formState.errors?.date_delivrance_cin ? (
                            <FormMessage />
                          ) : (
                            <FormDescription>
                              Veuillez indiquer la date de délivrance du CIN
                            </FormDescription>
                          )
                        }
                      </FormItem>
                    )}
                  />  
                
                :(
                  <FormField
                    control={form.control}
                    name="nationalite"
                    key='nationalite'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >
                          Nationalité
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Française, Tunisienne, etc."
                            {...field}
                          />
                        </FormControl>
                        {
                          form.formState.errors?.nationalite ? (
                            <FormMessage />
                          ) : (
                            <FormDescription>
                              Veuillez indiquer la nationalité figurant sur le passeport
                            </FormDescription>
                          )
                        }
                      </FormItem>
                    )}
                  />
                )}


              {/* Permis de conduire */}
              <FormField
                control={form.control}
                name="permis_conduire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Permis de conduire
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 12345678"
                        {...field}
                      />
                    </FormControl>
                    {
                      form.formState.errors?.permis_conduire ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          Veuillez saisir le numéro de permis du conducteur
                        </FormDescription>
                      )
                    }
                  </FormItem>
                )}
              />

              {/* Date de délivrance du permis */}
              <FormField
                control={form.control}
                name="date_delivrance_permis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Date de délivrance du permis
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        setDate={(date) => field.onChange(date)}
                        title="Choisir la date de délivrance du permis"
                        disabled={(date) => date > new Date()}
                      /> 
                    </FormControl>
                    {
                      form.formState.errors?.date_delivrance_permis ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          Veuillez indiquer la date de délivrance du permis
                        </FormDescription>
                      )
                    }
                  </FormItem>
                )}
              />

              {/* Adresse */}
              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Adresse
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 12 rue de la République, Tunis"
                        {...field}
                      />
                    </FormControl>
                    {
                      form.formState.errors?.adresse ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          Veuillez renseigner l'adresse complète du conducteur
                        </FormDescription>
                      )
                    }
                  </FormItem>
                )}
              />

              {/* Téléphone */}
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: 22 558 856"
                        {...field}
                      />
                    </FormControl>
                    {
                      form.formState.errors?.telephone ? (
                        <FormMessage />
                      ) : (
                        <FormDescription>
                          Veuillez entrer le numéro de téléphone de conducteur.
                        </FormDescription>
                      )
                    }
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4 mt-4 border-t">
        <Button 
          type="button"
          variant="outline"
          className="rounded-sm"
          onClick={prev}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex items-center gap-3">
          {isOptional && (
            <Button 
              type="button"
              variant="ghost"
              className="text-rod-primary hover:text-gray-800"
              onClick={handleSkipStep}
            >
              Continuer avec un seul conducteur
            </Button>
          )}
          
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className="rounded-sm"
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateContratStep3;