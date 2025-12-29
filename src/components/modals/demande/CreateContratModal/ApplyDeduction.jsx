import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BanknoteArrowDown, Tag} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useForm } from 'react-hook-form';


export const ApplyDeduction = ({total, deduction , setContratData }) => {

  console.log("total",total)
  const schema = z.object({
    remise: z.preprocess(
      (val) => {
        if (typeof val === "string" && val.trim() === "") return undefined;
        return Number(val);
      },
      z.number({
        required_error: "La remise est requise.",
        invalid_type_error: "La remise doit être un nombre.",
      })
      .min(0, "La remise doit être positive.")
      .max(total, `La remise ne peut pas dépasser le totale ${total} DT`)
    ),
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      remise: deduction  || "",
    },
  });


  const handleSubmit = (data) => {
    console.log("data",data)
    setOpen(false);

    setTimeout(() => {
      setContratData((prev) => ({
        ...prev,
        deduction_agence: data.remise,
      }));
    }, 100);
  }

  const handleRemove = () => {
    setOpen(false);
    setTimeout(() => {
    setContratData((prev) => ({
                    ...prev,
                    deduction_agence: null,
                  }));
    form.reset();
                }, 100);
  }

  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-destructive hover:text-destructive">
          <Tag className="w-4 h-4" />
            Appliquer une remise
        </Button>
          
      </DialogTrigger>

      <DialogContent className="pb-4 pt-5 px-6 w-[550px] h-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-rod-foreground rounded-full flex items-center justify-center">
                <BanknoteArrowDown className="size-5 desktop-lg:size-6" />
              </span>
              <span className="text-base">Appliquer une remise</span>
            </div>
          </DialogTitle>
          <DialogDescription className="flex items-start gap-2 text-sm text-muted-foreground">
            Offrez une remise exceptionnelle au client sur ce contrat de location.
          </DialogDescription>
          <Separator />
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="remise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant de la remise</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input  placeholder="Ex : 50 DT" type="number" {...field} className="pr-12" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">DT</span>
                    </div>
                  </FormControl>
                  {form.formState.errors.remise ? (
                    <FormMessage />
                  ) : (
                    <FormDescription>
                      Saisissez le montant de la remise à appliquer
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            <DialogFooter className="w-full pt-5">
              {
                deduction ? (
                  <Button type="button" variant="outline" onClick={handleRemove} className="flex items-center gap-2">
                    Supprimer la remise
                  </Button>
                )
                
                : (
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                )
              }
              
              <Button type="submit" disabled={isNaN(form.watch("remise")) || form.watch("remise") === ""} className="flex items-center gap-2">
                Appliquer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
