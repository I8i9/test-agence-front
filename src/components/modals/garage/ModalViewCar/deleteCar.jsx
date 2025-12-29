
import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CarIcon , Trash2  } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useDeleteGarage } from '../../../../api/queries/garage/useDeleteGarage';




export const DeleteCar = ({id,matricule,name,setOpenModal}) => {


  const {mutate : deleteGarage , isPending } = useDeleteGarage();

  const handleSubmit=(e)=>{
    e.preventDefault();
    deleteGarage(id,{
      onSuccess:()=>{
        setOpen(false);
        setOpenModal();
      }
    });
  }
  const [open, setOpen] = useState(false);
  const [matri,setMatri] = useState("");

return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
            <Trash2 className="mb-0.75" />
            Désactiver
        </Button>
      </DialogTrigger>

      <DialogContent className="pb-2 pt-5 px-6 w-[650px]">
        <DialogHeader>
          <DialogTitle>
        <div className="w-full flex items-center gap-2">
  <span className="p-1.5 bg-red-100 rounded-full flex items-center justify-center">
    <CarIcon className="text-red-600 size-5 desktop-lg:size-6" strokeWidth={2} />
  </span>
  <span className="text-base text-red-600">Supprimer le véhicule de la flotte ?</span>
</div>
          </DialogTitle>
          <DialogDescription className=' pb-1 leading-tight'>
            Vous êtes sur le point de supprimer définitivement ce véhicule de votre flotte.
          </DialogDescription>
          <Separator />
        </DialogHeader>


          <form id="delete-car-garage-form" onSubmit={handleSubmit} className="space-y-6 py-3">
            <div>
                <Label className="block text-sm font-medium mb-2">Confirmer la suppression</Label>
                <Input
                    type="text"
                    value={matri}
                    onChange={(e) => {
                        const inputValue = e.target.value;
                        // Replace 'tu' (case-insensitive) with 'TU'
                        const transformed = inputValue.replace(/tu/gi, 'TU');
                        setMatri(transformed);
                    }}
                />
                <p className="text-sm text-muted-foreground mt-2">
                    Tapez la matricule <span className="font-medium">{matricule}</span> de la véhicule <span className="font-medium">{name}</span> pour confirmer la suppression
                </p>

            </div>

            <DialogFooter className="w-full pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button form="delete-car-garage-form" type="submit" variant="destructive" disabled={isPending || matri !== matricule} className="flex items-center gap-2">
                {isPending ? <>Suppression en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Supprimer définitivement"}

              </Button>
            </DialogFooter>
          </form>

      </DialogContent>
    </Dialog>
  );
};