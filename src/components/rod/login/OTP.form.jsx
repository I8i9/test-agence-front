import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,} from '@/components/ui/form';
import {Button} from '@/components/ui/button';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useForm } from 'react-hook-form';
import { useVerifyOtp } from '../../../api/queries/auth/useVerifyOtp';
import { Loader2 , AlertCircleIcon} from "lucide-react"; // Assuming you have a Loader2 icon in your project
import { useEffect , useState } from 'react';
import { useGetOtp } from '../../../api/queries/auth/useGetOtp';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { toast } from 'sonner';

const FormOTP = (props) => {
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

    const [numberOfTries, setNumberOfTries] = useState(1);
    
    const { mutate: verifyOtp,isPending, isSuccess } = useVerifyOtp();
    const HandleSubmit = (data) => {
        if (numberOfTries <= 5) {
            setNumberOfTries(prev => prev + 1);
            verifyOtp({ otp: data.otp, email: props.email });
        }
    }

    // Handle resend OTP
    const { mutate: getOtp } = useGetOtp();

    const HandleResendOtp = () => {
        getOtp(props.email);
        setNumberOfTries(1);
        toast.success("Un nouveau code a été envoyé à votre adresse e-mail "+ props.email+".");
    }

    useEffect(() => {
        if (isSuccess) {
            // Navigate to the reset password form
            props.setCurrentForm('resetPassword');
        }
    }, [isSuccess]);  

    return (
        <div className='w-[65%] max-w-[576px] laptop:space-y-6 desktop:space-y-8 desktop-lg:space-y-16 desktop-xl:space-y-16 space-y-6 flex flex-col items-center justify-center'>
            
            <div className='flex flex-col gap-2 items-center'>
                <h1 className="text-3xl font-semibold">Mot de passe oublié</h1>
                <h2 className="text-gray-500">Saisissez le code à 6 chiffres envoyé à {props.email}</h2>
            </div>
            <Form {...OTPForm} >
                <form onSubmit={OTPForm.handleSubmit(HandleSubmit)} className="w-full">
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
                                            <button  onClick={HandleResendOtp} className="text-red-500 leading-none underline hover:text-red-600 cursor-pointer transition-all duration-300 ease-in-out">
                                                Envoyer un nouveau code
                                            </button>
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
            <div className="w-full flex justify-between items-center laptop:-mt-2 desktop:-mt-4 desktop-lg:-mt-12 desktop-xl:-mt-12 -mt-6"> 
                <Button onClick={()=>{props.setEmail(null);props.setCurrentForm("forgotPassword");}} variant="ghost" className="w-full">

                    <ArrowLeft className="inline mr-2" />   
                    Retour à l’email
                </Button>
            </div>
        </div>
    );

}

export default FormOTP;