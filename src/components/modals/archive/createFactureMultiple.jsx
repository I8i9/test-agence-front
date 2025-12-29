import { Plus } from 'lucide-react'
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,DialogFooter  } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {Form,FormField,FormMessage,FormItem,FormDescription,FormLabel,FormControl} from '@/components/ui/form.jsx'
import { DatePicker } from '../../ui/date-picker'
import { Input } from '@/components/ui/input.jsx'
import {  FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import useAddFacture from '../../../api/queries/facture/useAddFacture'
import { formatDateTime } from '../../../utils/datautils'

const CreateFactureMultiple = ({ open, onClose  , contrats }) => {

    console.log("Creating facture for contrats:", contrats);
    
        const {mutate , isPending} = useAddFacture();
    
        const schema = z.object({
            reference_facture: z.string().min(1, "Le numéro de contrat est requis"),
            date_facture: z.date(),
            date_echeance: z.date().optional(),
        });
    
        const form = useForm({
            resolver: zodResolver(schema),
            defaultValues: {
                reference_facture: '',
                date_facture: '',
                date_echeance: '',
            },
        });
    
        const handleSubmit = (data) => {
            const payload = {
                contrats : contrats.map(c => c.id_contrat),
                reference_facture: data.reference_facture,
                date_facture: formatDateTime(data.date_facture),
                date_echeance_facture: formatDateTime(data.date_echeance),
                year: data.date_facture.getFullYear(),
                month: data.date_facture.getMonth() + 1,
            };
    
            mutate(payload , {
                onSuccess: () => {
                     onClose(); 
                }
            });
           // Close the modal after submission
        }
  return (
     <Dialog open={open} onOpenChange={onClose}> 
      <DialogContent className="flex max-w-[976px] w-[876px] scale-80 desktop:scale-90 desktop-lg:scale-110 flex-col h-auto ">
        
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight">
             <div className="w-full flex items-center gap-3">
              <span className=" p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5"/>
              </span>
              <span className="text-lg">Générer une facture multiple</span>
              </div>
            
        </DialogTitle>
          <DialogDescription className="leading-tight text-base ">
            Générer une facture pour les contrats {contrats.map(c => c.sequence).join(', ')}.
          </DialogDescription>
          <Separator />
        
        </DialogHeader>

        <Form {...form}>
            <form id='add-facture-solo' onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-4">
                <FormField
                    control={form.control}
                    name="reference_facture"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Référence de la facture</FormLabel>
                        <FormControl>
                        <Input
                            type="text"
                            placeholder="Ex : FAC-2024-001"
                       
                            {...field}
                        />
        
                        </FormControl>
                        {
                            form.formState.errors.reference_facture ?
                                <FormMessage />
                                :
                                <FormDescription>Entrez la référence unique pour cette facture.</FormDescription>
                            
                        }
                    </FormItem>
                    )}
                />
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="date_facture"
                        render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Date de la facture</FormLabel>
                            <FormControl>
                            <DatePicker 
                                date={field.value}
                                setDate={(date) => field.onChange(date)}
                            />
                            </FormControl>
                            {
                                form.formState.errors.date_facture ? <FormMessage /> : <FormDescription>Entrez la date de la facture.</FormDescription>
                            }
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date_echeance"
                        render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormLabel>Date d'échéance</FormLabel>
                            <FormControl>
                            <DatePicker 
                                date={field.value}
                                setDate={(date) => field.onChange(date)}
                            />
                            </FormControl>
                            {
                                form.formState.errors.date_echeance ? <FormMessage /> : <FormDescription>Entrez la date d'échéance de la facture.</FormDescription>
                            }
                        </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>

        <DialogFooter className=" border-t pt-4">
            <Button variant="outline" onClick={onClose}>Annuler</Button>
            <Button form="add-facture-solo" disabled={isPending} onClick={() => {
                form.handleSubmit(handleSubmit)
            }}>
                {
                    isPending ? <><Loader2 className=" animate-spin" /> Génération...</> : 'Générer la facture'
                }
            </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export default CreateFactureMultiple