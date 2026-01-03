import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Mail } from 'lucide-react'
import { useStore } from "../../../store/store"
import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2 } from "lucide-react"; // Assuming you have a Loader2 icon
import { useEffect , useState } from 'react';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import { toast } from 'sonner'
import { useVerifyOtp2fa } from "../../../api/queries/2fa/useVerifyOtp";
import { useGet2faOtp } from "../../../api/queries/2fa/useGet2faOtp";




const Enable2faOtp = (props) => {
    const user = useStore((state) => state.user)
    const [numberOfTries, setNumberOfTries] = useState(1);

    const [timeOutResends, setTimeOutResends] = useState(0);
    const [canResend , setCanResend] = useState(true);
    const [blocked , setBlocked] = useState(false);


    const OTPFormSchema = z.object({
            otp: z.string()
                .min(1, "Le code est requis")
                .length(6, "Le code doit contenir exactement 6 caractères")
                .regex(/^[A-Z0-9]{6}$/, "Le code doit contenir uniquement des lettres majuscules ou des chiffres"),
        });
    
        const OTPForm = useForm({
            resolver: zodResolver(OTPFormSchema),
            defaultValues: {
                otp: '',
            },
        });
        
        const { mutate: verifyOtp, isPending } = useVerifyOtp2fa();

        const { mutate: getOtp, isPending : isGettingOtp} = useGet2faOtp({enabled : !blocked});
        

        const HandleSubmit = (data) => {
            verifyOtp({ otp: data.otp }, {
                onSuccess: () => {
                    props.setCurrentForm('enableFinish');
                    setNumberOfTries(1);
                },
                onError: () => {
                    setNumberOfTries(prev => prev + 1);
                }
            });
            
        }

        const handleResend = () => {
          getOtp({}
            , {
                onSuccess: () => {

                    setTimeOutResends(60);
                    toast.success("Un nouveau code a été envoyé à votre adresse e-mail "+ user.email+".");
                    setNumberOfTries(1);
                    
                },
                onError: (data) => {
                    // get from headers if banned or not
                    console.log(data);
                    if (data.response && data.response.status === 429) {
                        setBlocked(true);
                    }
                }
                
            }
          );
        }


        useEffect(() => {
            if (timeOutResends > 0) {
                setCanResend(false);
                const timer = setInterval(() => {
                setTimeOutResends(prev => prev - 1);
                }, 1000);

                return () => clearInterval(timer);
            } else {
                setCanResend(true);
            }
        }, [timeOutResends]);

    
  return (
    <Card className="shadow-none ">
        <CardContent className="py-2 flex flex-col items-center">
            <div className="p-3 bg-amber-100 rounded-md flex items-center justify-center">
                <Mail className="w-6 h-6 text-amber-500 " />
            </div>
            <h2 className="text-lg font-medium mt-4">
                Vérification du code
            </h2>
            <p className="text-gray-500 mt-2 leading-tight text-center flex flex-col items-center">
                Saisissez le code de vérification envoyé à<br />
                {user.email}
            </p>

            <Form {...OTPForm} >
                <form onSubmit={OTPForm.handleSubmit(HandleSubmit)} className="mt-4 w-full">
                    <FormField
                        control={OTPForm.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem className="w-full flex flex-col items-center gap-4">
                                <FormLabel >Code de vérification</FormLabel>
                                <FormControl>
                                    <InputOTP
                                              maxLength={6} 
                                              value={field.value}
                                              onChange={field.onChange}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                        </InputOTPGroup>
                                        <InputOTPSeparator />
                                        <InputOTPGroup>
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                        </InputOTP>
                                </FormControl>
                                {
                                    
                                    numberOfTries > 1 && numberOfTries <= 5 ?
                                        <span className="text-red-500 text-sm flex flex-col items-center leading-loose  -mt-2">
                                             Code invalide, il vous reste {6 - numberOfTries} tentatives.
                                        </span>
                                    :
                                    numberOfTries > 5 ? 
                                        <div className="text-red-500 text-sm flex flex-col items-center leading-loose">
                                            Vous avez dépassé le nombre maximum de tentatives.
                                        </div> 
                                        :

                                        <FormMessage />

                                    
                                }
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending || numberOfTries>5} className="w-full mt-8">
                          {isPending ? <>Vérification en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Vérifier le code"}
                    </Button>
                </form>
            </Form>

            <Button onClick= {handleResend } variant="link" className="w-full" disabled={!canResend || isGettingOtp || blocked}>
                        
              Renvoyer le code {timeOutResends > 0 && `(${timeOutResends}s)`} {isGettingOtp && <Loader2 className="text-mute-foreground animate-spin"/>}
            </Button>

        </CardContent>

    </Card>
  )
}

export default Enable2faOtp