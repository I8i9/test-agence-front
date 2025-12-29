import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


const uploadGarageImagesApi = async ({payload , id}) => {
    const formData = new FormData();
    console.log("Payload for garage images upload:", payload);
    Object.keys(payload).forEach((key) => {
        if(payload[key]) {
            console.log(`Appending image for ${key}:`);
            formData.append(key, payload[key]);
        }
    });
    formData.append("id_garage", id); 
    const response = await mainapi.post(`/images/garageimages`, formData);

    return response.data;
}

export function useUploadGarageImages() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:  uploadGarageImagesApi,
        onError: (error) => {
            console.error("Error uploading garage images:", error);
            toast.error("Une erreur est survenue. Veuillez réessayer.");
        },
        onSuccess: (_,variables) => {
            const id_garage = variables.id;
            queryClient.invalidateQueries(['DetailGarage', id_garage]);
            console.log("Garage images uploaded successfully for garage ID:", id_garage);
        }
    });
}