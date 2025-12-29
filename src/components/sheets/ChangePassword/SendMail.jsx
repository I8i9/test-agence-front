
import {
    Card,
    CardContent,
    CardAction,
    CardFooter,
} from "@/components/ui/card"
import { Send } from "lucide-react"
import { useStore } from "../../../store/store"
import { Button } from "@/components/ui/button"
import { useGetOtp } from "../../../api/queries/auth/useGetOtp"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

const SendMailChangePassword = (props) => {
    const { mutate: getOtp, isPending , isSuccess} = useGetOtp();

    const user = useStore((state) => state.user)

    const handleClick = () => {
        getOtp(user.email);
    }

    useEffect(() => {
        if (isSuccess) {
            // Navigate to the OTP form
            props.setCurrentForm('otp');
        }
    }, [isSuccess]);
        

  return (
    <Card className="shadow-none "> 
        <CardContent className="py-2 flex flex-col items-center">
            <div className="p-3 bg-blue-100 rounded-md flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-500 " />
            </div>
            <h2 className="text-lg font-medium mt-4">
                Code de vérification
            </h2>
            <p className="text-gray-500 mt-2 text-center">
                Un code de vérification a été envoyé à votre adresse e-mail. Veuillez le saisir pour continuer.
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

export default SendMailChangePassword