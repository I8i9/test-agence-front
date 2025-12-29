import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const uploadFacturePhoto = async ({ images , id_depense }) => { // ✅ Destructure both
  const formData = new FormData();

  if (Array.isArray(images) && images.length > 0 ) {
    // Iterate through the array and append each file individually
    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });
  }
   
  formData.append("id_depense", id_depense);

  const response = await mainapi.post("/images/factureimage", formData);
  return response.data;
};

export const useUploadFacturePhoto = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadFacturePhoto,
    onSuccess: (data) => {
      // Invalidate factures list to refresh with new logo
      queryClient.invalidateQueries(['depenses']); 
      queryClient.invalidateQueries(['archiveDepenses']);
      return data;
    },
    onError: () => {
      toast.error("Erreur lors du téléchargement des images de dépense. Veuillez réessayer.");
    }
  });
};