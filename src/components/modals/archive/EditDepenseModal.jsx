import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2, RefreshCcw, HandCoins } from 'lucide-react'
import { useUpdateDepense } from '../../../api/queries/depense/useUpdateDepense'
import MultipleFilesField from '../../customUi/MultipleFilesField'
import { Label } from '@/components/ui/label'
import { useUploadFacturePhoto } from '../../../api/queries/images/useUploadFactureDepense'
import { toast } from 'sonner'


const formSchema = z.object({
  depense_tva: z.coerce.number().min(0, "La TVA doit être positive").max(100, "La TVA ne peut pas dépasser 100%").optional(),
  depense_class: z.coerce.number().min(0, "La classe comptable doit être positive").optional(),
  recu_depense: z.string().optional(),
  taux_deduction_tva: z.coerce.number().min(0, "Le taux déductible doit être positif").max(100, "Le taux déductible ne peut pas dépasser 100%").optional(),
})

const EditDepenseModal = ({ onClose, open, depenseData }) => {
  const [files ,setFiles] = React.useState([]);
  const { mutate: updateDepense, isPending } = useUpdateDepense()
  const {mutate: uploadFiles, isPending: isUploading} = useUploadFacturePhoto();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      depense_tva: depenseData?.tva_depense || 0,
      depense_class: depenseData?.class_comptable_depense || '',
      recu_depense: depenseData?.recu_depense || '',
      taux_deduction_tva: depenseData?.taux_deduction_tva * 100 || 0,
    },
  })

  const watchedValues = form.watch();

  const isSame = files.length === 0 && depenseData?.tva_depense === watchedValues?.depense_tva &&
    depenseData?.class_comptable_depense === watchedValues?.depense_class &&
    depenseData?.taux_deduction_tva * 100 === watchedValues?.taux_deduction_tva &&
    depenseData?.recu_depense === watchedValues?.recu_depense;
  // Reset form when modal opens with new data

  console.log("Depense data in modal:", depenseData , "data files:", files , "data from from"
    , form.getValues() , isSame , isUploading , isPending
  );

  const handleSubmit = async (data) => {

    var toasted  = false
    if (!(depenseData?.tva_depense == data.depense_tva &&
        depenseData?.class_comptable_depense == data.depense_class &&
        depenseData?.taux_deduction_tva * 100 == data.taux_deduction_tva &&
        depenseData?.recu_depense == data.recu_depense)) {

      try {

        const changedData = {
          id_depense: depenseData?.id_depense,
          ...(depenseData?.tva_depense !== data.depense_tva ? { tva_depense: data.depense_tva } : {}),
          ...(depenseData?.class_comptable_depense !== data.depense_class ? { class_comptable_depense: data.depense_class } : {}),
          ...(depenseData?.taux_deduction_tva * 100 !== data.taux_deduction_tva ? { taux_deduction_tva: data.taux_deduction_tva / 100 } : {}),
          ...(depenseData?.recu_depense !== data.recu_depense ? { recu_depense: data.recu_depense } : {}),
        }
        updateDepense(changedData)
        
      } catch (error) {
        console.error('Error updating depense:', error)
      }
      toasted = true
    }

    // handle files uplaod if there are new files
    if (files.length > 0) {
      uploadFiles({ images: files , id_depense: depenseData?.id_depense  })

      if (!toasted) {
        toast.success('Dépense modifiée avec succès');
      }

    }

    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>  
      <DialogContent className="pb-5 pt-5 px-6 laptop:scale-90 desktop:scale-100  w-[700px]">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
                <HandCoins size={16} />
              </span>
              <span className="text-base align-middle">
                Mettre à jour la dépense {depenseData?.sequence_depense || depenseData?.recu_depense || ''}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className='pb-1 leading-tight'>
            Modifiez le taux de TVA ou la classe comptable de cette dépense.
          </DialogDescription>
          <Separator className="mt-0.25" />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 w-full"> 
            <div className='flex gap-4 w-full'>
            
            
            <FormField
              control={form.control}
              name="recu_depense"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Numéro de facture</FormLabel>
                  <FormControl> 
                    <Input
                      type="text"
                      step="1"
                      {...field} 
                      placeholder="Ex: 6512"
                    />  
                  </FormControl>
                  {form.formState.errors.recu_depense ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>  
                      Indiquer la classe comptable de la dépense
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depense_tva"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>TVA de la dépense</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        {...field} 
                        className="pr-8"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        %
                      </span>
                    </div>
                  </FormControl>
                  {form.formState.errors.depense_tva ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>  
                      Indiquer le taux de TVA appliqué (0-100%)
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            </div>

             <div className='flex gap-4 w-full'>
            <FormField
              control={form.control}
              name="taux_deduction_tva"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Taux de déduction TVA</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        {...field} 
                        className="pr-8"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                        %
                      </span>
                    </div>
                  </FormControl>
                  {form.formState.errors.depense_tva ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>  
                      Indiquer le taux de TVA appliqué (0-100%)
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="depense_class"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Classe comptable</FormLabel>
                  <FormControl> 
                    <Input
                      type="number"
                      step="1"
                      {...field} 
                      placeholder="Ex: 6512"
                    />  
                  </FormControl>
                  {form.formState.errors.depense_class ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>  
                      Indiquer la classe comptable de la dépense
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            </div>

            <div>
              <Label>Ajoutez des fichiers</Label>
              <FormDescription className="mt-1">Vous pouvez ajoutez ou remplacez les images (les anciennes seront supprimées).</FormDescription>
              <MultipleFilesField files={files} setFiles={setFiles} className='!px-0 !mt-2 !gap-2' smallVariant={true} />
            </div>
            
            <DialogFooter className="w-full pt-2">
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Annuler
              </Button>
              <Button disabled={isPending || isSame || isUploading} type="submit" >
                {(isPending || isUploading) ? (
                  <>
                    <Loader2 className=" h-4 w-4 animate-spin" />
                    En cours...
                  </>
                ) : (
                  <>
                  <RefreshCcw className=" h-4 w-4" />
                  Mettre à jour
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDepenseModal