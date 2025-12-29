import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Eye, Trash2 , Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
// import DetailFournisseurModal from "../../modals/fournisseur/DetailFournisseurModal";
import DeleteFournisseurModal from "../../modals/client/DeleteFournisseurModal";
import UpdateFournisseurModal from "../../modals/client/UpdateFournisseurModal";
import DetailFournisseurModal from "../../modals/client/DetailFournisseurModal/DetailFournisseurModal";

const FournisseurActions = ({ fournisseurData }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDetailModal = () => setTimeout(() => setIsDetailModalOpen(true), 200);
  const openUpdateModal = () => setTimeout(() => setIsUpdateModalOpen(true), 200);
  const openDeleteModal = () => setTimeout(() => setIsDeleteModalOpen(true), 200);

  const closeDetailModal = () => setIsDetailModalOpen(false);
  const closeUpdateModal = () => setIsUpdateModalOpen(false);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="[&>svg]:!h-5 [&>svg]:!w-5">
          <Ellipsis className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent collisionPadding={32} avoidCollisions={true}>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-base py-2 px-2 cursor-pointer"
            onClick={openDetailModal}
          >
            <div className="flex items-center gap-4 leading-none">
              <Eye size={20} />
              <span>Détails</span>
            </div>
          </DropdownMenuItem>

           <DropdownMenuItem
            className="text-base py-2 px-2 cursor-pointer"
            onClick={openUpdateModal}
          >
            <div className="flex items-center gap-4 leading-none">
              <Pencil size={20} />
              <span>Modifier</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-base py-2 px-2 cursor-pointer"
            onClick={openDeleteModal}
          >
            <div className="flex items-center gap-4 leading-none">
              <Trash2 className="text-red-600" size={20} />
              <span className="text-red-600">Supprimer</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>

      {/* Modal Components - Uncomment when modals are created */}
      {isDetailModalOpen && (
        <DetailFournisseurModal
          open={isDetailModalOpen}
          onClose={closeDetailModal}
          fournisseur={fournisseurData}
        />
      )} 

      {isUpdateModalOpen && (
        <UpdateFournisseurModal
          open={isUpdateModalOpen}
          onClose={closeUpdateModal}
          id={fournisseurData.id_fournisseur}
          fournisseur={fournisseurData}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteFournisseurModal
          open={isDeleteModalOpen}
          onClose={closeDeleteModal}
          id={fournisseurData.id_fournisseur}
          fournisseurSequence={fournisseurData.nom_fournisseur}
        />
      )} 
    </DropdownMenu>
  );
};

export default FournisseurActions;