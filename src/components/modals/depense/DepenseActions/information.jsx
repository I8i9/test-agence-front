import { formatDateDDMMYYYY, FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter'
import { Barcode, CalendarDaysIcon, ChevronLeft, ChevronRight, DollarSign, Folder, Gavel, NotebookText, Store, X } from 'lucide-react'
import { allCosts } from '../../../../utils/costs'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'
import { HandCoins } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar'
import ReactDOM from 'react-dom'
import DetailItem from '../../../customUi/detailitem'
import ToolTipCustom from '../../../customUi/tooltip'
import { formatDateDDMMYYYYJS, FormatDateEEEEddMMyyyyJS } from '../../../../utils/dateConverterJS'


const Information = ({ DepenseData , setMaximizedFacture , maximizedFacture , isForForm = false }) => {    

    const closeFact = () => {
        setMaximizedFacture(null)
        
    }

    const openFact = (path ) => {
        if(!path) return
        setMaximizedFacture({ url: path[0]  , index : 0} )
    }

    const handleNextFact = () => {
        if(!maximizedFacture) return
        
        const currentIndex = DepenseData?.facture_image_path?.indexOf(maximizedFacture.url);
        console.log('viewedFacture' , DepenseData?.facture_image_path , maximizedFacture , currentIndex);
        if(currentIndex === -1) return
        const nextIndex = (currentIndex + 1) % DepenseData?.facture_image_path?.length;
        const nextUrl = DepenseData?.facture_image_path[nextIndex];
        setMaximizedFacture({   url: nextUrl , index : nextIndex });
    }

    const handlePrevFact = () => {
        if(!maximizedFacture) return
        const currentIndex = DepenseData?.facture_image_path?.indexOf(maximizedFacture.url);
        if(currentIndex === -1) return
        const prevIndex = (currentIndex - 1 + DepenseData?.facture_image_path?.length) % DepenseData?.facture_image_path?.length;
        const prevUrl = DepenseData?.facture_image_path[prevIndex];
        setMaximizedFacture({   url: prevUrl , index: prevIndex });
    }
  return (
<>
    <Card className="shadow-none">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium text-lg">
            <HandCoins className="w-5 h-5" />
            Informations générales
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className= "grid grid-cols-3 gap-x-8 gap-y-6 " >
                <DetailItem label="Date Dépense" icon={CalendarDaysIcon}>
                    {
                        isForForm ? 
                            <ToolTipCustom trigger={<span>{
                                formatDateDDMMYYYYJS(DepenseData.date_depense)}
                                </span>} message={FormatDateEEEEddMMyyyyJS(DepenseData.date_depense)} />
                        :
                            <ToolTipCustom trigger={<span>{
                                formatDateDDMMYYYY(DepenseData?.date_depense)}
                                </span>} message={FormatDateEEEEddMMyyyy(DepenseData?.date_depense)} />

                    }
                    
                </DetailItem>

                

                <DetailItem label="Type de Dépense" icon={Folder}>
                    <ToolTipCustom
                        trigger={
                            <span>{allCosts.find(cost => cost.value === DepenseData.type_depense)?.label}</span>

                        }
                        message={
                            allCosts.find(cost => cost.value === DepenseData.type_depense)?.label
                        }
                />

                </DetailItem>

                
                <DetailItem label="Fournisseur" icon={Store}>
                    
                    <ToolTipCustom
                        trigger={<span className='gap-2 flex  items-center'>
                            
                        <Avatar className="size-6 inline-block border rounded-full  ">
                            <AvatarImage src={DepenseData?.fournisseur?.logo_fournisseur}  alt={DepenseData?.fournisseur?.nom_fournisseur || "Sans fournisseur "} className={"object-cover"} />
                            <AvatarFallback className='text-xs font-semibold'>?</AvatarFallback>
                        </Avatar>
                            <span className='inline-block truncate'>{DepenseData?.fournisseur?.nom_fournisseur || "Sans fournisseur"}</span>
                        </span>}
                        message={DepenseData?.fournisseur?.nom_fournisseur || "Sans fournisseur"}
                    />
                    
                </DetailItem>

                <DetailItem label="Numéro de facture" icon={Barcode}>
                    <span onClick={()=> {openFact(DepenseData?.facture_image_path ) }} className={`font-medium ${( DepenseData?.facture_image_path && DepenseData?.facture_image_path.length > 0) ? "text-blue-700 cursor-pointer hover:text-blue-800 group-hover:underline" : ""}`}>
                    {DepenseData?.recu_depense || 'Non fournie'}
                    </span>
                </DetailItem>

                <DetailItem label="Montant de Dépense" icon={DollarSign}>{DepenseData.montant_depense + ' DT'}</DetailItem>
                

                <DetailItem label="Retenue à la source" icon={Gavel}>{DepenseData.rts_depense ? DepenseData.rts_depense + 'DT' : '_'}</DetailItem>
                <DetailItem className={"col-span-3"} label="Description Dépense" icon={NotebookText}>{DepenseData.description_depense || '_'}</DetailItem>
            </div>
        </CardContent>
    </Card>

     {maximizedFacture &&
            ReactDOM.createPortal(
            <div
                className="fixed inset-0 z-[100] bg-rod-primary/80 backdrop-blur-xs flex items-center justify-center p-4"
                onClick={closeFact}
                style={{ pointerEvents: 'auto' }} // make sure it's clickable
            >


                {/* Invisible blocker to prevent background interactions */}
                <div className="absolute inset-0 z-0" />

                {/* Content wrapper that stops propagation */}
                <div
                className="relative z-10 max-w-full max-h-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
                >
                {/* Close Button */}
                <button
                    onClick={(e) => {
                    e.stopPropagation();
                    closeFact();
                    }}
                    className="fixed top-4 right-4 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                >
                    <X className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                </button>

                {/* Navigation Buttons */}
                {(DepenseData?.facture_image_path && DepenseData?.facture_image_path.length > 1) ? <>
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        handlePrevFact();
                        }
                        }
                        className="fixed top-1/2 left-4 -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                    >
                        <ChevronLeft className="w-8 h-8 text-gray-300 hover:text-gray-400" />
                    </button>
                    <button 
                        onClick={(e) => {
                        e.stopPropagation();
                        handleNextFact();
                        }}
                        className="fixed top-1/2 right-4 -translate-y-1/2 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
                    >
                        <ChevronRight className="w-8 h-8 text-gray-300 hover:text-gray-400" />
                    </button>
                </> : null}

                {/* Image */}
                <img
                    src={maximizedFacture.url}
                    alt={maximizedFacture.label}
                    className="max-w-full max-h-[80dvh] object-contain rounded-lg shadow-2xl"
                />

               

                {/* Caption */}
                <div className="mt-6 text-center text-white">
                    <h2 className="text-2xl font-semibold">{DepenseData?.recu_depense || DepenseData?.sequence_depense}</h2>
                    <h2 className='text-sm font-semibold text-gray-300'>{maximizedFacture.index + 1} / {DepenseData?.facture_image_path.length}</h2>
                </div>
                </div>
            </div>,
            document.body
            )}
    </>
  )
}

export default Information