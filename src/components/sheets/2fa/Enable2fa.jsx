
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { MailX } from "lucide-react"
import { useStore } from "../../../store/store"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useGet2faOtp } from "../../../api/queries/2fa/useGet2faOtp"

const Enable2FA = (props) => {
    const { mutate: getOtp, isPending , isSuccess} = useGet2faOtp();

    const user = useStore((state) => state.user)

    const handleClick = () => {
        getOtp();
    }

    useEffect(() => {
        if (isSuccess) {
            // Navigate to the OTP form
            props.setCurrentForm('otp2fa');
        }
    }, [isSuccess]);
        

  return (
    <Card className="shadow-none "> 
        <CardContent className="py-2 flex flex-col items-center">
            <div className="p-3 bg-red-100 rounded-md flex items-center justify-center">
                <MailX className="w-6 h-6 text-red-500 " />
            </div>
            <h2 className="text-lg font-medium mt-4">
                Authentifaction à deux facteurs désactivée
            </h2>
            <p className="text-gray-500 mt-2 text-center">
                Activer l'authentification à deux facteurs pour mieux sécuriser votre compte.
            </p>

            <div className="py-2 px-4 w-full bg-rod-foreground flex flex-col  mt-4 rounded-sm">
                <span className="text-gray-600">Email de destination :</span>
                <span > {user.email}</span>
            </div>

            <Button disabled={isPending} onClick={handleClick} className="w-full mt-8">
                    {isPending ? <>Envoi en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Envoyer le code de vérification"}
            </Button>

        </CardContent>

    </Card>
  )
}

export default Enable2FA