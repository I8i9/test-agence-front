import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {  Car, Check, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { isAfter, subYears , addYears } from 'date-fns';
import { useEffect } from 'react';

import { colorsOptions, finishOptions } from '../../../../utils/colors';
import { DatePicker } from '../../../ui/date-picker';

import { useHookFormMask } from "use-mask-input";


// Zod schema for form validation
const formSchema = z.object({
  matricule: z
    .string({ required_error:"Le matricule est requis." })
    .regex(/^[A-Z0-9]{3}\sTU\s\d{4}$/, "Le matricule doit être au format XXX TU XXXX"),
  kilometrage: z
    .preprocess(
      (val) => (val === '' || val === undefined ? undefined : Number(val)),
      z.number(
        { required_error: "Le kilométrage est requis.",
          invalid_type_error: "Le kilométrage doit être un nombre." }
      )
        .min(0, "Le kilométrage doit être positif")
      .refine((val) => val >= 0, "Le kilométrage doit être positif")
      .refine((val) => val <= 9999999, "Le kilométrage semble trop élevé")
    ),
    achat : z
    .date({
      invalid_type_error: "La date d'assurance est requise.",
      required_error: "La date d'achat est requise.",
    }),
  visite_technique: z
    .date({
      invalid_type_error: "La date d'assurance est requise.",
      required_error: "La date de visite technique est requise.",
    }),
  assurance: z
    .date({
      invalid_type_error: "La date d'assurance est requise.",
      required_error: "La date d'assurance est requise.",
    }),
  couleur: z
    .string()
    .min(1, "Veuillez sélectionner une couleur"),
  couleur_finition: z
    .string()
    .min(1, "Veuillez sélectionner une finition de couleur")
});


const CarForm = ({ next , prev , setCar , Car}) => {


  // Initialize form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kilometrage:  Car?.kilometrage_garage || "",
      visite_technique: Car?.date_visite_garage || "",
      assurance: Car?.date_assurance_garage || "",
      achat: Car?.date_achat_garage || "",
      matricule: Car?.matricule_garage || "",
      couleur: Car?.couleur_garage || 'Blanc',
      couleur_finition: Car?.couleur_finition_garage || 'Métallisé',
    }
  });

  const onSubmit = (data) => {
    setCar((prev) => ({
        ...prev,
        matricule_garage: data.matricule,
        kilometrage_garage: data.kilometrage,
        date_visite_garage: data.visite_technique,
        date_assurance_garage: data.assurance,
        date_achat_garage: data.achat,
        couleur_garage: data.couleur,
        couleur_finition_garage: data.couleur_finition,
    }));
    next();
  };

  const registerWithMask = useHookFormMask(form.register);

  const achatDate = form.watch('achat');                  
  const oneYearAgo = subYears(new Date(), 1); // date exactly 1 year before today

  const isLessThanOneYear = achatDate ? isAfter(achatDate, oneYearAgo) : false;

  useEffect(() => {
    if(isLessThanOneYear && achatDate) {
      form.setValue('visite_technique', achatDate);
    }
  }, [isLessThanOneYear,achatDate]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto ">
        <div  className='flex flex-col justify-between h-full'>
          <Form {...form}>
            <form id="add-car-garage-data-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
              {/* Basic Information Section */}
              <div className="grid grid-cols-2 gap-x-8">

                {/* Matricule */}
                <FormField
                  control={form.control}
                  name="matricule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matricule</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Ex: 236 TU 1234"
                          {...registerWithMask("matricule", "999 TU 9999", {
                            required: true,
                            placeholder: "-",
                            showMaskOnHover: false,
                          })}
                          onChange={(e) => {
                            const value = e.target.value.replace(/tu/gi, 'TU');
                            field.onChange(value); // update form value
                          }}
                        />
                      </FormControl>
                      {
                        form.formState.errors?.matricule ? (
                          <FormMessage>
                            {form.getFieldState("matricule").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription>
                            Entrez le matricule de votre véhicule.
                          </FormDescription>
                        )
                      }
                    </FormItem>
                  )}
                />

                {/* Kilométrage */}
                <FormField
                  control={form.control}
                  name="kilometrage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilométrage</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <Input
                              type="number"
                              placeholder="Ex: 154000"
                              {...field}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">km</span>
                          </div>
                        
                      </FormControl>
                      {
                        form.formState.errors?.kilometrage ? (
                          <FormMessage>
                            {form.getFieldState("kilometrage").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription >
                            Entrez le kilométrage actuel de votre véhicule.
                          </FormDescription>
                        )
                      }

                    </FormItem>
                  )}
                />

               

              </div>

              {/* Date achat & color Section */}
              <div className="grid grid-cols-2 gap-x-8">

                {/* Date d'Achat */}
                <FormField
                  control={form.control}
                    name="achat"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Date de Mise en Circulation</FormLabel>
                            <DatePicker disabled={(date) => date  > new Date()} date={field.value} setDate={field.onChange} />
                            {
                                form.formState.errors?.achat ? (
                                    <FormMessage>
                                        {form.getFieldState("achat").error.message}
                                    </FormMessage>
                                ) : (
                                    <FormDescription>
                                        Entrez la date de mise en circulation de votre véhicule.
                                    </FormDescription>
                                )
                            }
                        </FormItem>
                    )}
                />

                {/* Color Finish */}
                <FormField
                  control={form.control}
                    name="couleur_finition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Finition Couleur</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger  className="w-full cursor-pointer">
                              <SelectValue placeholder="Choisissez la finition de couleur de votre véhicule" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {finishOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {
                          form.formState.errors?.couleur_finition ? (
                            <FormMessage>
                              {form.getFieldState("couleur_finition").error.message}
                            </FormMessage>
                          ) : (
                            <FormDescription>
                              Sélectionnez la finition de couleur de votre véhicule.
                            </FormDescription>
                          )
                        }
                        <FormMessage />
                      </FormItem>
                    )}
                  />
        
              </div>

              {/* vignette , visite and color Section */}
              <div className="grid grid-cols-2  gap-x-8">

                {/* Vignette  & visite*/}
                <div className='flex flex-col gap-6'>


                {/* Visite Technique */}
                <FormField
                  control={form.control}
                  name="visite_technique"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visite Technique</FormLabel>
                      <DatePicker disabledButton={isLessThanOneYear} disabled={(date) => date  > new Date() || date < form.watch("achat") || date < addYears(form.watch("achat"),1) } date={field.value} setDate={field.onChange}  />
                       {
                        form.formState.errors?.visite_technique ? (
                          <FormMessage>
                            {form.getFieldState("visite_technique").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription  >
                            {
                              form.watch("achat") && isLessThanOneYear ?
                              "La visite technique est fixée car le véhicule a moins d’un an."
                              : "Entrez la date de la dernière visite technique du véhicule."
                            }
                          </FormDescription>
                        )
                      }
                    </FormItem>
                  )}
                />


                 {/* Assurance */}
                <FormField
                  control={form.control}
                  name="assurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assurance</FormLabel>
                      <DatePicker disabled={(date) => date  > new Date()} date={field.value} setDate={field.onChange} />
                       {
                        form.formState.errors?.assurance ? (
                          <FormMessage>
                            {form.getFieldState("assurance").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription >
                            Entrez la date de la dernière assurance du véhicule.
                          </FormDescription>
                        )
                      }
                    </FormItem>
                  )}
                />
                </div>

                {/* Color Selection */}
                <FormField
                  control={form.control}
                  name="couleur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-8 gap-2">
                          {colorsOptions.map((color) => (
                            <Button
                              key={color.name}
                              type="button"
                              onClick={() => field.onChange(color.name)}
                              className={
                                `w-11 h-11 rounded-lg relative transition-all hover:scale-105 ${
                                  field.value === color.name 
                                    ? " ring-2 ring-black ring-offset-2" 
                                    : color.name === 'Blanc' ? 
                                      "border border-gray-300" : 
                                      ""
                                }`
                              }
                              style={{ backgroundColor: color.color }}
                              title={color.name}
                              aria-label={`Couleur ${color.name}`}
                            >
                              {field.value === color.name && (
                                <Check 
                                  className="absolute inset-0 m-auto w-5 h-5" 
                                  style={{ 
                                    color: color.name === 'Blanc' || color.name === 'Jaune' || color.name === 'Or' || color.name === 'Crème' || color.name === 'Beige' || color.name === 'Vert Clair'
                                      ? '#000000' 
                                      : '#FFFFFF' 
                                  }} 
                                />
                              )}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <div className="flex w-full justify-between items-center gap-2 ">
                        <p className="text-sm text-gray-500">Choisissez la couleur de votre véhicule. </p>
                        <span className="text-sm font-semibold text-gray-900">{field.value}</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

               
              </div>

             
            </form>
          </Form>
          { /* Action Buttons */}
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

export default CarForm;