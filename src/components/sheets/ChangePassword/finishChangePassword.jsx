import { Check } from 'lucide-react'
import {    
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Finish = (props) => {
  return (
    <Card className="shadow-none ">
        <CardContent className="py-2 flex flex-col items-center">
            <div className="p-3 bg-green-100 rounded-md flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500 " />
            </div>
            <h2 className="text-lg font-medium mt-4">
                Mot de passe modifié avec succès !
            </h2>
            <p className="text-gray-500 mt-2 leading-tight text-center flex flex-col items-center">
                Votre mot de passe a été mis à jour. Vous pouvez maintenant utiliser votre nouveau mot de passe pour vous connecter.
            </p>

            <Button onClick={() =>props.onOpenChange(false)} className="w-full mt-8">
                Terminé
            </Button>

        </CardContent>

    </Card>
  )
}

export default Finish