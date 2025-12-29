import React from 'react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Loader2, X } from 'lucide-react';
import { useFetchFactureDetail } from '../../../api/queries/facture/useGetFacture';
import { formatDateDDMMYYYY } from '../../../utils/dateConverter';

const ViewFactureDrawer = ({open , close ,id}) => {

    const { data : invoiceData , isPending } = useFetchFactureDetail(id, { enabled: !!open });
  return (
    <Drawer open={open} onOpenChange={close}>
        <DrawerContent className="!h-full bg-[#282828] border-[#282828]">
            <DrawerClose className="absolute right-8 top-4 cursor-pointer group">
                <X className='size-5 text-white opacity-75 group-hover:opacity-100 transition-opacity'/>
            </DrawerClose>

             <DrawerHeader className='sr-only'>
                <DrawerTitle  className="sr-only">Voir la Facture</DrawerTitle>      
                <DrawerDescription className="sr-only">Voir les détails de cette facture.</DrawerDescription>

            </DrawerHeader>

            {/* Drawer Body Content */}

            {
                isPending ? <div className='h-full w-full items-center flex justify-center'><Loader2 className='animate-spin'/></div> :
                
                <div className="min-h-screen bg-[#282828] py-8 overflow-scroll ">
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
                    {/* Logo */}
                    {invoiceData.logo_url && (
                    <img 
                        src={invoiceData.logo_url} 
                        className="w-24 h-24 object-cover absolute top-8 right-8" 
                        alt="Logo"
                    />
                    )}
                    
                    {/* Title */}
                    <h1 className="text-4xl font-bold mb-4">FACTURE</h1>
                    
                    {/* Invoice Meta */}
                    <div className="flex gap-6 w-fit mb-8 text-base">
                    <div className="flex gap-2 w-fit text-base">
                        <div className="flex flex-col gap-1">
                        <p className="">N° Facture</p>
                        <p className="">Date de facture</p>
                        <p className="">À régler avant</p>
                        </div>
                        <div className="flex flex-col gap-1">
                        <p className="">:</p>
                        <p className="">:</p>
                        <p className="">:</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 w-fit text-right">
                        <span className="font-bold text-zinc-900">{invoiceData.invoice_number}</span>
                        <span className="font-bold text-zinc-900">{formatDateDDMMYYYY(invoiceData.date)}</span>
                        <span className="font-bold text-zinc-900">{formatDateDDMMYYYY(invoiceData.due_date)}</span>
                    </div>
                    </div>
                    
                    {/* Company & Customer */}
                    <div className="flex justify-between text-base mb-8">
                    <div>
                        <span className="font-bold">De</span><br />
                        <p>{invoiceData.from.name}</p>
                        {invoiceData.from.address && <p>{invoiceData.from.address}</p>}
                        {invoiceData.from.mf && <p>M/F: {invoiceData.from.mf}</p>}
                        {invoiceData.from.phone && <p>{invoiceData.from.phone}</p>}
                        {invoiceData.from.email && <p>{invoiceData.from.email}</p>}
                    </div>
                    <div className='min-w-[200px]'>
                        <span className="font-bold">Facturé à</span><br />
                        <p>{invoiceData.to.name}</p>
                        {invoiceData.to.address && <p>{invoiceData.to.address}</p>}
                        {invoiceData.to.mf && <p>M/F: {invoiceData.to.mf}</p>}
                        {invoiceData.to.phone && <p>{invoiceData.to.phone}</p>}
                        {invoiceData.to.email && <p>{invoiceData.to.email}</p>}
                    </div>
                    </div>
                    
                    {/* Items Table */}
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
                        {invoiceData.items.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.designation}</td>
                            <td>{item.qty}</td>
                            <td>{item.price} DT</td>
                            <td>{item.tva}%</td>
                            <td>{item.total_ht} DT</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                    
                    {/* Totals Section */}
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
                            <td className="text-nowrap">{invoiceData.totals.total_ht} DT</td>
                            </tr>
                            <tr>
                            <td className="text-nowrap">Total TVA:</td>
                            <td className="text-nowrap">{invoiceData.totals.total_tva} DT</td>
                            </tr>
                            <tr>
                            <td className="text-nowrap">Timbre Fiscal:</td>
                            <td className="text-nowrap">{invoiceData.totals.timbre} DT</td>
                            </tr>
                            <tr className="font-bold text-sm bg-[#ebebeb] border-t-neutral-800 border-t-4">
                            <td className="text-nowrap">NET À PAYER</td>
                            <td className="font-bold">{invoiceData.totals.net} TTC</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </div>
                    
                    {/* Amount in words */}
                    <div className="mb-16 gap-8 flex text-sm justify-between w-full">
                    <p className="w-full">
                        Arrêtée la présente facture à la somme de <br />
                        <strong className="text-xs">{invoiceData.amount_words}</strong>
                    </p>
                    <p className="w-[500px] text-sm text-center leading-none">Signature et cachet</p>
                    </div>
                </div>
                </div>
            }
             
            
        </DrawerContent>
    </Drawer>
  )
}

export default ViewFactureDrawer