import { useState, useEffect } from 'react';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'; 

const CreateStep4 = ({ setOffreData, offreData, next, prev }) => {
    const [limitedKilometrage, setLimitedKilometrage] = useState(offreData.kilometrage_limite !== undefined ? offreData.kilometrage_limite : false);
    const [penaltyType, setPenaltyType] = useState(offreData.type_penalite || "FREE");
    
    const PoliciesFormSchema = z.object({ 
        kilometrage: z
            .string()
            .optional()
            .refine((val) => {
                if (limitedKilometrage) {
                    if (!val || val.trim() === '') return false;
                }
                return true;
            }, "La limite de kilométrage est requise.")
            .refine((val) => {
                if (limitedKilometrage ) {
                   if (!val || val.trim() === '') return false; 
                    const num = parseFloat(val);
                    return !isNaN(num) && num > 0;
                }

                return true;
            }, "La limite de kilométrage doit être supérieur à zéro."),
        permis: z
            .string({ required_error: "L'ancienneté minimale du permis est requise." })
            .refine((val) => {
                if (val === undefined || val === null || val.trim() === '') return false;
                return true;
            } , "L'ancienneté minimale du permis est requise.")
            .refine((val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num >= 0;
            }, "Entrez 0 si vous n'exigez pas une ancienneté minimale du permis."),
        montant_penalite: z
            .string()
            .refine((val) => {
                if (limitedKilometrage && penaltyType !== "FREE") {
                    if (!val || val.trim() === '') return false;
                }
                return true;
            }, "Le montant de la pénalité est requis.")
            .refine((val) => {
                if (limitedKilometrage && penaltyType !== "FREE") {
                    if (!val || val.trim() === '') return false;
                    const num = parseFloat(val);
                    return !isNaN(num) && num >= 0;
                }
                return true;
            }, "Le montant de la pénalité doit être supérieur ou égal à zéro."),
        age: z
            .string({ required_error: "L'âge minimum est requis." })
            .refine((val) => {
                if (val === undefined || val === null || val.trim() === '' ) return false;
                return true;
            } , "L'âge minimum est requis.")
            .refine((val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num >= 18;
            }, "Entrez 18 si vous n'exigez pas une ancienneté minimale du permis."),
        carburant: z
            .string({ required_error: "La politique de carburant est requise." })
            .min(1, "La politique de carburant est requise."), 

    });

    const policiesForm = useForm({
        resolver: zodResolver(PoliciesFormSchema),
        defaultValues: { 
            kilometrage: offreData?.kilometrage_pol || "",
            permis: offreData?.anciennite_permis_pol || "0",
            age: offreData?.age || "18",
            montant_penalite: offreData?.montant_penalite || "",
            carburant: offreData?.carburant_pol || "MEME_NIVEAU", 
        },
    });


    
    useEffect(() => {

        if (!limitedKilometrage) {
            policiesForm.setValue('kilometrage', '');
        }  
    }, [limitedKilometrage]); 

    useEffect(() => {
        if (penaltyType === "FREE") {
            policiesForm.setValue('montant_penalite', '');
        }
    }, [penaltyType]);

    const handleNext = (data) => {
        // Update the main offre data state
        setOffreData({
            ...offreData, 
            kilometrage_limite: limitedKilometrage,
            kilometrage_pol: limitedKilometrage ? data.kilometrage : null,
            montant_penalite: (limitedKilometrage && penaltyType !== "AUCUNE") ? data.montant_penalite : null,
            type_penalite: limitedKilometrage ? (penaltyType === "AUCUNE" ? null : penaltyType) : null,
            anciennite_permis_pol: data?.permis,
            age: data?.age,
            carburant_pol: data?.carburant, 
        });
        next();
    };

    console.log("Policies Form Data:", policiesForm.watch("type_penalite"));

    return (
        <div className='flex flex-col h-full'>
            {/* Content Area */}
            <div className='flex-1'>
                <h3 className="flex items-center gap-1 font-semibold text-lg mb-5">
                    <Shield size={20}/>Politiques et conditions
                </h3>
                    <Form {...policiesForm}>
                        <form id='policies-form-offre' onSubmit={policiesForm.handleSubmit(handleNext)}  className='grid grid-cols-2 gap-x-8 gap-y-4'>
                            {/* Kilometrage Limit */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium">Kilométrage par jour</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 leading-tight">{limitedKilometrage ? "Limité" : "Illimité"}</span>
                                        <Switch 
                                            checked={limitedKilometrage}
                                            onCheckedChange={setLimitedKilometrage}
                                        />
                                    </div>
                                </div>
                                <FormField
                                    control={policiesForm.control}
                                    name="kilometrage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                            <div className='relative'>   
                                                <Input
                                                    type="number"
                                                    placeholder="Ex: 500 Km"
                                                    {...field}
                                                    disabled={!limitedKilometrage}
                                                      className={"pr-10"}
                                                /> 
                                                <span className={`absolute ${!limitedKilometrage ? 'opacity-50' : ''} text-gray-500 text-sm right-2 top-1/2 transform -translate-y-1/2`}>Km</span>
                                            </div>
                                            </FormControl>
                                            {
                                                policiesForm.formState.errors?.kilometrage ? (
                                                    <FormMessage>
                                                        {policiesForm.getFieldState("kilometrage").error?.message}
                                                    </FormMessage>
                                                ) : (
                                                    <FormDescription>
                                                        Indiquez le limite de kilométrage par jour si limité.
                                                    </FormDescription>
                                                )
                                            }
                                        </FormItem>
                                    )}
                                />
                            </div>

                             <div>
                                <div className="flex items-center justify-between mb-2 relative">
                                    <label className={`text-sm font-medium `}>Pénalité sur kilométrage</label>
                                    <div className="flex items-center gap-2 ">
                                        <span className="text-sm text-gray-600  absolute -top-0.25 right-0  flex   leading-tight">
                                        {
                                            ["FREE", "FIXED", "PER_KM"].map((type) => (
                                                <span onClick={() => limitedKilometrage && setPenaltyType(type)} key={type} className={`text-sm px-3.5 py-0.5 rounded-sm leading-tight text-nowrap transition-colors duration-300 ${ limitedKilometrage ? 'cursor-pointer' : 'cursor-not-allowed'} ${penaltyType === type ? 'bg-rod-primary text-white' : limitedKilometrage ? ' hover:bg-rod-foreground' : ''}`}>
                                                    {type === "FREE" ? "Aucune" : type === "FIXED" ? "Fixe" : "Par Km"}
                                                </span>
                                            ))
                                        }
                                        </span>
                                    </div>
                                </div>
                                <FormField
                                    control={policiesForm.control}
                                    name="montant_penalite"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                            <div className='relative'>   
                                                <Input
                                                    disabled={!limitedKilometrage || penaltyType === 'FREE' }
                                                    type="number"
                                                    placeholder="Ex: 50 DT"
                                                    valueAsNumber
                                                    {...field}
                                                      className={`${penaltyType === 'FREE' ? '' : penaltyType === 'FIXED' ? 'pr-10' : 'pr-16'}`}
                                                /> 
                                                <span className={`absolute  text-gray-500 text-sm right-2 top-1/2 transform -translate-y-1/2`}>
                                                {penaltyType === 'FIXED' ? 'DT' : penaltyType === 'PER_KM' ? 'DT / Km' : ''}
                                                </span>
                                            </div>
                                            </FormControl>
                                            {
                                                policiesForm.formState.errors?.montant_penalite ? (
                                                    <FormMessage>
                                                        {policiesForm.getFieldState("montant_penalite").error?.message}
                                                    </FormMessage>
                                                ) : (
                                                    <FormDescription>
                                                        Indiquez la pénalité appliquée en cas de dépassement.
                                                    </FormDescription>
                                                )
                                            }
                                        </FormItem>
                                    )}
                                />
                            </div>


                            {/* License Years */}
                            <FormField
                                control={policiesForm.control}
                                name="permis"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ancienneté du permis</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 2 ans"
                                                {...field}
                                            />
                                        </FormControl>
                                        {
                                            policiesForm.formState.errors?.permis ? (
                                                <FormMessage>
                                                    {policiesForm.getFieldState("permis").error?.message}
                                                </FormMessage>
                                            ) : (
                                                <FormDescription>
                                                    Indiquez l'expérience minimale requise pour conduire en ans
                                                </FormDescription>
                                            )
                                        }
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={policiesForm.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Âge minimum du conducteur </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Ex: 21 ans"
                                                {...field}
                                            />
                                        </FormControl>
                                        {
                                            policiesForm.formState.errors?.age ? (
                                                <FormMessage>
                                                    {policiesForm.getFieldState("age").error?.message}
                                                </FormMessage>
                                            ) : (
                                                <FormDescription>
                                                    Indiquez l'âge minimum requis pour louer la voiture
                                                </FormDescription>
                                            )
                                        }
                                    </FormItem>
                                )}
                            />

                            {/* Fuel Policy */}
                            <FormField
                                control={policiesForm.control}
                                name="carburant"
                                render={({ field }) => (
                                    <FormItem className='col-span-2'>
                                        <FormLabel>Carburant</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="MEME_NIVEAU" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MEME_NIVEAU">Même Niveau</SelectItem>
                                                <SelectItem value="PLEIN_INCLUS">Plein Inclus</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {
                                            policiesForm.formState.errors?.carburant ? (
                                                <FormMessage>
                                                    {policiesForm.getFieldState("carburant").error?.message}
                                                </FormMessage>
                                            ) : ( 
                                                <p className="text-sm text-gray-500">
                                                    Indiquez la politique de carburant
                                                </p>
                                            )
                                        }
                                    </FormItem>
                                )}
                            />  

                        </form>
                    </Form> 
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between pt-4 mt-2 border-t">
                <Button variant="outline" onClick={prev} className="rounded-sm">
                    <ChevronLeft className="h-4 w-4 " />
                    Retour
                </Button>

                <Button type="submit" form="policies-form-offre" className="rounded-sm">
                    Suivant
                    <ChevronRight className="h-4 w-4 " />
                </Button>
            </div>
        </div>
    )
}

export default CreateStep4