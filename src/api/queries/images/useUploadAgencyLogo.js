import { useMutation } from "@tanstack/react-query";
import mainapi from "../../axios/main.api.js";
import {useStore} from '../../../store/store.js'

const uploadAgencyLogo = async (logoFile) => {
  const formData = new FormData();

  if (logoFile instanceof File) {
    formData.append("logo", logoFile);
  }

  const response = await mainapi.post("/images/agenceimage", formData);
  return response.data; 
};

export const useUploadAgencyLogo = () => {
  return useMutation({
    mutationFn: uploadAgencyLogo,
    onSuccess: (data) => {
      useStore.getState().setLogoPath(data.url);
    }
  });
};

