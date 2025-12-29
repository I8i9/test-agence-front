import { Dialog , DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import useReOpenOffer from "../../../api/queries/offre/useReOpenOffer";
import { toast } from "sonner"; 
import { DatePicker } from "@/components/ui/date-picker";
import {formatDateOnly } from "../../../utils/datautils";
import { AlertGreen } from "../../customUi/Alert";

function ReOpenOffreModal({ open, onClose, id, offerSequence }) {
  const [dateFin, setDateFin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { mutate: reopenOffer } = useReOpenOffer();

  // Get today's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

  const handleReopen = async () => {
    if (!dateFin) {
      toast.error("Veuillez sélectionner la date de fin");
      return;
    }

    if (dateFin <= today) {
      toast.error("La date de fin doit être dans le futur");
      return;
    }

    setIsLoading(true);
    
    const payload = {
      id_offre: id,
      date_fin_offre: formatDateOnly(dateFin),
    };
    reopenOffer(payload, {
      onSuccess: () => {
        toast.success("Offre restaurée avec succès!");
        handleClose();
      },
      onError: (error) => {
        console.error("Error reopening offer:", error);
        toast.error(error?.response?.data?.message || "Erreur lors de la restauration de l'offre");
        setIsLoading(false);
      }
    }); 
  };

  const handleClose = () => {
    setDateFin(null);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}> 
      <DialogContent className="pb-2 pt-5 px-6 w-[650px]">
        <DialogHeader>
          <DialogTitle>
            <div className="w-full flex items-center gap-2">
              <span className="p-1.5 bg-rod-foreground  rounded-full flex items-center justify-center">
                <RefreshCcw size={16} strokeWidth={2} />
              </span>
              <span className="text-base align-middle">
                Recréer cette Offre?
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className=" pb-1 leading-tight">
            {offerSequence && (
              <span>Offre {offerSequence} - </span>
            )}
            Sélectionnez la date de fin pour restaurer cette offre.
          </DialogDescription>
        </DialogHeader>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Date de fin *</Label>
            <DatePicker
              date={dateFin}
              setDate={setDateFin}
              title="Sélectionner la date de fin"
              disabledButton={isLoading}
              disabled={(date) => date <= today}
            />
          </div>
          
          <AlertGreen title="Remarques" description={
            <ul>
              <li>• La nouvelle offre conservera toutes les informations de l'offre originale</li>
            <li>• Le compteur de clics sera remis à zéro</li>
            <li>• Un nouveau numéro de séquence sera généré</li>
            <li>• L'offre commencera immédiatement</li> 
            </ul> 
          } 
            />
        </div>
        
        
        <DialogFooter className="pb-2">  
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleReopen}
            disabled={isLoading || !dateFin}
            type="submit"
          >
            {isLoading ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                Recréation...
              </>
            ) : (
              <>
                <RefreshCcw className="w-4 h-4 " />
                Recréer
              </>
            )}
          </Button>  
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReOpenOffreModal;