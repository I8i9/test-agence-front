import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import pdfapi from "../../axios/pdf.api";


async function downloadReportApi(payload) {
  try {
    const response = await pdfapi.get(`/facture/${payload.id}`, {
      responseType: "arraybuffer", // Change from "blob" to "arraybuffer"
      headers: { 
        Accept: "application/pdf",
      },
    });

    // Validate response
    if (!response?.data) {
      throw new Error("Aucune donnée reçue du serveur");
    }

    // Create blob from arraybuffer
    const blob = new Blob([response.data], { type: "application/pdf" });
    
    // Verify the blob is valid
    if (blob.size === 0) {
      throw new Error("Le fichier PDF est vide");
    }

    console.log("PDF Blob size:", blob.size, "bytes");

    const url = window.URL.createObjectURL(blob);

    // Extract filename
    const disposition = response.headers["content-disposition"];
    let filename = `facture-${payload.id}.pdf`;
    
    if (disposition) {
      const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch?.[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    if (payload.reference?.trim()) {
      filename = `${payload.reference.trim()}.pdf`;
    }

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);

    return { filename, success: true };
    
  } catch (error) {
    console.error("Download error:", error);
    throw error;
  }
}


export function useDownloadFacture() {
    return useMutation({
        mutationFn: downloadReportApi,
            onMutate: () => {
                toast.loading("Téléchargement en cours...");
            },
            onSuccess: () => {
                toast.dismiss();
                toast.success("Fichier téléchargé avec succès !");
            },
            onError: () => {
                toast.dismiss();
                toast.error(`Erreur lors du téléchargement du facture`);
            },
    });
}