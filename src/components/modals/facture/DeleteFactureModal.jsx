import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useDeleteFacture } from "../../../api/queries/facture/useDeleteFacture"; // Adjust the import path as needed

export const DeleteFactureModal = ({ open, data, close }) => {
    const [seq, setSeq] = useState("");
    const { mutate: deleteMutate, isPending, isSuccess } = useDeleteFacture();
    
    const handleSubmit = () => {
        if (data?.id) {
            deleteMutate(data.id);
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setSeq(""); // Reset the input
            close();
        }
    }, [isSuccess, close]);

    // Reset seq when modal closes
    useEffect(() => {
        if (!open) {
            setSeq("");
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="pb-2 pt-5 px-6 w-[650px]">
                <DialogHeader>
                    <DialogTitle>
                        <div className="w-full flex items-center gap-2">
                            <span className="p-1.5 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="text-red-600 size-5 desktop-lg:size-6" strokeWidth={2} />
                            </span>
                            <span className="text-base text-red-600">Supprimer la facture</span>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer définitivement la facture <strong>{data?.sequence}</strong> ? Cette action est irréversible.
                    </DialogDescription>
                    <Separator />
                </DialogHeader>

                <form id="delete-facture-form" onSubmit={handleSubmit} className="space-y-6 py-3">
                    <div>
                        <Label className="block text-sm font-medium mb-2">
                            Confirmer la suppression
                        </Label>
                        <Input
                            type="text"
                            value={seq}
                            onChange={(e) => setSeq(e.target.value)}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Pour confirmer la suppression, veuillez saisir la référence de la facture : <strong>{data?.sequence}</strong>
                        </p>
                    </div>

                    <DialogFooter className="w-full pt-2">
                        <Button type="button" variant="outline" onClick={close} disabled={isPending}>
                            Annuler
                        </Button>
                        <Button 
                            form="delete-facture-form" 
                            type="submit" 
                            variant="destructive" 
                            disabled={isPending || seq !== data?.sequence} 
                            className="flex items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    Suppression en cours...
                                    <Loader2 className="text-mute-foreground animate-spin" />
                                </>
                            ) : (
                                "Supprimer définitivement"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};