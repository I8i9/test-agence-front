import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";



const CreateCspStep3 = ({ setContratSpData, ContratSpData, next, prev }) => {
  const livraisonNegotiable = ContratSpData?.selected_offre?.livraison;
  const livraisonPrice = ContratSpData?.selected_offre?.prix_options_livraison;
  const optionLivraison = ContratSpData?.selectedOptions.includes('prix_options_livraison');
  console.log("livraisonNegotiable:", livraisonNegotiable);
  console.log("optionLivraison:", optionLivraison);
  const depot = ContratSpData?.selected_offre?.depot_pol;
  const formSchema = z.object({
  numero_contrat: z.string().min(1, "Le numéro de contrat est requis"),
  commentaire_contrat: z.string().optional(),
  depot_garantie: z.preprocess((v) => (v === "" ? undefined : v), z.coerce
          .number({required_error: "Le montant de la caution est requis" , invalid_type_error: "Le montant de la caution est requis" })
          .min(0, "Le montant de la caution doit être un nombre positif")
          .refine((val) => val >= 0, "Le montant de la caution ne peut pas être négatif")),
  livraison: z.preprocess(
      (v) => (v === "" || v === null ? undefined : v),
      z.union([
        z.coerce
          .number({ 
            invalid_type_error: "Le montant de la livraison doit être un nombre" 
          })
          .refine((val) => {
            // Only enforce positive numbers if delivery is not "FREE" (implied logic)
            if (livraisonNegotiable === "NEGOTIABLE" || (livraisonNegotiable === "FIXED" && optionLivraison)) {
              return val >= 0;
            }
            return true;
          }, "Le montant de la livraison doit être un nombre positif ou zéro"),
        z.undefined(),
      ])
    ).optional(),
  niveau_carburant_depart : z.enum(["Sans Niveau", "VIDE", "UN_QUART", "DEMI", "TROIS_QUART","PLEIN"]).default("Sans Niveau"),
});

  const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        numero_contrat: ContratSpData.numero_contrat || '',
        commentaire_contrat: ContratSpData.commentaire_contrat || '',
        depot_garantie: ContratSpData.depot_garantie || (depot ?? ''),
        livraison: ContratSpData.livraison || (livraisonNegotiable==="FIXED" ? livraisonPrice : ''),
        niveau_carburant_depart: ContratSpData.niveau_carburant_depart || "Sans Niveau",
      },
    });
  
  
  
    const onSubmit = (data) => {
      // Update the contract data with form values
      setContratSpData(prev => ({ 
        ...prev, 
        numero_contrat: data.numero_contrat,
        commentaire_contrat: data.commentaire_contrat,
        depot_garantie: data.depot_garantie,
        livraison: data.livraison,
        niveau_carburant_depart: data.niveau_carburant_depart === "Sans Niveau" ? null : data.niveau_carburant_depart,
      }));
      next();
    };
  
    return (
      <div className='w-full h-full flex flex-col '>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-1 space-y-4 no-scrollbar">
             <h3 className="flex items-center gap-1 font-semibold text-lg">Période de disponibilité</h3>
            <Form {...form}>
              <form id='create-csp-step-3' onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-1">
  
                <div className='flex gap-4 items-center w-full '>
                {/* Numéro de contrat */}
                <FormField
                  className="w-1/2"
                  control={form.control}
                  name="numero_contrat"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>
                        Numéro de contrat
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 1000"
                          {...field}
                          
                        />
                      </FormControl>
                      {
                        form.formState.errors?.numero_contrat ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>
                            Saisissez le numéro du contrat tel qu’indiqué sur le contrat.
                          </FormDescription>
                        )
                      }
                    </FormItem>
                  )}
                />
                
                  <FormField
                    control={form.control}
                    
                    name="niveau_carburant_depart"
                    render={({field}) => (
                      <FormItem className="w-1/2" >
                        <FormLabel>
                          Niveau de carburant au départ
                        </FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange} >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Niveau de carburant au départ" />
                            </SelectTrigger>
                              <SelectContent>
      
                                <SelectItem value={"Sans Niveau"}>Sans Niveau</SelectItem>
                                
                                <SelectItem value="VIDE">Vide</SelectItem>
                                <SelectItem value="UN_QUART">Un quart (1/4)</SelectItem>
                                <SelectItem value="DEMI">Demi (1/2)</SelectItem>
                                <SelectItem value="TROIS_QUART">Trois quart (3/4)</SelectItem>
                                <SelectItem value="PLEIN">Plein</SelectItem>
                              </SelectContent>
                            </Select>
                          
                        </FormControl>
                        <FormDescription>
                              Sélectionnez le niveau de carburant au départ
                            </FormDescription>
                      </FormItem>
                    )}
                  />
  
                </div>

                  <div className="flex gap-4 items-center w-full ">
                    <FormField
                      control={form.control}
                      name="depot_garantie"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Montant du Caution</FormLabel>
                          <div className="relative ">
                            <Input
                              type="number"
                              className="pr-13"
                              placeholder="Ex: 3000DT"
                              {...field}
                              
    
                            />
                            <span
                              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none`}
                            >
                              DT{" "}
                            </span>
                          </div>
                          {form.formState.errors?.depot_garantie ? (
                            <FormMessage />
                          ) : (
                            <FormDescription>Saisissez le montant de la caution effectivement versée </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
    
                      <FormField
                      control={form.control}
                      name="livraison"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Prix de livraison</FormLabel>
                          <div className="relative">
                            <Input
                              disabled={!livraisonNegotiable || livraisonNegotiable === "FREE" || livraisonPrice == null || !optionLivraison}
                              type="number"
                              step="1"
                              className="pr-13"
                              placeholder="Ex: 100DT"
                              {...field}
                            />
                            <span
                              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none`}
                            >
                              DT{" "}
                            </span>
                          </div>
                          {form.formState.errors?.livraison ? (
                            <FormMessage />
                          ) : (
                            <FormDescription>{
                              ( livraisonNegotiable && !optionLivraison) ? "Le client n'a pas choisi la livraison comme option" :
                              livraisonNegotiable === "NEGOTIABLE" ? "Saisissez le montant de la livraison négociée avec le client"
                              : livraisonNegotiable === "FIXED" ? "Vous pouvez changer le montant fixe de la livraison"
                              : livraisonNegotiable === "FREE" ? "La livraison est gratuite pour ce offre":
                              "La livraison n'est pas proposée pour cette offre"
                              
                              
                              }</FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
  
                {/* Commentaire du contrat */}
                <FormField
                  control={form.control}
                  name="commentaire_contrat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >
                        Observations (Optionnel)
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[140px]"
                          placeholder="Ex : Le client reconnaît avoir vérifié l’état du véhicule."
                          {...field}
                        />
                      </FormControl>
                      {
                        form.formState.errors?.commentaire_contrat ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>
                            Ajoutez toute remarque utile concernant ce contrat
                          </FormDescription>
                        )
                      }
                    </FormItem>
                  )}
                />
  
                
              </form>
            </Form>
            
          </div>
          {/* Navigation Footer */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t">

            <Button 
                      variant="outline" 
                      onClick={prev}
                    >
                      <ChevronRight className=' rotate-180' />
                      Retour
                    </Button>
            
            <Button 
              form="create-csp-step-3"
              type="submit"
              className="flex items-center "
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
    );
  };

export default CreateCspStep3;