import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Loader2, TriangleAlert } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'
import { useDeleteFournisseur } from '../../../api/queries/fournisseurs/useDeleteFournisseur' 

export const DeleteFournisseurModal = ({ open, onClose, id, fournisseurSequence }) => {
    
  const formSchema = z.object({
    confirmCode: z.string().refine(val => val === fournisseurSequence, {
      message: `Nom incorrect. Tapez « ${fournisseurSequence} » pour confirmer la suppression.`,
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      confirmCode: '',
    },
  })

  const { mutate: DeleteFournisseur, isPending: isDeleting } = useDeleteFournisseur({
    onSuccess: () => {
      onClose()
    }
  })

  const handleSubmit = () => {
    DeleteFournisseur(id)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="pb-4 pt-5 px-6 w-[550px] h-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600 size-5 desktop-lg:size-6" />
              </span>
              <span className="text-base text-destructive">
                Supprimer définitivement l’Fournisseur {fournisseurSequence}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-sm text-muted-foreground">
            Cette action est irréversible. L'Fournisseur sera désactivée.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        {/* Form with input validation */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="confirmCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer la suppression </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  {form.formState.errors.confirmCode ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Tapez le code <strong>{fournisseurSequence}</strong> pour confirmer la désactivation.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            /> 

            <DialogFooter className="w-full pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="destructive"
                className="flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    Suppression en cours...
                    <Loader2 className="animate-spin" size={16} />
                  </>
                ) : (
                  "Supprimer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteFournisseurModal