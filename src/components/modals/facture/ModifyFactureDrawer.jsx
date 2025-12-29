import React, { useEffect, useMemo } from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@/components/ui/drawer"
import { Loader2, Save, X } from 'lucide-react';
import { useFetchFactureDetail } from '../../../api/queries/facture/useGetFacture';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PencilLine } from 'lucide-react';
import { Checkbox } from '../../../components/customUi/animatedCheckbox';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form , FormField , FormLabel , FormControl , FormItem} from '@/components/ui/form';
import { formatDateDDMMYYYYJS } from '../../../utils/dateConverterJS';
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { useUpdateFacture } from '../../../api/queries/facture/useUpdateFacture';


function convertNumberToWords(amount) {
  if (typeof amount !== "number") {
    amount = parseFloat(amount);
  }

  if (isNaN(amount)) return "";

  const units = [
    "", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
    "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
    "dix-sept", "dix-huit", "dix-neuf"
  ];

  const tens = [
    "", "", "vingt", "trente", "quarante", "cinquante", "soixante",
    "soixante", "quatre-vingt", "quatre-vingt"
  ];

  function numberToFrench(n) {
    if (n === 0) return "zéro";
    if (n < 0) return "moins " + numberToFrench(-n);

    let words = "";

    if (Math.floor(n / 1000000) > 0) {
      words += numberToFrench(Math.floor(n / 1000000)) + " million" + (Math.floor(n / 1000000) > 1 ? "s " : " ");
      n %= 1000000;
    }

    if (Math.floor(n / 1000) > 0) {
      if (Math.floor(n / 1000) === 1) words += "mille ";
      else words += numberToFrench(Math.floor(n / 1000)) + " mille ";
      n %= 1000;
    }

    if (Math.floor(n / 100) > 0) {
      if (Math.floor(n / 100) === 1) words += "cent";
      else words += units[Math.floor(n / 100)] + " cent";
      if (n % 100 === 0 && Math.floor(n / 100) > 1) words += "s";
      words += " ";
      n %= 100;
    }

    if (n > 0) {
      if (n < 20) words += units[n];
      else {
        const t = Math.floor(n / 10);
        const u = n % 10;

        if (t === 7 || t === 9) {
          words += tens[t] + "-" + units[10 + u];
        } else {
          words += tens[t];
          if (u === 1 && t < 8) words += " et un";
          else if (u > 0) words += "-" + units[u];
        }

        if (t === 8 && u === 0) words += "s";
      }
    }

    return words.trim();
  }

  const dinars = Math.floor(amount);
  const millimes = Math.round((amount - dinars) * 1000);

  let result = "";

  if (dinars > 0) {
    result += numberToFrench(dinars) + " dinar" + (dinars > 1 ? "s" : "");
  }

  if (millimes > 0) {
    if (result) result += " et ";
    result += numberToFrench(millimes) + " millime" + (millimes > 1 ? "s" : "");
  }

  if (!result) result = "zéro dinar";

  return result.charAt(0).toUpperCase() + result.slice(1);
}


const factureSchema = z.object({
  invoice_number: z.string({required_error: "Numéro de facture requis"}),
  date: z.date({required_error: "Date de facture requise"}),
  due_date: z.date({required_error: "Date d'échéance requise"}),
  from: z.object({
    name: z.string().min(1, "Nom requis"),
    address: z.string().nullable().optional(),
    mf: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().email("Email invalide").nullable().optional(),
  }),
  to: z.object({
    name: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    mf: z.string().nullable().optional(),
    cin: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    email: z.string().email("Email invalide").nullable().optional(),
  }),
  items: z
    .array(
      z.object({
        qty: z.coerce.number({ required_error: "Quantité requise" , invalid_type_error: "Quantité doit être un nombre" }).positive(),
        price: z.coerce.number({ required_error: "Prix requis" , invalid_type_error: "Prix doit être un nombre" }).nonnegative(),
      })
    ),
  totals: z.object({
    timbre: z.coerce.number(),
  }),
});



const ModifyFactureDrawer = ({open , close ,id}) => {

    const { data : invoiceData , isLoading  } = useFetchFactureDetail(id, { enabled: !!open });

    const {mutate , isPending : isSaving} = useUpdateFacture();

   

    const form = useForm({
        resolver: zodResolver(factureSchema),
        defaultValues: {
            ...invoiceData,
            invoice_number : invoiceData?.invoice_number || "",
            date :  invoiceData?.date ? new Date(invoiceData.date) : null,
            due_date: invoiceData?.due_date ? new Date(invoiceData.due_date) : null,
            totals : {
                timbre : invoiceData?.totals?.timbre || "",
            },
        },
    });

    const [visibleFromFields, setVisibleFromFields] = useState({
        address: false,
        mf: false,
        phone: false,
        email: false,
    });

    const [visibleToFields, setVisibleToFields] = useState({
        name: false,
        address: false,
        mf: false,
        cin: false,
        phone: false,
        email: false,
    });

    useEffect(() => {
        if (invoiceData) {
            setVisibleFromFields({
                address: !!invoiceData.from?.address,
                mf: !!invoiceData.from?.mf,
                phone: !!invoiceData.from?.phone,
                email: !!invoiceData.from?.email,
            });

            setVisibleToFields({
                name: !!invoiceData.to?.name,
                address: !!invoiceData.to?.address,
                mf: !!invoiceData.to?.mf,
                cin: !!invoiceData.to?.cin,
                phone: !!invoiceData.to?.phone,
                email: !!invoiceData.to?.email,
            });

            form.reset({
                ...invoiceData,
                date: invoiceData.date ? new Date(invoiceData.date) : undefined,
                due_date: invoiceData.due_date ? new Date(invoiceData.due_date) : undefined,
            });
        }
    }, [invoiceData]);

    // Handle field visibility changes - set to null when hidden
    const handleFromFieldVisibility = (field, checked) => {
        setVisibleFromFields(prev => ({ ...prev, [field]: checked }));
        if (!checked) {
            form.setValue(`from.${field}`, null, { shouldDirty: true });
        }
    };

    const handleToFieldVisibility = (field, checked) => {
        setVisibleToFields(prev => ({ ...prev, [field]: checked }));
        if (!checked) {
            form.setValue(`to.${field}`, null, { shouldDirty: true });
        }
    };

    // Watch all items to recalculate totals
    const watchedItems = form.watch('items');
    const watchedTimbre = form.watch('totals.timbre');

    console.log("watchedItems" , form.watch('date') , form.watch('due_date'));

    // Calculate totals dynamically
    const calculatedTotals = useMemo(() => {
        if (!watchedItems || watchedItems.length === 0) {
            return {
                total_ht: 0,
                total_tva: 0,
                net: 0,
            };
        }

        let total_ht = 0;
        let total_tva = 0;

        watchedItems.forEach(item => {
            const itemTotal = (item.qty || 0) * (item.price || 0);
            const itemTva = itemTotal * ((item.tva || 0) / 100);
            
            total_ht += itemTotal;
            total_tva += itemTva;
        });

        const net = total_ht + total_tva + (watchedTimbre || 0);

        return {
            total_ht: total_ht.toFixed(3),
            total_tva: total_tva.toFixed(3),
            net: net.toFixed(3),
        };
    }, [JSON.stringify(watchedItems), watchedTimbre]);

    // Calculate amount in words
    const amountInWords = useMemo(() => {
        return convertNumberToWords(parseFloat(calculatedTotals.net));
    }, [calculatedTotals.net]);


     console.log("errors" , form.formState.errors);
    

    const getFieldLabel = (field) => {
        const labels = {
            name: 'Nom',
            address: 'Adresse',
            mf: 'Matricule Fiscale',
            cin: 'CIN',
            phone: 'Téléphone',
            email: 'Email',
        };
        return labels[field] || field;
    };


    const onSubmit = (data) => {
        console.log("Form Data: ", JSON.stringify(data));
        // Add calculated totals to submission data
        const submissionData = {
            ...data,
            items : data.items.map((item,index) => ({
                ...item,    
                designation : invoiceData?.items[index]?.designation ,
                total_ht: parseFloat(((item.qty || 0) * (item.price || 0)).toFixed(3)),
            })),
            totals: {
                ...data.totals,
                total_ht: parseFloat(calculatedTotals.total_ht),
                total_tva: parseFloat(calculatedTotals.total_tva),
                net: parseFloat(calculatedTotals.net),
            },
        };

        console.log("Submission Data: ", JSON.stringify(submissionData));
        console.log("Original Invoice Data: ", JSON.stringify(invoiceData));

        if ( JSON.stringify(submissionData) === JSON.stringify(invoiceData)) {
            return; // No changes made
        }
        
        mutate({ id, payload: submissionData });

        // reset is dirty state after successful save from refetched data 
        form.reset(
            {
            ...submissionData,
            items : submissionData.items.map((item) => ({
                ...item,
                // todo process env
                tva : 19, // default tva to 19% after save
            })),
            invoice_number : submissionData?.invoice_number || "",
            date : submissionData?.date || "",
            due_date : submissionData?.due_date || "",
            totals : {
                timbre : submissionData?.totals?.timbre || "",
            },
            }
        );
        
    };

    return (
        <Drawer open={open} onOpenChange={close}>
            <DrawerContent className="!h-full  ">
                <DrawerClose className="absolute right-8 top-4 cursor-pointer group">
                    <X className='size-5  opacity-75 group-hover:opacity-100 transition-opacity'/>
                </DrawerClose>

                <DrawerHeader className='border-b'>
                    <DrawerTitle >Modifier la Facture {!isLoading ? invoiceData?.invoice_number : ""}</DrawerTitle>      
                    <DrawerDescription className="sr-only">Modifiez les détails de cette facture, y compris les informations, les quantités et les dates d’échéance.</DrawerDescription>

                </DrawerHeader>

                {(isLoading || !invoiceData) ? (
                    <div className='h-full w-full items-center flex justify-center'>
                        <Loader2 className='animate-spin'/>
                    </div>
                ) : (
                    <Form {...form}>
                    <form id='facture-form-modify' onSubmit={form.handleSubmit(onSubmit)} className='overflow-scroll'>
                        <div className="min-h-screen  bg-gray-50  py-8">
                            <style>{`
                                #invoice-items tr:nth-child(even) {
                                    background-color: #f7f7f7;
                                }
                                #invoice-items th,
                                #invoice-items td {
                                    padding: 8px;
                                    text-align: left;
                                }
                                #invoice-items td:nth-child(3) {
                                    text-align: center;
                                }
                                #invoice-items td:nth-child(6) {
                                    text-align: right;
                                    font-weight: bold;
                                }
                                #table_vat td {
                                    padding: 5px 8px;
                                }
                                #table_vat tr td:first-child {
                                    text-align: left;
                                }
                                #table_vat tr td:last-child {
                                    text-align: right;
                                    font-weight: bold;
                                }
                            `}</style>
                            
                            <div className="relative w-[210mm] h-[297mm] mx-auto bg-white shadow-xl" style={{ padding: '20mm 15mm' }}>
                                {invoiceData.logo_url && (
                                    <img 
                                        src={invoiceData.logo_url} 
                                        className="w-24 h-24 object-cover absolute top-8 right-8" 
                                        alt="Logo"
                                    />
                                )}
                                
                                <h1 className="text-4xl font-bold mb-4">FACTURE</h1>
                                
                                <div className="flex gap-6 w-fit mb-8 text-base">
                                    <div className="flex gap-2 w-fit text-base">
                                        <div className="flex flex-col gap-1">
                                            <p className="h-8">N° Facture</p>
                                            <p className="h-8">Date de facture</p>
                                            <p className="h-8">À régler avant</p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="h-8">:</p>
                                            <p className="h-8">:</p>
                                            <p className="h-8">:</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 w-fit text-right">
                                        <FormField control={form.control} name="invoice_number" render={({ field }) => (
                                            <Input className="font-medium h-8 text-right text-zinc-900" {...field} />
                                        )} />
                                        <FormField control={form.control} name="date" render={({ field }) => (
                                            <DatePicker className="font-medium text-right h-8 text-zinc-900" date={field.value} setDate={field.onChange} />
                                        )} />
                                        <FormField control={form.control} name="due_date" render={({ field }) => (
                                            <DatePicker className="font-medium  h-8 text-zinc-900" date={field.value} setDate={field.onChange} />
                                        )} />
                                    </div>
                                </div>
                                
                                <div className="flex justify-between text-base mb-8">
                                    <div className='space-y-2'>
                                        <span className="font-bold flex items-center gap-3">De 
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="!p-2" size="sm"><PencilLine /></Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56">
                                                    <div className="space-y-2">
                                                        <p className="font-semibold text-sm">Champs visibles</p>
                                                        {Object.keys(visibleFromFields).map(field => (
                                                            <div key={field} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    checked={visibleFromFields[field]}
                                                                    onCheckedChange={(checked) => handleFromFieldVisibility(field, checked)}
                                                                />
                                                                <label className="text-sm">{getFieldLabel(field)}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </span>
                                        
                                        <FormField control={form.control} name="from.name" render={({ field }) => (
                                            <FormItem >
                                                <FormLabel className="text-xs text-gray-500 -mb-1.5" >Nom d'agence</FormLabel>
                                                <FormControl>
                                                <Input placeholder="Ex: Société Exemple" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        
                                        {visibleFromFields.address && (
                                            <FormField control={form.control} name="from.address" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('address')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: 123 Rue Exemple, Ville" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                            </FormItem>
                                            
                                        )} />
                                        )}

                                        {visibleFromFields.mf && (
                                            <FormField control={form.control} name="from.mf" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('mf')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: mf123456" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        )}

                                        {visibleFromFields.phone && (
                                            <FormField control={form.control} name="from.phone" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('phone')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: +216 71 548 684" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        )}


                                        {visibleFromFields.email && (
                                            <FormField control={form.control} name="from.email" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('email')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: exemple@domaine.com" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                            </FormItem>
                                        )} />
                                        )}
                                    </div>
                                    <div className='min-w-[200px] space-y-2'>
                                        <span className="font-bold flex items-center gap-3">Facturé à
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="!p-2" size="sm"><PencilLine /></Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-56">
                                                    <div className="space-y-2">
                                                        <p className="font-semibold text-sm">Champs visibles</p>
                                                        {Object.keys(visibleToFields).map(field => (
                                                            <div key={field} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    checked={visibleToFields[field]}
                                                                    onCheckedChange={(checked) => handleToFieldVisibility(field, checked)}
                                                                />
                                                                <label className="text-sm">{getFieldLabel(field)}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </span>
                                        
                                        {visibleToFields.name && (
                                            <FormField control={form.control} name="to.name" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('name')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: John Doe" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                                </FormItem>
                                            )} />
                                        )}
                                        {visibleToFields.address && (
                                            <FormField control={form.control} name="to.address" render={({ field }) => (
                                                    <FormItem >
                                                        <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('address')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: 123 Rue Exemple, Ville" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                                </FormItem>
                                            )} />
                                        )}
                                        {visibleToFields.mf && (
                                            <FormField control={form.control} name="to.mf" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('mf')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: mf123456" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                                </FormItem>
                                            )} />
                                        )}
                                        {visibleToFields.cin && (
                                            <FormField control={form.control} name="to.cin" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('cin')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: 12345678" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                                </FormItem>
                                            )} />
                                        )}
                                        {visibleToFields.phone && (
                                            <FormField control={form.control} name="to.phone" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('phone')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: +216 71 548 684" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                                </FormItem>
                                            )} />
                                        )}
                                        {visibleToFields.email && (
                                            <FormField control={form.control} name="to.email" render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel className="text-xs text-gray-500 -mb-1.5">{getFieldLabel('email')}</FormLabel>
                                                    <FormControl>
                                                    <Input placeholder="Ex: example@example.com" className="h-8" {...field} value={field.value || ''} />
                                                </FormControl>
                                                </FormItem>
                                            )} />
                                        )}
                                    </div>
                                </div>
                                
                                <table id="invoice-items" className="w-full text-sm mb-8 rounded-lg">
                                    <thead className="font-bold bg-[#ebebeb] border-t-neutral-900 border-t-4">
                                        <tr>
                                            <th>#</th>
                                            <th>Désignation</th>
                                            <th>Quantité</th>
                                            <th>P.U HT</th>
                                            <th>TVA</th>
                                            <th>Total HT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {watchedItems?.map((item, index) => {
                                            const itemTotal = ((item.qty || 0) * (item.price || 0)).toFixed(3);
                                            
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.designation}</td>
                                                    <td>
                                                        <FormField 
                                                            control={form.control} 
                                                            name={`items.${index}.qty`} 
                                                            render={({ field }) => (
                                                                <FormItem >
                                                                <FormControl>
                                                                <Input 
                                                                    className="h-6 w-14 pr-1" 
                                                                    type="number"
                                                                    step="1"
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) ?? "")}
                                                                />
                                                                </FormControl>
                                                                </FormItem>
                                                            )} 
                                                        />
                                                    </td>
                                                    <td>
                                                        <FormField 
                                                            control={form.control} 
                                                            name={`items.${index}.price`} 
                                                            render={({ field }) => (
                                                                <FormItem >
                                                                <FormControl>
                                                                <div className="relative">
                                                                        <Input 
                                                                            className="h-6 w-28 pr-7" 
                                                                            type="number"
                                                                            {...field}
                                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) ?? "")}
                                                                        />
                                                                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2  text-sm pointer-events-none">DT</span>
                                                                </div>
                                                                </FormControl>
                                                                </FormItem>
                                                            )} 
                                                        />
                                                    </td>
                                                    <td>{item.tva}%</td>
                                                    <td>{itemTotal} DT</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                
                                <div className="flex justify-between w-full gap-8 mt-8 mb-16">
                                    <div className="w-1/2">
                                        <p className="font-bold border-t-neutral-800 border-t-4 p-1 px-2 bg-[#ebebeb] text-sm">
                                            Informations Supplémentaires
                                        </p>
                                        <div className="border-gray-100 border h-full"></div>
                                    </div>
                                    <div className="w-1/2 text-sm flex justify-end">
                                        <table id="table_vat" className="w-fit">
                                            <tbody>
                                                <tr>
                                                    <td className="text-nowrap">Total HT:</td>
                                                    <td className="text-nowrap">{calculatedTotals.total_ht} DT</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-nowrap">Total TVA:</td>
                                                    <td className="text-nowrap">{calculatedTotals.total_tva} DT</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-nowrap">Timbre Fiscal:</td>
                                                    <td className="text-nowrap w-full flex justify-end">
                                                        <FormField 
                                                            control={form.control} 
                                                            name="totals.timbre" 
                                                            render={({ field }) => (
                                                                <FormItem >
                                                                <FormControl>
                                                                <div className="relative">
                                                                    <Input 
                                                                        className="h-6 max-w-20 pr-7 text-right" 
                                                                        type="number"
                                                                        step="0.1"
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value)  ?? "")}
                                                                    />
                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-sm pointer-events-none">DT</span>
                                                                </div>
                                                                </FormControl>
                                                                </FormItem>
                                                            )} 
                                                        /> 
                                                    </td>
                                                </tr>
                                                <tr className="font-bold text-sm bg-[#ebebeb] border-t-neutral-800 border-t-4">
                                                    <td className="text-nowrap">NET À PAYER</td>
                                                    <td className="font-bold">{calculatedTotals.net} DT</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                <div className="mb-16 gap-8 flex text-sm justify-between w-full">
                                    <p className="w-full">
                                        Arrêtée la présente facture à la somme de <br />
                                        <strong className="text-xs">{amountInWords}</strong>
                                    </p>
                                    <p className="w-[500px] text-sm text-center leading-none">Signature et cachet</p>
                                </div>
                            </div>
                        </div>
                    </form>
                    </Form>
                )}
            
                {form.formState.isDirty && (
                    <DrawerFooter className='px-[100mm] bg-white border-t'>
                        <Button  type="submit" disabled={isSaving} form='facture-form-modify'>
                            {
                                isSaving ? <><Loader2 className='size-4 mr-2 animate-spin'/> Sauvegarde... </>  : <><Save className='mb-0.5'/> Sauvegarder</>
                            }
                            
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Annuler</Button>
                        </DrawerClose>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
};

export default ModifyFactureDrawer;


export function DatePicker({ date, setDate, className }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-end text-right font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    {date ? <span className="mt-0.5 ">{ formatDateDDMMYYYYJS(date) }</span> : <span >{"Choisir une date"}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent avoidCollisions={true} collisionPadding={16} align="start" className="w-full p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                        // Prevent deselecting the date (i.e., clicking again to remove)
                        if (!selectedDate) return
                        setDate(selectedDate)
                    }}
                    initialFocus
                    captionLayout="dropdown"
                    defaultMonth={ date || new Date()}
                    toYear={2045}
                />
            </PopoverContent>
        </Popover>
    )
}
