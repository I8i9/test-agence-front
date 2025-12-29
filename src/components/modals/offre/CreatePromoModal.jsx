import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Percent, Loader2 } from "lucide-react"; 
import { subDays, isAfter } from "date-fns"; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddPromo } from "../../../api/queries/promo/useCreatePromo";




function CreatePromoModal({ id, open, onClose, debutoffre, finoffre, sequence }) {
  
  const promoTypes = [
    { value: "PERSONNALISEE", title: "Personnalisée" },
    { value: "SOLDES_HIVER", title: "Soldes Hiver" },
    { value: "SOLDES_ETE", title: "Soldes Été" },
    { value: "RENTREE_SCOLAIRE", title: "Rentrée Scolaire" },
    { value: "BLACK_FRIDAY", title: "Black Friday" },
    { value: "FIN_ANNEE", title: "Fin d’Année" },
    { value: "RAMADHAN", title: "Ramadhan" },
    { value: "AID_EL_FITR", title: "Aïd el-Fitr" },
    { value: "AID_EL_ADHA", title: "Aïd el-Adha" },
    { value: "MOULID_ENNABAOUI", title: "Moulid Ennabaoui" },
  ];
  const promoValues = promoTypes.map(p => p.value)


  const debutOffreDate = isAfter(new Date(debutoffre), new Date()) ? new Date(debutoffre) : new Date();
  const finOffreDate = new Date(finoffre);
  debutOffreDate.setHours(0, 0, 0, 0);

  const { mutate: createPromo, isPending } = useAddPromo({
    onSuccess: () => {
      onClose();
    },
  });

  const PromoFormSchema = z
    .object({
      taux_promo: z
        .string()
        .min(1, "Le pourcentage de réduction est requis")
        .max(2, "Le pourcentage ne peut pas dépasser 3 chiffres")
        .regex(/^\d+$/, "Veuillez entrer un nombre"),
      date_debut_promo: z.date({ required_error: "Veuillez sélectionner une date de début." }),
      date_fin_promo: z.date({ required_error: "Veuillez sélectionner une date de fin." }),
      type_promo: z.enum(promoValues),
    })
    .refine((data) => data.date_debut_promo < data.date_fin_promo, {
      message: "La date de fin doit être après la date de début",
      path: ["date_fin_promo"],
    });

  const AddPromoForm = useForm({
    resolver: zodResolver(PromoFormSchema),
    defaultValues: {
      taux_promo: "",
      date_debut_promo: undefined,
      date_fin_promo: undefined,
      type_promo: "PERSONNALISEE",
    },
  });

  const handleAddPromo = (data) => {
    const payload = {
      date_debut_promo: data.date_debut_promo.toISOString(),
      date_fin_promo: data.date_fin_promo.toISOString(),
      taux_promo: data.taux_promo,
      type_promo: data.type_promo,
      id_offre: id,
    };
    createPromo(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="pb-2 pt-5 px-6 w-[680px]">
                <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
                <Percent className="size-5 desktop-lg:size-6"/>
              </span>
              <span className="text-base">
               Mettre l'offre {sequence} en promotion ?
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-sm text-muted-foreground">
                Définissez une réduction et sa durée pour cette offre.      
          </DialogDescription>
          <Separator />
        </DialogHeader>
        <Form {...AddPromoForm}>
          <form onSubmit={AddPromoForm.handleSubmit(handleAddPromo)} className="space-y-6 py-3">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={AddPromoForm.control}
                name="type_promo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de promotion</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Sélectionner un type de promo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {promoTypes.map((promotype,id) => (
                          <SelectItem className="w-full" key={id} value={promotype.value}>
                            {promotype.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Choisissez le type de promotion.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={AddPromoForm.control}
                name="taux_promo"
                render={({ field ,fieldState }) => (
                  <FormItem>
                    <FormLabel>Pourcentage de réduction (%)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="1-100%" maxLength={2} {...field} />
                    </FormControl>
                  {fieldState.error ? (
                  <FormMessage />  
                ) : (
                  <FormDescription>Saisissez le pourcentage de la réduction</FormDescription>
                )}
                  </FormItem>
                )}
              />
            </div>
                
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={AddPromoForm.control}
                name="date_debut_promo"
                render={({ field ,fieldState}) => (
                  <FormItem>
                    <FormLabel>Début de la promotion</FormLabel> 
                        <DatePicker 
                          date={field.value} 
                          setDate={field.onChange} 
                          title="Sélectionner une date"
                          disabled={(date) => date < debutOffreDate || date > subDays(finOffreDate, 2)}
                        /> 
                               {fieldState.error ? (
                  <FormMessage />  
                ) : (
                  <FormDescription>Saisir la date de début</FormDescription>
                )}

                  </FormItem>
                )}
              />

              <FormField
                control={AddPromoForm.control}
                name="date_fin_promo"
                render={({ field,fieldState  }) => (
                  <FormItem>
                    <FormLabel>Fin de la promotion</FormLabel>
                    <DatePicker 
                    date={field.value} 
                    setDate={field.onChange} 
                    title="Sélectionner une date"
                    disabled={(date) => {
                            const dateDebut = AddPromoForm.getValues().date_debut_promo;  
                            if (!dateDebut) return true;
                            if (date <= dateDebut) return true;
                            if (date > finOffreDate) return true;
                            return false;
                          }}
                     />
                {fieldState.error ? (
                  <FormMessage />  
                ) : (
                  <FormDescription>Saisir la date de fin</FormDescription>
                )}
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="w-full pt-2">
              <Button type="button" variant="outline" className="rounded-sm" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" className="rounded-sm" disabled={isPending}>
                {isPending ? (
                  <>
                    En cours...
                    <Loader2 className="ml-2 text-muted-foreground animate-spin h-5 w-5" />
                  </>
                ) : (
                  "Appliquer promotion"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePromoModal;
