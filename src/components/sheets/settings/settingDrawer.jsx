
import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useStore } from "../../../store/store";
import { useUpdateGap } from "../../../api/queries/profile/useUpdateGap";


export function DrawerSettings(props) {

  const user = useStore(state => state.user)
  const setUser = useStore(state => state.setUser)
  const [gap, setGap] = React.useState(user?.threshold || 2);
  const {mutate: updateGap , isPending} = useUpdateGap()

  React.useEffect(() => {
    setGap(user?.threshold || 2)
  }, [props.open])

  const handleAppend = () => {
    // if gap is less than 60 then increase by 15
    // if it increases more than 60 increase to 60
    // limit is 1440 (24 hours)
    if (gap < 60) {
      setGap(Math.min(60, gap + 10));
    } else {
      setGap(Math.min(1440, gap + 60));
    }
  }

  const handleReduce = () => {
    // if gap is less than or equal to 60 decrease by 15
    // if it decreases more than 60 decrease to 60
    // limit is 15 minutes (0 hours)
    if (gap <= 60) {
      setGap(Math.max(10, gap - 10));
    } else {
      setGap(Math.max(60, gap - 60));
    }
  }

  const getImpactMessage = (hours) => {
    if (hours < 10) return "Le minimum est de 2 heures.";
    if (hours > 1440) return "Le maximum est de 24 heures.";

    if (hours < 2 *60) {
      return "Délai insuffisant. Risque élevé de véhicules mal préparés et d’insatisfaction client.";
    }
   else if (hours <= 5 *60) {
      return "Délai très court. Maximise les réservations, mais augmente le risque d’un véhicule insuffisamment préparé.";
    }
    else if (hours <= 8*60 ) {
      return "Équilibre correct. Temps de préparation raisonnable tout en conservant un bon volume de réservations.";
    }
    else if (hours <= 12 * 60) {
      return "Délai confortable. Moins de réservations, mais préparation fiable et sans stress.";
    }
    else {
      return "Délai très large. Forte baisse du nombre de réservations, mais disponibilité et préparation toujours garanties.";
    }
  };

  const handleUpdate = () => {
    if (gap !== user?.threshold) {
      updateGap(gap
        ,
        {
          onSuccess: () => {
            setUser({...user, threshold: gap});
            props.onOpenChange();
          }
        }
      );
      
    }
  }

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle align="center">Heures entre locations</DrawerTitle>
            <DrawerDescription align="center">Temps entre deux locations sur le même véhicule</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 "
                onClick={() => handleReduce()}
                disabled={gap <= 10}
              >
                <Minus />
                <span className="sr-only">Diminuer</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {gap<60 ? `${gap}Min` : `${Math.floor(gap/60)}H`}
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 "
                onClick={() => handleAppend()}
                disabled={gap >= 1440}
              >
                <Plus />
                <span className="sr-only">Augmenter</span>
              </Button>
            </div>
            <div className="my-4 space-y-1 text-center border-x-2  rounded-md p-2 ">
                <span className="font-medium text-sm">Impact</span>
                <p className="text-sm text-muted-foreground">{getImpactMessage(gap)}</p>
            </div>
          </div>
          <DrawerFooter>
            <Button disabled={isPending || (gap === user?.threshold)} onClick={handleUpdate}>
              {
                isPending ? 'Sauvegarde...' : 'Sauvegarder'
              }
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Annuler</Button>
            </DrawerClose >
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
