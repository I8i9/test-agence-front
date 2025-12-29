import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { CheckCheck } from "lucide-react"
import  { useState } from "react";

import { useUpdateGarage } from "../../../../api/queries/garage/useUpdateGarage"

export const ConfirmVignette = ({id,date,setCost}) => {

    const {mutate : updateGarage } = useUpdateGarage();

    const handleUpdate = () => {
        updateGarage({
        id_garage:id,
        vignette:true
        },
        {
            onSuccess : () => {setCost ({open : true , id : id , type : "VIGNETTES_ET_TAXES_SUR_LES_VEHICULES" , title : "la vignette" } ); setOpen(false);}
        }
      );
    };

    const [open, setOpen] = useState(false);
    

    return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>

            <Button  className="text-rod-primary self-start absolute right-4 top-1/2 -translate-y-1/2" variant="outline" size="sm" >
                <CheckCheck/>
            </Button>

      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="w-full flex items-center gap-3">
              <span className=" p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                <CheckCheck className="w-5 h-5"/>
              </span>
              <span className="text-lg">Confirmer la paiement du vignette?</span>
              </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Confirmez que la vignette a été réglée pour l’année en cours, conformément aux obligations légales, avant le {date}.        
        </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='w-full'>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Confirmer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
}