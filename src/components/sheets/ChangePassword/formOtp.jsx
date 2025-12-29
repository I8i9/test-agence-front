import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Mail } from 'lucide-react'
import { useStore } from "../../../store/store"
import { Button } from "@/components/ui/button"
import { useVerifyOtp } from '../../../api/queries/auth/useVerifyOtp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2 } from "lucide-react"; // Assuming you have a Loader2 icon
import { useEffect , useState } from 'react';
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from '@/components/ui/form';
import { useGetOtp } from '../../../api/queries/auth/useGetOtp'
import { toast } from 'sonner'




const FormOtpChangePassowrd = (props) => {
    const user = useStore((state) => state.user)

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
        
        const { mutate: verifyOtp,isPending, isSuccess } = useVerifyOtp();

        const { mutate: getOtp} = useGetOtp();
        

        const HandleSubmit = (data) => {
            verifyOtp({ otp: data.otp, email: user.email });
            setNumberOfTries(prev => prev + 1);
        }

        const handleResend = () => {
          getOtp(user.email);
          toast.success("Un nouveau code a été envoyé à votre adresse e-mail "+ user.email+".");
          setNumberOfTries(1);
        }

        const [numberOfTries, setNumberOfTries] = useState(1);

    
        useEffect(() => {
            if (isSuccess) {
                // Navigate to the reset password form
                props.setCurrentForm('resetPassword');
            }
        }, [isSuccess]);  

    
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
                                    numberOfTries > 2 && numberOfTries <= 5 ?
                                        <span className="text-red-500 text-sm flex flex-col items-center leading-loose  -mt-2">
                                            il vous reste {6 - numberOfTries} tentatives.
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

            <Button onClick= {handleResend} variant="link" className="w-full">
              Renvoyer le code
            </Button>

        </CardContent>

    </Card>
  )
}

export default FormOtpChangePassowrd