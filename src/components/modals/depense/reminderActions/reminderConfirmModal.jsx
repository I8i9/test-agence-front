import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Textarea} from '@/components/ui/textarea'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button.jsx'
import { Switch } from "@/components/ui/switch";
import {Loader2, Icon, CheckCheck} from 'lucide-react'
import { allCosts , CostArray , CostMiscArray } from "../../../../utils/costs";
import { z } from 'zod';
import {Form,FormField,FormMessage,FormItem,FormDescription,FormLabel,FormControl} from '@/components/ui/form.jsx'
import { useAddCost } from "../../../../api/queries/cost/useAddCost";
import useConfirmRappel from "../../../../api/queries/depense/rappel/useCofirmRappel";


export const ReminderConfirmModal = ({open,data,close}) => {
    const {mutate : addCost , isPending : isPendingCost} = useAddCost();

    const {mutate : confirmRappel , isPending : isPendingRappel} = useConfirmRappel();

    const hasMontant = data.montant && data.montant > 0;

    const [deductible , setDeductible] = useState(false);

    const schema = z.object({
    montant_depense: z.number({ required_error: "Le montant est requis.", invalid_type_error: "Le montant doit être un nombre." })
        .positive("Le montant doit être supérieur à zéro."),
    numero_facture: z.string({ required_error: "Le numéro de facture est requis." }).optional(),
    description_depense: z.string().max(500, "La description ne peut pas dépasser 500 caractères.").optional(),
    type_paiement_depense: z.string({ required_error: "Le type de paiement est requis." }),
    type_depense: z
        .string({
          required_error: "Veuillez sélectionner un type de dépense valide.",
          invalid_type_error : "Veuillez sélectionner un type de dépense valide."
        })
        .refine(val => [...CostArray, ...CostMiscArray].includes(val), {
          message: "Veuillez sélectionner un type de dépense valide.",
        }),
    tva_depense: z.coerce.number({ invalid_type_error: "La TVA doit être un nombre." })
    });

    const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
        type_depense: data.type,
        montant_depense: data.montant || "",
        numero_facture: "",
        tva_depense: data.tva || 0,
        type_paiement_depense : data.type_paiement || "",
        description_depense: "",
    },
    });


    const handleSubmit=(dataform)=>{
        dataform.deductible = deductible;
        addCost({...dataform , id_garage : data.id_garage});
        confirmRappel({id : data.id , show: false});
        close();
    }

    const handleWithoutCost = () => {
        confirmRappel({id : data.id , show: true});
        close();
    };

    return (
    <Dialog open={open} onOpenChange={close}>
        <DialogContent className="pb-2 pt-5 px-8  !w-[750px]">
        <DialogHeader>
            <DialogTitle>
            <div className="w-full flex items-center gap-2">
                <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
                <CheckCheck  className="size-5 desktop-lg:size-6" />
                </span>
                <span className="text-base">Confirmer ce rappel de paiement ?</span>
            </div>
            </DialogTitle>
            <DialogDescription className='flex items-start text-sm '>
            Confirmez ce rappel comme payé ou confirmez-le et créez une dépense correspondante.
            </DialogDescription>
            <Separator />
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-3">
            <FormField
                control={form.control}
                name="type_depense"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-muted-foreground'>Type de dépense</FormLabel>
                    <FormControl>
                    <Select disabled value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full ">
                        <SelectValue  />
                        </SelectTrigger>
                        <SelectContent className="max-h-56">
                        {
                        allCosts.map((dep,i)=>{
                            const IconComp= dep.icon
                            return (
                        <SelectItem value={dep.value} key={i}>{
                            <span className="flex gap-2">
                                {
                                ['SALAIRES','CNSS_ASSURANCE','FOURNITURES','PNEUS'].includes(dep.value) ?
                                <Icon iconNode={IconComp} className="h-4 w-4" />
                                :
                                <IconComp className="h-4 w-4" />
                                }
                                <span className="leading-tight">{dep.label}</span>
                            </span>
                        }</SelectItem>
                            )
                        })
                        }
                        </SelectContent>
                    </Select>
                    </FormControl>
                    {form.formState.errors.type_depense ? (
                    <FormMessage />
                    ) : (
                    <FormDescription className='text-muted-foreground'>Choisir la catégorie de dépense pour cette panne</FormDescription>
                    )}
                </FormItem>
                )}
            />

            <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-8 w-full"> 
                <FormField
                control={form.control}
                name="montant_depense"
                render={({ field }) => (
                    <FormItem className="w-1/2">
                    <FormLabel className={`${
                        data.montant ? "text-muted-foreground" : ""}`}>Montant</FormLabel>
                    <FormControl>
                    <div className="relative">
                        <Input
                        type="number"
                        placeholder="Ex : 250 DT"
                        disabled={hasMontant}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || "")}
                        className="pr-10"
                        /> 
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">DT</span>
                    </div>
                    </FormControl>
                    {form.formState.errors.montant_depense ? (
                        <FormMessage />
                    ) : (
                        <FormDescription>Coût total de la dépense en DT</FormDescription>
                    )}
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="type_paiement_depense"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Type de paiement</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Ex : Cheque, Virement, Espece..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ESPECE">Espèce</SelectItem>
                              <SelectItem value="CHEQUE">Chèque</SelectItem>
                              <SelectItem value="VIREMENT">Virement</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        {form.formState.errors.type_paiement_depense ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>Choisir le moyen de paiement</FormDescription>
                        )}
                      </FormItem>
                    )}
                  /> 
                  </div>
                  <div className="flex items-center gap-8 w-full"> 
                <FormField
                  control={form.control}
                  name="numero_facture"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Numéro de facture (optionnel)</FormLabel>
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
                <div className="w-1/2">
                  <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium">TVA (optionnelle)</label>
                      <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{deductible ? "Réductible" : "Non réductible"}</span>
                          <Switch 
                              checked={deductible}
                              onCheckedChange={setDeductible}
                          />
                      </div>
                  </div>
                <FormField
                    control={form.control}
                    name="tva_depense"
                    render={({ field }) => (
                      <FormItem> 
                        <FormControl>
                          <div className="relative">
                          <Input
                            type="number"
                            placeholder="Ex : 19 %"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || "")}
                          className="pr-10"
                            /> 
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">%</span>
                        </div>
                        </FormControl>
                        {form.formState.errors.tva_depense ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>Pourcentage de la TVA</FormDescription>
                        )}
                      </FormItem> 
                    )}
                  />
                </div>
                </div>
            </div>

            <FormField
                control={form.control}
                name="description_depense"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Description (optionnelle)</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Ajoutez un commentaire ou des détails supplémentaires..." {...field} />
                    </FormControl>
                    {form.formState.errors.description_depense ? (
                    <FormMessage />
                    ) : (
                    <FormDescription>Note complémentaire si nécessaire</FormDescription>
                    )}
                </FormItem>
                )}
            />
        <DialogFooter className="w-full pt-2">
                <Button onClick={handleWithoutCost} type="button" variant="ghost">
                Confirmer seulement
                </Button>
                <Button type="submit">
                {isPendingCost || isPendingRappel ? <>Enregistrement en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Confirmer et créer une dépense"}

                </Button>
        </DialogFooter>
        </form>
        </Form>
        
        </DialogContent>
    </Dialog>
  );
};
