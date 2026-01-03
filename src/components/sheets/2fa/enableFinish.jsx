import { Check } from 'lucide-react'
import {    
    Card,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRefresh } from '../../../api/queries/auth/useRefresh';

const FinishEnable = (props) => {
    const {mutate : refresh} = useRefresh();
    
  return (
    <Card className="shadow-none ">
        <CardContent className="py-2 flex flex-col items-center">
            <div className="p-3 bg-green-100 rounded-md flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500 " />
            </div>
            <h2 className="text-lg font-medium mt-4">
                Authentification à deux facteurs activée !
            </h2>
            <p className="text-gray-500 mt-2 leading-tight text-center flex flex-col items-center">
                L'authentification à deux facteurs a été activée avec succès. Vous pouvez maintenant utiliser cette méthode pour sécuriser votre compte.
            </p>

            <Button onClick={() => { props.onOpenChange(false); refresh(); }} className="w-full mt-8">
                Terminé
            </Button>

        </CardContent>

    </Card>
  )
}

export default FinishEnable