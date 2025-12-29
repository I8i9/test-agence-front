import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {  Check, Save, X , Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
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


import { colorsOptions, finishOptions } from '../../../../utils/colors';
import { DatePicker } from '../../../ui/date-picker';
import { useUpdateGarage } from '../../../../api/queries/garage/useUpdateGarage';
import { useEffect } from 'react';
import { formatDateTime, luxonToJSDate } from '../../../../utils/datautils';

// Zod schema for form validation
const formSchema = z.object({
  kilometrage: z
    .preprocess(
      (val) => (val === '' || val === undefined ? undefined : Number(val)),
      z.number(
        { required_error: "Le kilométrage est requis.",
          invalid_type_error: "Le kilométrage doit être un nombre."}
      )
      .min(0, "Le kilométrage doit être positif")
      .refine((val) => val >= 0, "Le kilométrage doit être positif")
      .refine((val) => val <= 9999999, "Le kilométrage semble trop élevé")
    ),
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
  vignette: z.boolean(),
  couleur_finition: z
    .string()
    .min(1, "Veuillez sélectionner une finition de couleur")
});


const UpdateTab = ({  onClose, vehicleData}) => {
  
  const { mutate: updateVehicle, isPending , isSuccess } = useUpdateGarage();

  // Initialize form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kilometrage: vehicleData?.kilometrage_garage || undefined,
      visite_technique: vehicleData?.date_visite_garage ? luxonToJSDate(vehicleData.date_visite_garage) : undefined,
      assurance: vehicleData?.date_assurance_garage ? luxonToJSDate(vehicleData.date_assurance_garage) : undefined,
      couleur: vehicleData?.couleur_garage || 'Blanc',
      vignette: vehicleData.probleme_vignette === false,
      couleur_finition: vehicleData?.couleur_finition_garage || 'Mat',
    }
  });

  const onSubmit = (data) => {
    console.log("dzdzd",data);
    const changedFields = {};
    const defaultValues = form.formState.defaultValues;

    Object.keys(data).forEach((key) => {
      // For dates, compare timestamps
      if (data[key] instanceof Date && defaultValues[key] instanceof Date) {
        if (data[key].getTime() !== defaultValues[key].getTime()) {
          changedFields[key] = data[key];
        }
      } else if (data[key] !== defaultValues[key]) {
        changedFields[key] = data[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      // Nothing changed, do not submit mutation
      return;
    }

    updateVehicle({...changedFields,visite_technique : formatDateTime(data.visite_technique), assurance: formatDateTime(data.assurance), id_garage: vehicleData.id_garage });
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      onClose();
    }
  }, [isSuccess]);

  const handleCancel = () => {
    form.reset();
    onClose();
  };




  return (
    <div className="h-full flex flex-col bg-white ">
      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pt-4 px-2">
        <div  className='flex flex-col justify-between h-full'>
          <Form {...form}>
            <form id="update-garage-details-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="grid grid-cols-2 gap-x-8">

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

                {/* Visite Technique */}
                <FormField
                  control={form.control}
                  name="visite_technique"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visite Technique</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} />
                       {
                        form.formState.errors?.visite_technique ? (
                          <FormMessage>
                            {form.getFieldState("visite_technique").error.message}
                          </FormMessage>
                        ) : (
                           <FormDescription  >
                            Entrez la date de la dernière visite technique du véhicule.
                          </FormDescription>
                        )
                      }
                    </FormItem>
                  )}
                />

              </div>

              {/* Date Section */}
              <div className="grid grid-cols-2 gap-x-8">
                

                {/* Assurance */}
                <FormField
                  control={form.control}
                  name="assurance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assurance</FormLabel>
                      <DatePicker date={field.value} setDate={field.onChange} />
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

                <div className='w-full'>
                
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

        
              </div>

              {/* vignette and colors Section */}
              <div className="grid grid-cols-2  gap-8">


                 {/* Vignette Section */}
                  <FormField
                    control={form.control}
                    name="vignette"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start border px-4 py-8   justify-between h-full   rounded-lg ">
                          <div className="">
                            <FormLabel className=" cursor-pointer text-base flex-col items-start font-medium ">
                              Vignette
                            
                            <p className="text-sm font-normal text-gray-500 ">
                              Je confirme que la vignette a été payée pour ce véhicule, avec une échéance au 05/05/2025.
                            </p>
                            </FormLabel>
                          </div>
                          <FormControl>
                            <Switch
                              className="mt-1.5 cursor-pointer"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                {/* Color Selection */}
                <FormField
                  control={form.control}
                  name="couleur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-10 gap-2">
                          {colorsOptions.map((color) => (
                            <Button
                              key={color.name}
                              type="button"
                              onClick={() => field.onChange(color.name)}
                              className={
                                `w-9 h-9 rounded-lg relative transition-all hover:scale-105 ${
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
         <div className='flex justify-end gap-4'>
                    <Button
                      onClick={handleCancel}
                      type="button"
                      variant="outline"
                    >
                      <X className="mb-0.5" />
                      Annuler
                    </Button>

                <Button
                  disabled={form.formState.isDirty === false || isPending}
                  type="submit"
                  form="update-garage-details-form"
                >
                  {isPending ? (
                      <>
                      <Loader2 className="text-mute-foreground  animate-spin" />
                      En cours...
                      </>
                    ) : (
                    <>
                    <Save className="mb-0.75" />
                    Enregistrer
                    </>
                    )}
                </Button>
          </div>
              
        </div>
      </div>
    </div>
  );
};

export default UpdateTab;