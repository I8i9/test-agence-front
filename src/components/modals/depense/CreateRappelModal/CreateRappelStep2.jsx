import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button.jsx'
import { Icon , ChevronLeft , ChevronRight, Info} from 'lucide-react'
import {  costMisc, Rappel  } from "../../../../utils/costs";
import { DatePicker } from '../../../ui/date-picker';
import {  getDaysInMonth, setDate} from 'date-fns';
import {Label} from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { z } from 'zod';
import {Form,FormField,FormMessage,FormItem,FormDescription,FormLabel,FormControl} from '@/components/ui/form.jsx'
import { RappelArray , CostMiscArray } from "@/utils/costs";
import { addWeeks, addMonths, addYears , subDays , startOfDay } from 'date-fns';
import { formatDateDDMMYYYYJS } from "../../../../utils/dateConverterJS";
import ToolTipCustom from "../../../customUi/tooltip";


const CreateRappelStep2 = ({ setRappelData, RappelData, next, prev }) => {
  // cost depending on garage id
  const cost = RappelData.id_garage ? Rappel : costMisc;

  const [isAvailableNow, setIsAvailableNow] = useState(RappelData?.isAvailableNow !== undefined ? RappelData.isAvailableNow : true);
  const [montantFixe, setMontantFixe] = useState(RappelData?.montantFixe !== undefined ? RappelData.montantFixe : true);


    const DepenseSchema = z.object({
        date_debut: z.date({ required_error: "La date de début est requise." , invalid_type_error: "La date de début doit être une date valide."}),
        date_fin: z.string({required_error :"Le nombre d'échéances est requis."})
        .refine((val) => {
                if (montantFixe) {
                    if (!val || val.trim() === '') return false;
                }
                return true;
            }, "Le nombre d'échéances est requis.")
        
        .refine((val) => {
                if (montantFixe) {
                    if (val <= 0) return false;
                }
                return true;
            }, "Le nombre d'échéances doit être supérieur à zéro."),
        montant_depense: z.string()
            .optional()
            .refine((val) => {
                if (montantFixe) {
                    if (!val || val.trim() === '') return false;
                }
                return true;
            }, "Le montant est requis.")
            .refine((val) => {
                if (montantFixe) {
                    if (val && val.trim() === '') return false;
                    const num = parseFloat(val);
                    return !isNaN(num) && num > 0;
                }
                return true;
            }, "Le montant doit être supérieur à zéro."),

        delai: z.enum(['1', '2', '3', '4', '5', '6', '7'], {
          required_error: "Veuillez sélectionner un délai valide.",
        }),
        periodicite: z.enum(["HEBDOMADAIRE", "MENSUEL", "TRIMESTRIEL", "SEMESTRIEL", "ANNUEL"], {
          required_error: "Veuillez sélectionner une périodicité valide.",
        }),
        type_depense: z
        .string({
          required_error: "Veuillez sélectionner un type de dépense valide.",
          invalid_type_error : "Veuillez sélectionner un type de dépense valide."
        })
        .refine(val => RappelData.id_garage ? RappelArray.includes(val) : CostMiscArray.includes(val), {
          message: "Veuillez sélectionner un type de dépense valide.",
        }),
  });
  const form = useForm({
    resolver: zodResolver(DepenseSchema),
    defaultValues: {
    date_debut: RappelData?.date_debut || new Date(),
    date_fin:  RappelData?.date_fin || undefined,
      type_depense: RappelData.type_depense || "",
      montant_depense: RappelData.montant_depense || "",
      delai: RappelData.delai || undefined,
      periodicite: RappelData.periodicite || undefined,
    },
  }); 

  useEffect(() => {
    if(!montantFixe) {
      form.setValue("montant_depense", "");
    }
  }, [montantFixe]);

  const handleSubmit = (data) => {
     setRappelData({ ...RappelData,
        date_debut: data.date_debut,
        date_fin: data.date_fin,
       type_depense: data.type_depense,
       montant_depense: data.montant_depense,
       delai: data.delai,
       periodicite: data.periodicite,
       isAvailableNow: isAvailableNow,
       montantFixe: montantFixe,
       date_fin_rappel : getLastDate()

     });
     next(); 
  }
  const handleSwitchChange = (checked) => {
        setIsAvailableNow(checked);
        if (checked) {
            form.setValue("date_debut", new Date());
        }
    }; 
  const dateDebut = startOfDay(form.watch("date_debut"));
  const periodicite = form.watch("periodicite");
  const delai = form.watch("delai");
  const nbre = form.watch("date_fin");

  const getLastDate = () => {
     const currentDate = dateDebut || new Date();
  let lastDate = currentDate;
  const targetDay = lastDate.getDate(); // Save the original day (e.g., 31)

  for (let i = 1; i <= nbre-1; i++) {
    switch (periodicite) {
      case "HEBDOMADAIRE":
        lastDate = addWeeks(lastDate, 1);
        break;
      case "MENSUEL":
        lastDate = addMonths(lastDate, 1);
        break;
      case "TRIMESTRIEL":
        lastDate = addMonths(lastDate, 3);
        break;
      case "SEMESTRIEL":
        lastDate = addMonths(lastDate, 6);
        break;
      case "ANNUEL":
        lastDate = addYears(lastDate, 1);
        break;
      default:
        break;
    }

    // 🔧 Adjustment: keep targetDay if possible, otherwise last day of month
    if (periodicite !== "HEBDOMADAIRE") {
    const daysInMonth = getDaysInMonth(lastDate);
    const correctedDay = Math.min(targetDay, daysInMonth);
    lastDate = setDate(lastDate, correctedDay);
    }
  }
    return startOfDay(lastDate);
  }
  const getNextReminder = (withDelai) => {
    const currentDate = dateDebut || new Date();
    let nextDate = currentDate;

    if (withDelai && delai ) {
      return subDays(nextDate, delai);
    }

    switch (periodicite) {
      case "HEBDOMADAIRE":
        nextDate = addWeeks(currentDate, 1);
        break;
      case "MENSUEL":
        nextDate = addMonths(currentDate, 1);
        break;
      case "TRIMESTRIEL":
        nextDate = addMonths(currentDate, 3);
        break;
      case "SEMESTRIEL":
        nextDate = addMonths(currentDate, 6);
        break;
      case "ANNUEL":
        nextDate = addYears(currentDate, 1);
        break;
      default:
        break;
      
    }

    return nextDate;
  }
  return (
    <div className="flex flex-col justify-between h-full">
        <Form {...form}>
              <form id="declarer-depense-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 px-1">
                <div className='flex flex-col gap-8 pb-2'>
                    <div className='flex gap-8'>
                        <div className="w-1/2">
                            <FormField
                                control={form.control}
                                name="date_debut"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className={`${isAvailableNow ? "text-muted-foreground" : ""}`}>Date de l'échéance</FormLabel>
                                        <DatePicker
                                            date={field.value}
                                            setDate={field.onChange}
                                            disabledButton={isAvailableNow}
                                            disabled={(date) => (date < startOfDay(new Date()) )}
                                        />
                                        {
                                            form.formState.errors.date_debut ? (
                                                <FormMessage >
                                                    {form.getFieldState("date_debut").error?.message}
                                                </FormMessage>
                                            ) : (
                                                <FormDescription>Indiquez la date à laquelle ce paiement doit être effectué.</FormDescription>
                                            )
                                        }
                                        
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-1/2">
                          <FormField
                            control={form.control}
                            name="periodicite"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel>Périodicité</FormLabel>
                                <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Sélectionner une périodicité" />
                                    </SelectTrigger>
                                    <SelectContent >
                                      <SelectItem value="HEBDOMADAIRE">Chaque Semaine</SelectItem>
                                      <SelectItem value="MENSUEL">Chaque Mois</SelectItem>
                                      <SelectItem value="TRIMESTRIEL">Chaque Trimestre</SelectItem>
                                      <SelectItem value="SEMESTRIEL">Chaque Semestre</SelectItem>    
                                      <SelectItem value="ANNUEL">Chaque Année</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                {form.formState.errors.periodicite? (
                                  <FormMessage />
                                ) : (
                                  <FormDescription>
                                    {
                                      form.getValues("periodicite") && form.getValues("date_debut") ?
                                      <>Votre prochaine date de rappel est le <span className="font-medium">{formatDateDDMMYYYYJS(getNextReminder())}</span>.</>
                                      :
                                      "Fréquence du rappel."
                                    }
                                  
                                  </FormDescription>
                                )}
                              </FormItem>
                            )}
                          />
                        </div>
                    </div>
                <div className='flex items-center gap-2'>
                    <Switch
                        className="cursor-pointer"
                        id="isAvailableNow"
                        checked={isAvailableNow}
                        onCheckedChange={handleSwitchChange}
                    />
                    <Label className="cursor-pointer " htmlFor="isAvailableNow">L’échéance est due aujourd’hui.</Label>
                </div>
            </div>
 
            <div className="flex items-center gap-8  w-full">
                
                <FormField
                  control={form.control}
                  name="type_depense"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Type de dépense</FormLabel>
                      <FormControl >
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full ">
                            <SelectValue placeholder={RappelData.id_garage ? "Ex : Réparation, Entretien, Vidange..." : "Ex : Loyer du bureau / dépôt, Salaires, Autres..."} />
                          </SelectTrigger>
                          <SelectContent className="max-h-56">
                          {
                            cost.map((dep,i)=>{
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
                        <FormDescription>Choisir la catégorie de dépense pour cette panne.</FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                 <div className="w-1/2">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Montant de Dépense</label>
                        <div className="flex items-center gap-2">
                             <ToolTipCustom trigger={<span className="text-sm text-gray-600 leading-tight cursor-pointer flex items-start gap-1"> {montantFixe ? 'Fixe' : 'Variable'}<Info className="w-3 h-3" /></span>} 
                             message={
                              <ul className="list-none  list-inside space-y-1">
                                <li><span className="font-medium">Fixe :</span>  même montant à chaque échéance.</li>
                                <li><span className="font-medium">Variable :</span> montant ajusté à chaque échéance.</li>
                              </ul>
                            } />
                            <Switch
                                checked={montantFixe}
                                onCheckedChange={setMontantFixe}
                            />
                        </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="montant_depense"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <div className="relative">
                            <Input
                              type="number"
                              placeholder="Ex : 250 DT"
                              {...field}
                               disabled={!montantFixe}
                            className="pr-10"
                              /> 
                              <span className={`absolute ${!montantFixe ? 'opacity-50' : ''} text-gray-500 text-sm right-2 top-1/2 transform -translate-y-1/2`}>DT</span>
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
                  </div>
                </div>
    
                <div className="flex items-center gap-8 w-full">
                  <FormField
                    control={form.control}
                    name="date_fin"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-1/2">
                            <FormLabel>Nombre d'échéances</FormLabel>
                            <Input
                                type="number"
                                placeholder="Ex : 12"
                                {...field}
                            />
                            {
                                form.formState.errors.date_fin ? (
                                    <FormMessage >
                                        {form.getFieldState("date_fin").error?.message}
                                    </FormMessage>
                                ) : (
                                    <FormDescription>{field.value > 0 && periodicite ? <>Le dernier rappel sera le <span className="font-medium">{formatDateDDMMYYYYJS(getLastDate())}</span>.</> : "Nombre total d’échéances, y compris le premier paiement." } </FormDescription>
                                )
                            }
                        </FormItem>
                    )}
                />
                  <FormField
                    control={form.control}
                    name="delai"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Délai de notification</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange} className="w-full">
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un délai" />
                            </SelectTrigger>
                            <SelectContent className="max-h-40">
                              <SelectItem value="1">1 Jour</SelectItem>
                              <SelectItem value="2">2 jour</SelectItem>
                              <SelectItem value="3">3 jour</SelectItem>
                                <SelectItem value="4">4 jour</SelectItem>
                                <SelectItem value="5">5 jour</SelectItem>
                                <SelectItem value="6">6 jour</SelectItem>
                            <SelectItem value="7">7 jour</SelectItem>

                            </SelectContent>
                          </Select>
                        </FormControl>
                        {form.formState.errors.delai ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>
                            
                            {
                              form.getValues("delai") && form.getValues("periodicite") ?
                              (getNextReminder(true) <= startOfDay(new Date()) ?
                              <> Le rappel aurait dû être envoyé le <span className="font-medium">{formatDateDDMMYYYYJS(getNextReminder(true))}</span>.</>
                              :
                              <> Vous serez notifié  le <span className="font-medium">{formatDateDDMMYYYYJS(getNextReminder(true))}</span>.</>
                              )
                              :
                              "Jours avant la date de paiement vous souhaitez être notifié."
                            }

                            </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
    
              
            </form>
            </Form>
            {/* Navigation Footer */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={()=>{setRappelData({...RappelData, type_depense : ''}); prev()}} className="rounded-sm">
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

export default CreateRappelStep2