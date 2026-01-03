
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { MailCheck } from "lucide-react"
import { useStore } from "../../../store/store"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form ,FormField , FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useGet2faDisableOtp } from "../../../api/queries/2fa/useGet2faDisableOtp"
import { Eye, EyeOff } from "lucide-react"
import { Input } from '@/components/ui/input';


const Disable2FA = (props) => {
    const [blocked , setBlocked] = useState(false);
    const { mutate: getOtpDisable, isPending } = useGet2faDisableOtp({enabled: !blocked});
    const [error , setError] = useState(null);
    const [numberOfTries, setNumberOfTries] = useState(null);
    console.log("blocked state : ", props);


    const ResetPassSchema = z.object({
        password: z.string()
            .min(6, "Le mot de passe doit comporter au moins 6 caractères")
            .max(20, "Le mot de passe doit comporter au maximum 20 caractères")
    });

    const ResetPassForm = useForm({
        resolver: zodResolver(ResetPassSchema),
        defaultValues: {
            password: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    
    const user = useStore((state) => state.user)

    const HandleSubmit = ({password}) => {
        // You can store the password in a state or context to use it in the OTP form
        getOtpDisable({ password_agent : password }
            , {
                onSuccess: () => {
                    console.log("password to 1111 2fa : ", password);
                    props.setPassword(password);
                    console.log("password to disable 2fa : ", password);
                    props.setCurrentForm('otp2fadisable');
                    
                },
                onError: (data) => {

                     // get the remaining tries from headers
                    const retryLimit = data?.response?.headers['ratelimit-remaining'];
                    setNumberOfTries(retryLimit ?? null);
                    
                    if (data?.response?.status === 429) {
                        setBlocked(true);
                    }

                    else if(data?.response?.status === 400){
                        setError(data?.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
                    }
                }

            }
         );
    }
        

  return (
    <Card className="shadow-none "> 
        <CardContent className="py-2 flex flex-col items-center">
            <div className="p-3 bg-green-100 rounded-md flex items-center justify-center">
                <MailCheck className="w-6 h-6 text-green-500 " />
            </div>
            <h2 className="text-lg font-medium mt-4">
                Authentifaction à deux facteurs activée
            </h2>
            <p className="text-gray-500 mt-2 text-center">
                pour désactiver l'authentification à deux facteurs, veuillez taper votre mot de passe et recevoir un code de vérification à votre adresse e-mail.
            </p>

            <div className="py-2 px-4 w-full bg-rod-foreground flex flex-col  mt-4 rounded-sm">
                <span className="text-gray-600">Email de destination :</span>
                <span > {user.email}</span>
            </div>

             <Form {...ResetPassForm} >
                <form id="disable2faform" onSubmit={ResetPassForm.handleSubmit(HandleSubmit)} className="space-y-7 mt-6 w-full">
                    <FormField
                        control={ResetPassForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="Idpassword">Nouveau mot de passe</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                        {...field}
                                        id="Idpassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Entrez votre mote de passe"
                                        className="w-full"
                                    />
                                        <Button
                                            variant="icon"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-0 top-1/2 -translate-y-1/2"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>
                                </FormControl>
                                {
                                    numberOfTries !== null && numberOfTries <=3 && numberOfTries > 0 ? <p className="text-red-500 text-sm leading-loose ">Il vous reste {numberOfTries} tentative(s).</p> : 

                                    error ? <p className="text-red-500 text-sm leading-loose ">{error}</p> : <FormMessage />
                                }
                                
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            

            <Button disabled={isPending} form="disable2faform" className="w-full mt-6">
                    {isPending ? <>Envoi en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Envoyer le code de vérification"}
            </Button>

        </CardContent>

    </Card>
  )
}

export default Disable2FA