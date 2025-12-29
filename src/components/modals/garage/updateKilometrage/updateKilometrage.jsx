import React from 'react';
import { Dialog , DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Gauge, Loader2 } from 'lucide-react';
import { useUpdateGarage } from '../../../../api/queries/garage/useUpdateGarage';
import useFetchOldKilometrage from '../../../../api/queries/garage/useFetchOldKilometrage'; 
import { Separator } from "@/components/ui/separator";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const UpdateKilometrage = ({ open, setOpen, id, kilometrage }) => {
  const { data: oldKilometrage, isLoading } = useFetchOldKilometrage(id);
  const { mutate: updateGarage, isPending } = useUpdateGarage();

  const schema = z.object({
    kilometrage: z.preprocess(
      (val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        return Number(val);
      },
      z.number({
        required_error: "Le kilométrage est requis.",
        invalid_type_error: "Le kilométrage doit être un nombre.",
      })
      .min(0, "Le kilométrage doit être supérieur ou égal à 0")
      .max(9999999, "Le kilométrage ne peut pas dépasser 999 999 km")
      .refine((val) => {
        if (oldKilometrage && val <= oldKilometrage) {
          return false;
        }
        return true;
      }, {
        message: `Le kilométrage doit être supérieur à ${oldKilometrage || 0} km`
      })
    ),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      kilometrage: oldKilometrage || kilometrage || 0,
    },
  });

  React.useEffect(() => {
    if (oldKilometrage) {
      form.setValue('kilometrage', oldKilometrage);
    }
  }, [oldKilometrage, form]);

  const handleSubmit = (data) => {
    updateGarage(
    {
      id_garage: id,
      kilometrage: data.kilometrage,
    },
    {
      onSuccess: () => {
        toast.success("Le kilométrage a été mis à jour.")
        setOpen(false)
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Erreur inconnue")
        setOpen(false)
      },
    }
  )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}> 

      <DialogContent className="pb-4 pt-5 px-6 w-[550px] h-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
                <Gauge className="size-5 desktop-lg:size-6" />
              </span>
              <span className="text-base">Mettre à jour le kilométrage</span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-sm text-muted-foreground">
            Mettez à jour le kilométrage pour une meilleure suivi des véhicules.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="kilometrage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kilométrage</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="number" {...field} className="pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">km</span>
                    </div>
                  </FormControl>
                  {form.formState.errors.kilometrage ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Indiquer le nouveau kilométrage du véhicule
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter className="w-full pt-5">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isPending || isLoading} className="flex items-center gap-2">
                {isPending ? (
                  <>
                    Mise à jour en cours...
                    <Loader2 className="animate-spin" size={16} />
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
