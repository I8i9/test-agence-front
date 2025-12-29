import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pause, PlayCircle } from "lucide-react"
import useUpdateOfferStatus from "../../../api/queries/offre/useUpdateOfferStatus"
import { AlertRed } from "../../customUi/Alert"

// 🔸 Modal Suspendre
export const PauseOffreModal = ({ open, onClose, id, offerSequence }) => {
  const { mutate: updateOfferStatus , isPending } = useUpdateOfferStatus();
const handlePause = () => {
  updateOfferStatus(
    { id_offre: id, status_offre: "SUSPENDU" },
  )
}

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="w-full flex items-center gap-3">
              <span className="p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                <Pause className="w-5 h-5" />
              </span>
              <span className="text-lg font-semibold ">
                Voulez-vous suspendre cette offre ?
              </span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
             Si vous suspendez l'offre <span className="font-semibold">{offerSequence}</span>, elle ne sera plus visible par les clients.
              Vous pourrez la réactiver à tout moment.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full">
          <AlertDialogCancel disabled={isPending}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handlePause}
            disabled={isPending}
          >
            {isPending ? "Suspension..." : "Suspendre"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// 🔹 Modal Réactiver
export const ResumeOffreModal = ({ open, onClose, id, offerSequence , garageStatus}) => {
  const { mutate: updateOfferStatus , isPending } = useUpdateOfferStatus();

  const handleResume = async () => {
      updateOfferStatus({
        id_offre: id,
        status_offre: "ACTIVE"
      });
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="w-full flex items-center gap-3">
              <span className="p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                <PlayCircle className="w-5 h-5" />
              </span>
              <span className="text-lg font-semibold">
                Voulez-vous réactiver cette offre ?
              </span>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Si vous réactivez l'offre <span className="font-semibold">{offerSequence}</span>, elle redeviendra visible et disponible pour les clients immédiatement.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {garageStatus === 'EN_PANNE' && <AlertRed title="Attention !" description="Le Véhicule est en panne, vous ne pouvez pas réactiver cette offre." />}
        <AlertDialogFooter className="w-full">
          <AlertDialogCancel disabled={isPending}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleResume}
            disabled={isPending || garageStatus === 'EN_PANNE'}
          >
            {isPending ? "Réactivation..." : "Réactiver"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};