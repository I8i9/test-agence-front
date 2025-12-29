import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Search, Loader2, UserCheck, Check, AlertCircle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TunisianStates } from '../../../../utils/states';
import { useSearchGuestByCin } from '../../../../api/queries/contrat/useSearchGuestByCin';

const COUNTRIES = [
  "Tunisie",
  "Algérie",
  "Maroc",
  "France",
  "Allemagne",
  "Italie",
  "Espagne",
  "Royaume-Uni",
  "Canada",
  "États-Unis",
  "Autre",
];

// Form schema for new guest
const newGuestSchema = z.object({
  nom_prenom: z.string().min(1, "Le nom est requis"),
  telephone: z.string().min(8, "Le numéro de téléphone est requis"),
  pays: z.string().min(1, "Le pays est requis"),
  region: z.string().optional(),
  type: z.enum(["INDIVIDUAL", "COMPANY"], {
    required_error: "Le type est requis",
  }),
  matricule_fiscale: z.string().optional(),
}).refine((data) => {
  // If country is Tunisia, region is required
  if (data.pays === "Tunisie" && (!data.region || data.region.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "L'état est requis pour la Tunisie",
  path: ["region"],
}).refine((data) => {
  // If type is COMPANY, matricule_fiscale is required
  if (data.type === "COMPANY" && (!data.matricule_fiscale || data.matricule_fiscale.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Le matricule fiscale est requis pour les entreprises",
  path: ["matricule_fiscale"],
});

const CreateCspStep2 = ({ setContratSpData, ContratSpData, next, prev }) => {
  const [cinNumber, setCinNumber] = useState(ContratSpData.guest_cin || '');
  const [cinError, setCinError] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(
    ContratSpData.existing_guest_id ? {
      id_guest: ContratSpData.existing_guest_id,
      nom: ContratSpData.guest_info?.nom_prenom
    } : null
  );

  // Use the API hook with React Query states
  const { data: searchData, refetch, isFetching, isSuccess, isError } = useSearchGuestByCin(cinNumber);

  const form = useForm({
    resolver: zodResolver(newGuestSchema),
    defaultValues: {
      nom_prenom: ContratSpData.guest_info?.nom_prenom || '',
      pays: ContratSpData.guest_info?.pays || '',
      region: ContratSpData.guest_info?.region || '',
      type: ContratSpData.guest_info?.type || 'INDIVIDUAL',
      matricule_fiscale: ContratSpData.guest_info?.matricule_fiscale || '',
      telephone: ContratSpData.guest_phone || '',
    },
  });

  const watchedPays = form.watch("pays");
  const watchedType = form.watch("type");
  const isStateDisabled = watchedPays !== 'Tunisie';

  // Reset region when country changes away from Tunisia
  useEffect(() => {
    if (isStateDisabled) {
      form.setValue('region', '');
    }
  }, [isStateDisabled, form]);

  // Reset matricule_fiscale when type changes away from COMPANY
  useEffect(() => {
    if (watchedType !== 'COMPANY') {
      form.setValue('matricule_fiscale', '');
    }
  }, [watchedType, form]);

  const handleSearch = () => {
    const cinRegex = /^\d{8}$/;

    if (!cinRegex.test(cinNumber)) {
      setCinError("Format invalide. Le CIN doit contenir 8 chiffres.");
      return;
    }
    setCinError('');
    refetch();
  };


  const handleSelectGuest = (guest) => {
    // Toggle selection: if already selected, unselect; otherwise select
    setSelectedGuest(prev => 
      prev?.id_guest === guest.id_guest ? null : guest
    );
  };

  // Use React Query states directly
  const searchResult = searchData?.guest || null;
  const guestFound = isSuccess && searchData?.found && searchResult;
  const guestNotFound = isSuccess && !searchData?.found;

  const onSubmit = (data) => {
    // Save new guest data
    setContratSpData(prev => ({
      ...prev,
      guest_info: {
        nom_prenom: data.nom_prenom,
        telephone: data.telephone,
        cin: cinNumber,
        pays: data.pays,
        region: data.pays === 'Tunisie' ? data.region : '',
        type: data.type,
        matricule_fiscale: data.type === 'COMPANY' ? data.matricule_fiscale : '',
      },
      guest_cin: cinNumber,
      existing_guest_id: null,
    }));
    next();
  };

  const handleExistingGuestNext = () => {
    if (selectedGuest) {
      setContratSpData(prev => ({
        ...prev,
        existing_guest_id: selectedGuest.id_guest,
        guest_cin: cinNumber,
        guest_info: null,
      }));
      next();
    }
  };

  return (
    <div className='flex flex-col h-full'>
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-3 p-1">
        {/* Phone Search Section */}
        <div className="mb-4">
          <h3 className="flex items-center gap-2 text-lg mb-2 font-semibold">
            Recherche par CIN 
          </h3>


          {/* Search Input Row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                value={cinNumber}
                onChange={(e) => {
                  setCinNumber(e.target.value);
                  setCinError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                placeholder="Ex: 01234567"
                maxLength={8}
                className={cinError ? 'border-red-500' : ''}
              />
              {cinError && (
                <p className="text-sm text-red-500 mt-1">{cinError}</p>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={!cinNumber.trim() || isFetching}
              type="button"
            >
              {isFetching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Rechercher
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isFetching && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-600">Erreur lors de la recherche</p>
              <p className="text-sm text-red-600 mt-1">
                Une erreur est survenue lors de la recherche du client. Veuillez réessayer.
              </p>
            </div>
          </div>
        )}

        {/* Guest Found - Clickable Card */}
        {guestFound && (
          <div className="pb-4">
            <button
              onClick={() => handleSelectGuest(searchResult)}
              type="button"
              className={`
                w-full p-4 bg-white rounded-lg border cursor-pointer
                transition-all duration-200 relative
                ${selectedGuest?.id_guest === searchResult?.id_guest
                  ? 'ring-1 ring-rod-primary border-rod-primary'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>

                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-base text-gray-900">{searchResult.nom}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">{searchResult.telephone}</p>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                      {searchResult.total_reservations} réservation{searchResult.total_reservations > 1 ? 's' : ''} précédente{searchResult.total_reservations > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {selectedGuest?.id_guest === searchResult.id_guest && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rod-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            </button>
          </div>
        )}

        {/* Guest Not Found - New Guest Form */}
        {guestNotFound && (
          <div >
            {/* Alert Banner */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-600 my-auto mt-1">Aucun client trouvé. Créez un nouveau client pour l’agence ci-dessous.</p>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Grid Layout for form fields */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-6">
                  {/* Nom Complet */}
                  <FormField
                    control={form.control}
                    name="nom_prenom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom Complet</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Ahmed Ben Ali"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors?.nom_prenom ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>
                            Indiquez le nom et prénom complets
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: +216 95300323" {...field} />
                          </FormControl>
                          {form.formState.errors?.telephone ? (
                            <FormMessage />
                          ) : (
                            <FormDescription>
                              Indiquez le numéro de téléphone du client
                            </FormDescription>
                          )}
                      </FormItem>
                    )}
                  />

                  {/* Type de Client */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de Client</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionnez le type de client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INDIVIDUAL">Particulier</SelectItem>
                            <SelectItem value="COMPANY">Entreprise</SelectItem>
                          </SelectContent>
                        </Select>
                        {form.formState.errors?.type ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>
                            Sélectionnez le type du client
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Pays */}
                  <FormField
                    control={form.control}
                    name="pays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays de Résidence</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un pays" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors?.pays ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>
                            Votre pays de résidence principale
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* État */}
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={isStateDisabled ? 'text-muted-foreground' : ''}>
                          État
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isStateDisabled}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionnez l'état de résidence du client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TunisianStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {form.formState.errors?.region ? (
                          <FormMessage />
                        ) : (
                          <FormDescription>
                            Sélectionnez votre région de résidence.
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Matricule Fiscale - Only for COMPANY */}
                    <FormField
                      control={form.control}
                      name="matricule_fiscale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matricule Fiscale</FormLabel>
                          <FormControl>
                            <Input disabled={watchedType !== "COMPANY"} placeholder="Ex: 1234567/A/M/000" {...field} />
                          </FormControl>
                          {form.formState.errors?.matricule_fiscale ? (
                            <FormMessage />
                          ) : (
                            <FormDescription>
                              Le matricule fiscale de l'entreprise
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
                  
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4 border-t">
        <Button 
          type="button"
          variant="outline"
          onClick={prev}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>

        <Button 
          type="button"
          onClick={selectedGuest ? handleExistingGuestNext : form.handleSubmit(onSubmit)}
          disabled={!selectedGuest && !guestNotFound}
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CreateCspStep2;