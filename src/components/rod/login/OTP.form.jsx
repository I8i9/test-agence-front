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
import { Loader2 } from "lucide-react"; // Assuming you have a Loader2 icon in your project
import { useEffect , useState } from 'react';  
import { toast } from 'sonner';

const FormOTP = ({ email, setEmail, setCurrentForm, type = 'forgotPassword', onVerifySuccess, resendOtpAction }) => {
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
    
    // We expect the parent to pass the mutation/function to handle verification
    const { mutate: verifyOtp, isPending, isSuccess } = onVerifySuccess;

    const HandleSubmit = (data) => {
        if (numberOfTries <= 5) {
            setNumberOfTries(prev => prev + 1);
            // Dynamic payload: 2FA usually only needs OTP, Forgot Pass needs Email + OTP
            const payload = type === '2fa' ? { otp: data.otp } : { otp: data.otp, email };
            verifyOtp(payload);
        }
    } 

    const HandleResendOtp = () => {
        resendOtpAction();
        setNumberOfTries(1);
        toast.success("Un nouveau code a été envoyé à votre adresse e-mail "+ email+".");
    }

    useEffect(() => {
        if (isSuccess) {
            if (type === 'forgotPassword') {
            // Navigate to the reset password form
            setCurrentForm('resetPassword');
            }
        }
    }, [isSuccess]);  

    return (
        <div className='w-[65%] max-w-[576px] laptop:space-y-6 desktop:space-y-8 desktop-lg:space-y-16 desktop-xl:space-y-16 space-y-6 flex flex-col items-center justify-center'>
            
            <div className='flex flex-col gap-2 items-center'>
                <h1 className="text-3xl font-semibold">{type === '2fa' ? "Authentification" : "Mot de passe oublié"}</h1>
                <h2 className="text-gray-500">Saisissez le code à 6 chiffres envoyé à {email}</h2>
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
                { type === 'forgotPassword' && <Button onClick={()=>{ setEmail(null); setCurrentForm("forgotPassword");}} variant="ghost" className="w-full">

                    <ArrowLeft className="inline mr-2" />   
                    Retour à l’email
                </Button>
                }
                { type === '2fa' && <Button onClick={()=>{ setEmail(null); setCurrentForm("login");}} variant="ghost" className="w-full">
                    <ArrowLeft className="inline mr-2" />   
                    Retour à la connexion
                </Button>
                }
            </div>
        </div>
    );

}

export default FormOTP;