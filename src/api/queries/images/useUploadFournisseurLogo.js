import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const uploadFournisseurLogo = async ({ logoFile, id_fournisseur }) => { // ✅ Destructure both
  const formData = new FormData();

  if (logoFile instanceof File) {
    formData.append("logo", logoFile); // The file
  }
  
  formData.append("id_fournisseur", id_fournisseur);
  

  const response = await mainapi.post("/images/fournisseurimage", formData);
  return response.data;
};

export const useUploadFournisseurLogo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: uploadFournisseurLogo,
    onSuccess: (data) => {
      // Invalidate fournisseurs list to refresh with new logo
      queryClient.invalidateQueries(['fournisseurs']); 
      return data;
    },
    onError: (error) => {
      console.error("Error uploading fournisseur logo:", error);
      toast.error("Erreur lors du téléchargement du logo. Veuillez réessayer.");
    }
  });
};