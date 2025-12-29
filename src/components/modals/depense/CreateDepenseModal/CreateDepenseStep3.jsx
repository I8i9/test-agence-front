import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Textarea} from '@/components/ui/textarea'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button.jsx'
import { ChevronLeft , ChevronRight} from 'lucide-react'
import { Cost, costMisc } from "../../../../utils/costs";
import { z } from 'zod';
import {Form,FormField,FormMessage,FormItem,FormDescription,FormLabel,FormControl} from '@/components/ui/form.jsx' 
import { useState, useEffect } from "react";
import { DatePicker } from "../../../ui/date-picker";

const CreateDepenseStep3 = ({ setDepenseData, DepenseData, next, prev }) => {
  // cost depending on garage id
  const allCosts = [...Cost, ...costMisc] //DepenseData.id_garage ? Cost : costMisc;

  const [selectedCostInfo, setSelectedCostInfo] = useState(null);

  // Get valid values from the cost arrays
  const validCostValues = allCosts.map(c => c.value);

  const DepenseSchema = z.object({
    montant_depense: z.number({ required_error: "Le montant est requis.", invalid_type_error: "Le montant doit être un nombre." })
      .refine( val => val > 0,{
        message:"doit être supérieur à zéro."
      }),
    montant_interet: z.number({
        invalid_type_error: "intérêts doit être un nombre.",
      })
      .nonnegative("Le montant des intérêts ne peut pas être négatif.")
      .optional(), 
    rts_depense: z.number({
        invalid_type_error: "La retenue à la source doit être un nombre.",
      })
      .nonnegative("La retenue à la source ne peut pas être négative.")
      .optional(),
    numero_facture: z.string({ required_error: "Le numéro de facture est requis." }).optional(),
    description_depense: z.string().max(500, "La description ne peut pas dépasser 500 caractères.").optional(),
    type_depense: z.string({
        required_error: "Veuillez sélectionner un type de dépense valide.",
        invalid_type_error: "Veuillez sélectionner un type de dépense valide."
      })
      .refine(val => validCostValues.includes(val), {
        message: "Veuillez sélectionner un type de dépense valide.",
      }),
    date_depense:
      z.date({ required_error: "La date de la facture est requise.", invalid_type_error: "La date de la facture est invalide." }),
  }).superRefine((data, ctx) => {
    // If type_depense is CREDIT_BAIL, montant_interet is required and must be > 0
    if (data.rts_depense !== undefined && data.rts_depense > data.montant_depense) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La retenue à la source ne peut pas être supérieure au total.",
        path: ["rts_depense"],
      });
    }
  });

  const form = useForm({
    resolver: zodResolver(DepenseSchema),
    defaultValues: {
      type_depense: DepenseData.type_depense || "", 
      montant_depense: DepenseData.montant_depense || undefined,
      montant_interet: DepenseData.montant_interet || undefined,
      numero_facture: DepenseData.numero_facture || "",
      description_depense: DepenseData.description_depense || "",
      date_depense: DepenseData.date_depense || new Date(),
      rts_depense: DepenseData?.rts_depense || undefined,
    },
  });

  // Update selected cost info when type_depense changes
  useEffect(() => {
    const typeDepense = form.watch("type_depense");
    if (typeDepense) {
      const costInfo = allCosts.find(c => c.value === typeDepense);
      setSelectedCostInfo(costInfo);
    } else {
      setSelectedCostInfo(null);
    }
  }, [form.watch("type_depense")]);

  const handleSubmit = () => {
    const formData = {
      ...DepenseData,
      type_depense: form.getValues("type_depense"),
      montant_depense: form.getValues("montant_depense"),
      rts_depense: form.getValues("rts_depense"),
      numero_facture: form.getValues("numero_facture"),
      description_depense: form.getValues("description_depense"),
      date_depense: form.getValues("date_depense"),
      tva_depense: selectedCostInfo ? selectedCostInfo.tva * 100 : 0,
      deductible: selectedCostInfo ? selectedCostInfo.deductable : false,
    };
    
    // Only add montant_interet if leasing is selected
    if (form.getValues("type_depense") === "CREDIT_BAIL") {
      formData.montant_interet = form.getValues("montant_interet");
    }
    
    setDepenseData(formData);
    next(); 
  }

  return (
    <div className="flex flex-col justify-between h-full">
      <Form {...form}>
        <form id="declarer-depense-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-1">

          <div className="flex w-full flex-col space-y-3">
          <FormField
            control={form.control}
            name="type_depense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de dépense</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full ">
                      <SelectValue placeholder={DepenseData.id_garage ? "Ex : Réparation, Entretien, Vidange..." : "Ex : Loyer du bureau / dépôt, Salaires, Autres..."} />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {allCosts.map((dep, i) => {
                        const IconComp = dep.icon
                        return (
                          <SelectItem value={dep.value} key={i}>
                            <span className="flex gap-2"> 
                                <IconComp className="h-4 w-4" /> 
                              <span className="leading-tight">{dep.label}</span>
                            </span>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </FormControl>
                {form.formState.errors.type_depense ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Choisir la catégorie de dépense pour cette panne</FormDescription>
                )}
              </FormItem>
            )}
          />

          {/* Display TVA and Deductible info */} 
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-regular text-zinc-700">TVA applicable:</span>
                  <span className="ml-2 text-sm font-semibold ">{selectedCostInfo ? `${(selectedCostInfo.tva * 100).toFixed(0)}%` : "-"}</span>
                </div>
                <div>
                  <span className="text-sm font-regular text-zinc-700">Fiscalement:</span>
                  <span className={`ml-2 text-sm font-medium ${
                      selectedCostInfo ? selectedCostInfo?.deductable ? 'text-green-600' : 'text-red-600' : ''
                    }`}>
                    {selectedCostInfo
                      ? selectedCostInfo.deductable ? 'Déductible' : 'Non déductible'
                      : '-'}
                  </span>
                </div>
              </div>
            </div> 
          </div>
             


          <div className="flex flex-col items-center space-y-6 w-full">
            <div className="flex items-center gap-8 w-full">
              <div className="flex items-center justify-between gap-2 w-1/2">
              <FormField
                control={form.control}
                name="montant_depense"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Montant de Dépense</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Ex : 250 DT"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          className="pr-10"
                        /> 
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">DT</span>
                      </div>
                    </FormControl>
                    {form.formState.errors.montant_depense ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Coût total de la dépense en TTC</FormDescription>
                    )}
                  </FormItem>
                )}
              />
              {form.watch("type_depense") === "CREDIT_BAIL" && (
                  <FormField
                    control={form.control}
                    name="montant_interet"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="invisible">Montant des intérêts</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="Ex : 50 DT"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || "")}
                              className="pr-10"
                            /> 
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">DT</span>
                          </div>
                        </FormControl>
                        {form.formState.errors.montant_interet ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>Part dédiée aux intérêts en TTC</FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                )}
              </div>
              {/* rts Depense Field */}
              <FormField
                control={form.control}
                name="rts_depense"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Retenue à la source (Optionnel)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="Ex : 90DT"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? undefined : parseFloat(value));
                          }}
                          className="pr-10"
                        /> 
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">DT</span>
                      </div>
                    </FormControl>
                    {form.formState.errors.rts_depense ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Montant à reverser à l’administration fiscale. </FormDescription>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-8 w-full">

              <FormField
                control={form.control}
                name="date_depense"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Date de Depense</FormLabel>
                    <FormControl> 
                      <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                          title="Choisir la date de facture" 
                        />
                    </FormControl>
                    {form.formState.errors.date_depense ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Date de la depense</FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numero_facture"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Numéro de facture (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="FACT-2025-00123" {...field} />
                    </FormControl>
                    {form.formState.errors.numero_facture ? (
                      <FormMessage />
                    ) : (
                      <FormDescription>Référence du reçu ou facture</FormDescription>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="description_depense"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optionnelle)</FormLabel>
                <FormControl>
                  <Textarea className="h-12" placeholder="Ajoutez un commentaire ou des détails supplémentaires..." {...field} />
                </FormControl>
                {form.formState.errors.description_depense ? (
                  <FormMessage />
                ) : (
                  <FormDescription>Note complémentaire si nécessaire</FormDescription>
                )}
              </FormItem>
            )}
          /> 
        </form>
      </Form>
      
      {/* Navigation Footer */}
      <div className="flex justify-between mt-4 pt-4 border-t">
        <Button variant="outline" onClick={prev} className="rounded-sm">
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>

        <Button form="declarer-depense-form" className="rounded-sm">
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default CreateDepenseStep3