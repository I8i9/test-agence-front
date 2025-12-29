import React from 'react'
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Percent, Loader2, TriangleAlert } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useDeletePromo } from '../../../api/queries/offre/useDeletePromo'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form'

export const DeletePromoModal = ({ open, onClose, id, sequence }) => {
  const { mutate: deletePromo, isPending } = useDeletePromo({
    onSuccess: () => {
      onClose()
    }
  });

  const formSchema = z.object({
    promoCode: z.string().refine((val) => val === sequence, {
      message: `Code incorrect. Tapez « ${sequence} » pour confirmer la désactivation.`,
    }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promoCode: '',
    },
  })

  const onSubmit = () => {
    deletePromo(id)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="pb-4 pt-5 px-6 w-[550px] h-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-red-100 rounded-full flex items-center justify-center">
                <Percent className="text-red-600 size-5 desktop-lg:size-6" />
              </span>
              <span className="text-base text-destructive">
                Désactiver la promotion {sequence}
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-sm text-muted-foreground">
            Cette action est irréversible. La promotion sera désactivée.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="promoCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer la suppression</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  {form.formState.errors.promoCode ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Tapez le code promotionnel <strong>{sequence}</strong> pour confirmer la désactivation.
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
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    Désactivation...
                    <Loader2 className="animate-spin" size={16} />
                  </>
                ) : (
                  "Désactiver"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
