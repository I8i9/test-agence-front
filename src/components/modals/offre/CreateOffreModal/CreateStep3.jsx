import React, { useState, useEffect } from 'react';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';

const CreateStep3 = ({ setOffreData, offreData, next, prev }) => {
    const [hasModificationFee, setHasModificationFee] = useState(offreData.has_modification_fee !== undefined ? offreData.has_modification_fee : false);
    const [hasCancellationFee, setHasCancellationFee] = useState(offreData.has_cancellation_fee !== undefined ? offreData.has_cancellation_fee : false);
    const [isDynamicPricing, setIsDynamicPricing] = useState(offreData.avec_prix_dynamique || false);
    const [durationOptions, setDurationOptions] = useState(offreData.prix_dynamique_offre || [{ days: '', price: '' }]); 
    const [error, setError] = useState(null);

    const PricingFormSchema = z.object({
        prix_jour: z
            .string({ required_error: "Le prix par jour est requis." })
            .min(1, "Le prix par jour est requis.")
            .refine((val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num > 0;
            }, "Le prix par jour doit être supérieur à zéro."),
        depot: z
            .string({ required_error: "La caution est requise." })
            .min(1, "La caution est requise.")
            .refine((val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num > 0;
            }, "La caution doit être supérieure à zéro."),
        modification: z
            .string()
            .optional()
            .refine((val) => {
                if (hasModificationFee) {
                    if (!val || val.trim() === '') return false;
                }
                return true;
            }, "Les frais de modification sont requis.")
            .refine((val) => {
                if ( hasModificationFee ) {
                    if (val && val.trim() === '') return false; 
                    const num = parseFloat(val);
                    return !isNaN(num) && num > 0;
                }
                return true;
            }, "Les frais de modification doivent être supérieurs à zéro."),


        annulation: z
            .string()
            .optional()
            .refine((val) => {
                if (hasCancellationFee) {
                    if (!val || val.trim() === '') return false;
                }
                return true;
            }, "Les frais d'annulation sont requis.")
            .refine((val) => {
                if (hasCancellationFee) {
                    if (!val || val.trim() === '') return false;
                    const num = parseFloat(val);
                    return !isNaN(num) && num > 0;
                }
                return true;
            }, "Les frais d'annulation doivent être supérieurs à zéro."),
        avec_prix_dynamique: z.boolean(),
    });

    const pricingForm = useForm({
        resolver: zodResolver(PricingFormSchema),
        defaultValues: {
            modification: offreData.modification_pol || "",
            annulation: offreData.annulation_pol || "",
            prix_jour: offreData.prix_jour_offre || "",
            depot: offreData.depot_pol || "",
            avec_prix_dynamique: offreData.avec_prix_dynamique || false,
        },
    });

    // Initialize component state from offreData only once
    useEffect(() => {
        // Set form values
        pricingForm.setValue("prix_jour", offreData.prix_jour_offre || "");
        pricingForm.setValue("depot", offreData.depot_pol || "");
        pricingForm.setValue("modification", offreData.modification_pol || "");
        pricingForm.setValue("annulation", offreData.annulation_pol || "");
        pricingForm.setValue("avec_prix_dynamique", offreData.avec_prix_dynamique || false);
        
        // Set local state
        setIsDynamicPricing(offreData.avec_prix_dynamique || false);
        
        if (offreData.prix_dynamique_offre && offreData.prix_dynamique_offre.length > 0) {
            setDurationOptions(offreData.prix_dynamique_offre);
        }
    }, [offreData])

        // Reset form values when toggles change 
        useEffect(() => {
            // Reset values when switches are deactivated 
            if (!hasCancellationFee) {
                pricingForm.setValue('annulation', '');
            }
            if (!hasModificationFee) {
                pricingForm.setValue('modification', ''); 
            } 
        }, [ hasCancellationFee, hasModificationFee ]); 

    const handleDynamicPricingToggle = (checked) => {
        setIsDynamicPricing(checked);
        pricingForm.setValue("avec_prix_dynamique", checked);
        
        if (!checked) {
            setDurationOptions([{ days: '', price: '' }]);
        } else {
            // When enabling dynamic pricing, ensure there's at least one option
            if (durationOptions.length === 0 || (durationOptions.length === 1 && !durationOptions[0].days && !durationOptions[0].price)) {
                setDurationOptions([{ days: '', price: '' }]);
            }
        }
        
        pricingForm.clearErrors("avec_prix_dynamique");

    };

    const addDurationOption = () => {
        setDurationOptions(prev => [...prev, { days: '', price: '' }]);
    };

    const removeDurationOption = (index) => {
        if (durationOptions.length > 1) {
            setDurationOptions(prev => prev.filter((_, i) => i !== index));
        }
    };

    const updateDurationOption = (index, field, value) => {
        setDurationOptions(prev => 
            prev.map((option, i) => 
                i === index ? { ...option, [field]: value } : option
            )
        );
    };
   
    const handleNext = () => {
    // Trigger form validation
    pricingForm.handleSubmit(() => {
        // Validate dynamic pricing if enabled
        if (isDynamicPricing) {
            // Check if all duration options are valid
            for (let i = 0; i < durationOptions.length; i++) {
                const option = durationOptions[i];
                
                // Check if both fields are filled
                if (!option.days || !option.price) {
                    setError(`Veuillez remplir tous les champs ( jours et prix ).`);
                    return;
                }
                
                // Check if values are valid numbers greater than 0
                const daysNum = parseInt(option.days);
                const priceNum = parseFloat(option.price);
                
                if (isNaN(daysNum) || daysNum <= 0) {
                    setError(`Le nombre de jours doit être positif pour l'option ${i + 1}.`);
                    return;
                }
                
                if (isNaN(priceNum) || priceNum <= 0) {
                    setError(`Le prix doit être positif pour l'option ${i + 1}.`);
                    return;
                }

                // if days exceed max_jour_demande_offre
                if (offreData?.max_jour_demande_offre && daysNum > offreData.max_jour_demande_offre) {
                    setError(`Le nombre de jours pour l'option ${i + 1} ne peut pas dépasser la durée maximale de réservation (${offreData.max_jour_demande_offre} jours).`);
                    return;
                }

            }
            
            // Optional: Check for duplicate duration values
            const daysValues = durationOptions.map(option => parseInt(option.days));
            const uniqueDays = [...new Set(daysValues)];
            if (daysValues.length !== uniqueDays.length) {
                setError("Veuillez éviter les durées en double.");
                return;
            }
        }
        setOffreData({
                ...offreData,
                prix_jour_offre: pricingForm.getValues("prix_jour"),
                depot_pol: pricingForm.getValues("depot"),
                avec_prix_dynamique: isDynamicPricing,
                prix_dynamique_offre: isDynamicPricing ? durationOptions : [],
                modification_pol: pricingForm.getValues("modification"),
                annulation_pol: pricingForm.getValues("annulation"),
                has_modification_fee: hasModificationFee,
                has_cancellation_fee: hasCancellationFee
            });
        // If validation passes, proceed to next step
        next();
    })();
};

    return (
        <div className='flex flex-col h-full'>
            {/* Content Area */}
            <div className='flex-1 overflow-y-auto no-scrollbar'>
                <div className='flex flex-col gap-2 px-0.75'>
                    {/* Basic Pricing Section */}
                    <div className="shadow-none pb-4 border-b space-y-4 rounded-xs">
                        <div >
                            <h3 className="flex items-center gap-2 font-semibold text-lg">
                                Tarifs et limites
                            </h3>
                        </div>
                        <div >
                            <Form {...pricingForm}> 
                                <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
                                    <FormField
                                        control={pricingForm.control}
                                        name="prix_jour"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prix par jour</FormLabel>
                                                <FormControl> 
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            placeholder="Ex: 100 DT"
                                                            {...field}
                                                            className="pr-10"
                                                        /> 
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">DT</span>
                                                    </div>
                                                </FormControl>
                                                {
                                                    pricingForm.formState.errors?.prix_jour ? (
                                                        <FormMessage>
                                                            {pricingForm.getFieldState("prix_jour").error?.message}
                                                        </FormMessage>
                                                    ) : (
                                                        <FormDescription>
                                                            Indiquez le tarif journalier de votre offre.
                                                        </FormDescription>
                                                    )
                                                }
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={pricingForm.control}
                                        name="depot"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Caution</FormLabel>
                                                <FormControl> 
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            placeholder="Ex: 3000 DT"
                                                            {...field}
                                                            className="pr-10"
                                                        /> 
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">DT</span>
                                                    </div>
                                                </FormControl>
                                                {
                                                    pricingForm.formState.errors?.depot ? (
                                                        <FormMessage>
                                                            {pricingForm.getFieldState("depot").error?.message}
                                                        </FormMessage>
                                                    ) : (
                                                        <FormDescription>
                                                            Indiquez le montant demandé en garantie
                                                        </FormDescription>
                                                    )
                                                }
                                            </FormItem>
                                        )}
                                    />
                                    {/* Modification Fee */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium">Frais de modification</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">{hasModificationFee ? "Frais applicables" : "Sans frais"}</span>
                                                <Switch 
                                                    checked={hasModificationFee}
                                                    onCheckedChange={setHasModificationFee}
                                                />
                                            </div>
                                        </div>
                                    <FormField
                                        control={pricingForm.control} 
                                        name="modification"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl> 
                                                    <div className='relative'>
                                                    <Input
                                                        type="number"
                                                        placeholder="Ex: 50 DT"
                                                        {...field}
                                                        className={"pr-10"}
                                                        disabled={!hasModificationFee}
                                                    /> 
                                                    <span className={`absolute ${!hasModificationFee ? 'opacity-50' : ''} text-gray-500 text-sm right-2 top-1/2 transform -translate-y-1/2`}>DT</span>
                                                    </div>
                                                </FormControl>
                                                {
                                                    pricingForm.formState.errors?.modification ? (
                                                        <FormMessage>
                                                            {pricingForm.getFieldState("modification").error?.message}
                                                        </FormMessage>
                                                    ) : (
                                                        <FormDescription>
                                                            Indiquez le coût pour modifier une réservation.
                                                        </FormDescription>
                                                    )
                                                }
                                            </FormItem>
                                        )}
                                    />
                                    </div>
                                    {/* Cancellation Fee */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium">Frais d'annulation</label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-600">{hasCancellationFee ? "Frais applicables" : "Sans frais"}</span>
                                                <Switch 
                                                    checked={hasCancellationFee}
                                                    onCheckedChange={setHasCancellationFee}
                                                />
                                            </div>
                                        </div>
                                    <FormField
                                        control={pricingForm.control}
                                        name="annulation"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl> 
                                                <div className='relative'>
                                                    <Input
                                                        type="number"
                                                        placeholder="Ex: 60 DT"
                                                        {...field} 
                                                        disabled={!hasCancellationFee}
                                                        className={"pr-10"}
                                                    /> 
                                                    <span className={`absolute ${!hasCancellationFee ? 'opacity-50' : ''} text-gray-500 text-sm right-2 top-1/2 transform -translate-y-1/2`}>DT</span>
                                                    </div>
                                                </FormControl>
                                                {
                                                    pricingForm.formState.errors?.annulation ? (
                                                        <FormMessage>
                                                            {pricingForm.getFieldState("annulation").error?.message}
                                                        </FormMessage>
                                                    ) : (
                                                        <FormDescription>
                                                            Indiquez le coût pour annuler une réservation
                                                        </FormDescription>
                                                    )
                                                }
                                            </FormItem>
                                        )}
                                    />
                                    </div>
                                </div> 
                            </Form>
                        </div>
                    </div>

                    {/* Dynamic Pricing Section */}
                    <div className="shadow-none mt-2.5 space-y-4 border-0 rounded-xs">
                        <div >
                            <div className="flex items-center  justify-between font-semibold text-lg">
                                <span className="flex items-center gap-2 font-semibold text-lg">Tarification par durée</span>
                                <Switch 
                                    checked={isDynamicPricing}
                                    onCheckedChange={handleDynamicPricingToggle}
                                />
                            </div>
                        </div>
                        <div >
                            {isDynamicPricing && (
                                <div className='space-y-2 pb-4'>
                                    {
                                        error ?
                                        <div className="text-red-500 text-sm mb-4 -mt-2 ">{error}</div>
                                        :
                                        <p className="text-sm mb-4 -mt-2 text-gray-500 ">
                                            Prix dynamique selon la durée. &nbsp;
                                            {
                                                offreData?.max_jour_demande_offre &&
                                                <>Notez bien que la durée maximale de réservation pour cette offre  est de <span className='font-medium'>{offreData.max_jour_demande_offre} jours.</span></>
                                            }
                                        </p>
                                    }
                                    
                                    
                                        {durationOptions.map((option, index) => (
                                        <div  className="flex flex-col bg-rod-foreground rounded-sm border p-2 gap-2">
                                            <div className='flex items-center gap-2'> 
                                                <Input
                                                    type="number"
                                                    placeholder="Nombre de jours"
                                                    value={option.days}
                                                    onChange={(e) => updateDurationOption(index, 'days', e.target.value)}
                                                    className="bg-white"
                                                /> 
                                                <div className='relative w-full'>
                                                <Input
                                                    type="number"
                                                    placeholder="Prix par jour"
                                                    value={option.price}
                                                    onChange={(e) => updateDurationOption(index, 'price', e.target.value)}
                                                    className="bg-white pr-10"
                                                /> 
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">DT</span>
                                                </div> 
                                                {(durationOptions.length > 1 )&& (
                                                    <button 
                                                        onClick={() => removeDurationOption(index)}
                                                        className="hover:text-red-500 cursor-pointer transition-all duration-300 rounded-md"
                                                        type="button"
                                                    >
                                                        <X className="h-5 w-5" /> 
                                                    </button>
                                                )}
                                            </div>
                                            </div>
                                        ))}
                                    
                                    <Button 
                                        type="button"
                                        onClick={addDurationOption}
                                        variant="ghost" 
                                        className='w-full mt-2'
                                    >
                                        <Plus className="h-4 w-4" />
                                        Ajouter une option de durée
                                    </Button>
                                </div>
                            )}
                            
                            {!isDynamicPricing && (
                                <p className="text-sm -mt-2 text-gray-500">
                                    Activez la tarification par durée pour offrir des prix différents selon la durée de location.
                                    
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={prev} className="rounded-sm">
                    <ChevronLeft className="h-4 w-4" />
                    Retour
                </Button>
                
                <Button onClick={handleNext} className="rounded-sm">
                    Suivant
                    <ChevronRight className="h-4 w-4 " />
                </Button>
            </div>
        </div>
    );
};

export default CreateStep3;