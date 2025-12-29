import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2 } from 'lucide-react'
import FileInput from '../../customUi/fileInput'
import useUpdateFournisseur from '../../../api/queries/fournisseurs/useUpdateFournisseur'
import { useUploadFournisseurLogo } from '../../../api/queries/images/useUploadFournisseurLogo'
import { toast } from 'sonner'
import { SuccessModal, ErrorModal } from '../StatusModals'
import { fournisseurTypes } from '../../../utils/fournisseur'

const UpdateFournisseurModal = ({ open, onClose, id, fournisseur }) => {
  const { mutateAsync: updateFournisseur, isPending: isUpdating } = useUpdateFournisseur()
  const { mutateAsync: uploadLogo, isPending: isUploadingLogo } = useUploadFournisseurLogo()

  const formSchema = z.object({
    logo_fournisseur: z
      .instanceof(File, { message: 'Veuillez sélectionner une image' })
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        { message: 'Le fichier doit être une image (JPEG, PNG ou WebP)' }
      )
      .optional(),
    nom_fournisseur: z
      .string()
      .min(2, { message: 'Le nom doit contenir au moins 2 caractères' })
      .max(100, { message: 'Le nom ne doit pas dépasser 100 caractères' }),
    email_fournisseur: z
      .string()
      .min(1, { message: 'L\'email est requis' })
      .email({ message: 'Veuillez entrer un email valide' }),
    telephone_fournisseur: z
      .string()
      .regex(/^[+]?[0-9\s()-]{8,20}$/, {
        message: 'Veuillez entrer un numéro de téléphone valide',
      })
      .optional()
      .or(z.literal('')),
    address_fournisseur: z
      .string()
      .max(255, { message: "L'adresse ne doit pas dépasser 255 caractères" })
      .optional()
      .or(z.literal('')),
    type_fournisseur: z.enum([
      'LEASING',
      'ASSURANCE',
      'GARAGE',
      'PIECES_AUTO',
      'LAVAGE',
      'REMORQUAGE',
      'CONTROLE_TECHNIQUE',
      'GPS_TRACKING',
      'CAR_IMPORT',
      'FUEL',
      'BANQUE',
      'SOFTWARE',
      'MARKETING',
      'FOURNITURES_BUREAU',
      'SECURITE',
      'OTHER',
    ], { message: 'Veuillez sélectionner un type' }),
    contact_name_fournisseur: z
      .string()
      .max(100, { message: 'Le nom du contact ne doit pas dépasser 100 caractères' })
      .optional()
      .or(z.literal('')),
    matricule_fiscale: z
      .string()
      .max(30, { message: 'Le matricule fiscal ne doit pas dépasser 30 caractères' })
      .optional()
      .or(z.literal('')), 
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logo_fournisseur: undefined,
      nom_fournisseur: fournisseur?.nom_fournisseur || '',
      email_fournisseur: fournisseur?.email_fournisseur || '',
      telephone_fournisseur: fournisseur?.telephone_fournisseur || '',
      address_fournisseur: fournisseur?.address_fournisseur || '',
      type_fournisseur: fournisseur?.type_fournisseur || '',
      contact_name_fournisseur: fournisseur?.contact_name_fournisseur || '',
      matricule_fiscale: fournisseur?.matricule_fiscale || '', 
    },
  })

  const { control } = form
  const logoFile = useWatch({ name: 'logo_fournisseur', control })
  const [previewUrl, setPreviewUrl] = useState(fournisseur?.logo_fournisseur || null)
  const nomFournisseur = useWatch({ name: 'nom_fournisseur', control })


  useEffect(() => {
    if (logoFile instanceof File) {
      const url = URL.createObjectURL(logoFile)
      setPreviewUrl(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }else {
      setPreviewUrl(fournisseur?.logo_fournisseur || null)
    }
  }, [logoFile, fournisseur])

  
  const handleSubmit = async (data) => {
    try {
      const { logo_fournisseur, ...fournisseurData } = data

      // Step 1: Update the fournisseur
      await updateFournisseur({ id_fournisseur: id, ...fournisseurData }
        , {
          onSuccess: () => {
            toast.success('Fournisseur mis à jour avec succès')
            onClose()
          },
          onError: (error) => {
            console.error('Error updating fournisseur:', error)
            toast.error('Error lors de la mise à jour du fournisseur')
          }
        }
      )
      
      // Step 2: Upload logo if a new one is provided
      if (logo_fournisseur instanceof File) {
        try {
          await uploadLogo({ logoFile: logo_fournisseur, id_fournisseur: id }) 
        } catch (logoError) {
          console.error('Logo upload failed, but fournisseur was updated:', logoError)
          toast.warning('Fournisseur mis à jour, mais le logo n\'a pas pu être téléchargé')
        }
      }


    } catch (error) {
      console.error('Error updating fournisseur:', error)
    }
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .slice(0, 2)
      .join('')
  }

  const isLoading = isUpdating || isUploadingLogo

  return ( 
      <Dialog open={open} onOpenChange={onClose}> 
        <DialogContent className="flex max-w-[996px] w-[996px] max-h-[794px] scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="w-full leading-tight">
              Modifier un Fournisseur
            </DialogTitle>
            <DialogDescription className="leading-tight text-base -mt-2">
              Modifiez les informations du fournisseur
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex-1 overflow-y-auto space-y-6 px-1 py-2"
            >
              <div className="grid grid-cols-2 items-start gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-40 w-40 rounded-full flex-shrink-0">
                    <AvatarImage
                      className="object-cover"
                      src={previewUrl}
                      alt="Logo preview"
                    />
                    <AvatarFallback className="text-2xl font-semibold bg-rod-foreground text-rod-primary">
                      {getInitials(nomFournisseur)}
                    </AvatarFallback>
                  </Avatar>
                  <FormField
                    control={form.control}
                    name="logo_fournisseur"
                    render={() => (
                      <FormItem className="w-full">
                        <FormControl>
                          <FileInput name="logo_fournisseur" className="w-full" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1 grid grid-cols-1 gap-4">
                  <FormField
                    control={form.control}
                    name="nom_fournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nom du Fournisseur 
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: AutoLeasing Plus"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors.nom_fournisseur ? (
                          <FormMessage>
                            {form.getFieldState("nom_fournisseur").error?.message}
                          </FormMessage>
                        ) : (
                          <FormDescription>
                            Le nom complet ou la raison sociale du fournisseur
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact_name_fournisseur"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Principal</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ahmed Ben Ali"
                            {...field}
                          />
                        </FormControl>
                        {form.formState.errors.contact_name_fournisseur ? (
                          <FormMessage>
                            {form.getFieldState("contact_name_fournisseur").error?.message}
                          </FormMessage>
                        ) : (
                          <FormDescription>
                            Le nom de la personne de contact principale
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />  
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="telephone_fournisseur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+216 71 234 567"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.telephone_fournisseur ? (
                        <FormMessage>
                          {form.getFieldState("telephone_fournisseur").error?.message}
                        </FormMessage>
                      ) : (
                        <FormDescription>
                          Le numéro de téléphone principal du fournisseur
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address_fournisseur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Avenue Habib Bourguiba, Tunis"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.address_fournisseur ? (
                        <FormMessage>
                          {form.getFieldState("address_fournisseur").error?.message}
                        </FormMessage>
                      ) : (
                        <FormDescription>
                          L'adresse physique complète du fournisseur
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                /> 

                <FormField
                  control={form.control}
                  name="email_fournisseur"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email 
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="contact@exemple.tn"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.email_fournisseur ? (
                        <FormMessage>
                          {form.getFieldState("email_fournisseur").error?.message}
                        </FormMessage>
                      ) : (
                        <FormDescription>
                          L'adresse email principale pour contacter le fournisseur
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="matricule_fiscale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matricule Fiscale</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234567/A/M/000"
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.matricule_fiscale ? (
                        <FormMessage>
                          {form.getFieldState("matricule_fiscale").error?.message}
                        </FormMessage>
                      ) : (
                        <FormDescription>
                          Le numéro d'identification fiscale du fournisseur
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type_fournisseur"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        Type 
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="!max-h-80">
                          {Object.entries(fournisseurTypes).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.type_fournisseur ? (
                        <FormMessage>
                          {form.getFieldState("type_fournisseur").error?.message}
                        </FormMessage>
                      ) : (
                        <FormDescription>
                          La catégorie de service fournie par ce fournisseur
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                /> 
              </div>
            </form>
          </Form>

          <DialogFooter className="flex pt-4 border-t">
            <Button
              variant="outline"
              className="rounded-sm"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              className="rounded-sm"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Mise à jour...
                </>
              ) : (
                <>Mettre à Jour</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> 
  )
}

export default UpdateFournisseurModal