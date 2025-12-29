import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Ellipsis, Eye, Percent, Trash, ChartNoAxesGantt ,Tag, X, CirclePause , PlayCircle, RefreshCcw, XCircle } from 'lucide-react'
import DetailOffreModal from '../../modals/offre/DetailOffreModel/DetailOffreModal'
import CreatePromoModal from '../../modals/offre/CreatePromoModal'
import { Button } from "@/components/ui/button"
import { DeletePromoModal } from '../../modals/offre/DeletePromoModal'
import OffrePlanModal from '../../modals/offre/OffrePlanModal/OffrePlanModal'
import {DeleteOffreModal} from './../../modals/offre/DeleteOffreMadal'
import ReOpenOffreModal from '../../modals/offre/ReOpenOffreModal'
import { PauseOffreModal,ResumeOffreModal } from '../../modals/offre/PauseResumeOffreModal'

const OffreActions = ({ id, offerData }) => {
  const [isDetailOffreOpen, setIsDetailOffreOpen] = useState(false)
  const [isDeletePromoOpen, setIsDeletePromoOpen] = useState(false)
  const [isCreatePromoOpen, setIsCreatePromoOpen] = useState(false)
  const[isPauseModal,setIsPauseModal]=useState(false)
  const [isPlanOpen, setIsPlanOpen] = useState(false)
  const [isDeleteOffreOpen, setIsDeleteOffreOpen] = useState(false)
  const [isResumeModal, setIsResumeModal] = useState(false) 
  const [isReOpenModal, setIsReOpenModal] = useState(false)

  const openReOpenModal = () => setTimeout(() =>setIsReOpenModal(true),200)
  const closeReOpenModal = () => setIsReOpenModal(false)

  const openResumeModal = () => setTimeout(() => setIsResumeModal(true), 200)
  const closeResumeModal = () => setIsResumeModal(false)


  const openPauseModal = () => setTimeout(() => setIsPauseModal(true), 200)
  const closePauseModal = () => setIsPauseModal(false)

  const openDetailOffreModal = () => setTimeout(() => setIsDetailOffreOpen(true), 200)
  const closeDetailOffreModal = () => setIsDetailOffreOpen(false)

  const openDeletePromoModal = () => setTimeout(() => setIsDeletePromoOpen(true), 200)
  const closeDeletePromoModal = () => setIsDeletePromoOpen(false)

  const openCreatePromoModal = () => setTimeout(() => setIsCreatePromoOpen(true), 200)
  const closeCreatePromoModal = () => setIsCreatePromoOpen(false)

  const openPlanModal = () => setTimeout(() => setIsPlanOpen(true), 200)
  const closePlanModal = () => setIsPlanOpen(false)

  const openDeleteOffreModal = () => setTimeout(() => setIsDeleteOffreOpen(true), 200)
  const closeDeleteOffreModal = () => setIsDeleteOffreOpen(false) 
  
  const canPauseOffre = offerData?.status === 'En cours';
  const canResumeOffre = offerData?.status === 'Suspendu' ;
  const canCreatePromo = !offerData?.promo && offerData?.status === 'En cours';
  const canDeletePromo = !!offerData?.promo && offerData?.status === 'En cours';
  const canSeePlan = offerData?.status !== 'Terminée';
  const canReopenOffre = offerData?.canreopen;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="[&>svg]:!h-5 [&>svg]:!w-5">
          <Ellipsis  />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent collisionPadding={32} avoidCollisions={true}>
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-base cursor-pointer" onClick={openDetailOffreModal}>
            <div className="flex items-center gap-3 leading-none">
              <Eye /><span>Détails</span>
            </div>
          </DropdownMenuItem>
          {canPauseOffre &&
           <DropdownMenuItem className="text-base cursor-pointer" onClick={openPauseModal}>
            <div className="flex items-center gap-3 leading-none">
              <CirclePause /><span>Suspendre</span>
            </div>
          </DropdownMenuItem>}
          {canResumeOffre &&
           <DropdownMenuItem className="text-base cursor-pointer" onClick={openResumeModal}>
            <div className="flex items-center gap-3 leading-none">
              <PlayCircle  /><span>Réactiver</span>
            </div>
          </DropdownMenuItem>
          }
          {canSeePlan &&
          <DropdownMenuItem className="text-base  cursor-pointer" onClick={openPlanModal}>
            <div className="flex items-center gap-3 leading-none">
              <ChartNoAxesGantt /><span>Planification</span>
            </div>
          </DropdownMenuItem>
          }
          {canReopenOffre &&
          <DropdownMenuItem className="text-base  cursor-pointer" onClick={openReOpenModal}>
            <div className="flex items-center gap-3 leading-none">
              <RefreshCcw /><span>Recréer</span>
            </div>
          </DropdownMenuItem>
          }

          {
            canSeePlan &&
            <DropdownMenuItem className="text-base  cursor-pointer " onClick={openDeleteOffreModal}>
            <div className="flex items-center gap-3 leading-none   text-destructive">
              <Trash className='text-destructive' /><span>Supprimer</span>
            </div>
          </DropdownMenuItem>
          }
          
        </DropdownMenuGroup>

        {
          (canCreatePromo || canDeletePromo) && <DropdownMenuSeparator />
        }

       {canDeletePromo ? (
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-base cursor-pointer"
                  onClick={openDeletePromoModal}
                >
                  <div className="flex items-center gap-3 leading-none text-destructive">
                    <XCircle className="text-destructive" />
                    <span>Retirer la promo</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
          ) : (
            canCreatePromo && (
            
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-base cursor-pointer"
                  onClick={openCreatePromoModal}
                >
                  <div className="flex items-center gap-3 leading-none">
                    <Percent />
                    <span>Créer une promo</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )
          )}

</DropdownMenuContent>
  
  {/* All modals now conditionally rendered */}
      {isReOpenModal && (
        <ReOpenOffreModal
          open={isReOpenModal}
          onClose={closeReOpenModal}
          id={id}
          offerSequence={offerData?.sequence_offre}
        />
      )}

      {isPauseModal && (
          <PauseOffreModal
            open={isPauseModal}
            onClose={closePauseModal}
            id={id}
            offerSequence={offerData?.sequence_offre}
          />
        )}

      {isResumeModal && (
        <ResumeOffreModal 
          open={isResumeModal}
          onClose={closeResumeModal}
          id={id}
          offerSequence={offerData?.sequence_offre}
          garageStatus={offerData?.garage.status_garage}
        />
      )}


      {/* Modals */}
    { isPlanOpen &&
      <OffrePlanModal 
        open={isPlanOpen}
        onClose={closePlanModal}
        OffreId={id}
        offerData={offerData}
      />
    }  
   { isDetailOffreOpen &&
      <DetailOffreModal
        open={isDetailOffreOpen}
        onClose={closeDetailOffreModal}
        id={id}
        badge = {offerData?.badge}
      /> }
      {isCreatePromoOpen && (
        <CreatePromoModal
          open={isCreatePromoOpen}
          onClose={closeCreatePromoModal}
          id={id}
          debutoffre={offerData?.date_debut_offre}
          finoffre={offerData?.date_fin_offre}
          sequence={offerData?.sequence_offre}
        />
      )}

      {isDeletePromoOpen && (
        <DeletePromoModal
          open={isDeletePromoOpen}
          onClose={closeDeletePromoModal}
          sequence={offerData?.promo.sequence_promo}
          id={offerData?.promo.id_promo}
        />
      )}

      {isDeleteOffreOpen && (
        <DeleteOffreModal 
          demandesCount={12}
          open={isDeleteOffreOpen}
          id={offerData?.id_offre}
          offerSequence={offerData?.sequence_offre}
          onClose={closeDeleteOffreModal}
        />
      )}
    </DropdownMenu>
  )
}

export default OffreActions
