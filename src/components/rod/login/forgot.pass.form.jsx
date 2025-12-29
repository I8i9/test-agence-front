import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,} from '@/components/ui/form';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {ArrowLeft} from "lucide-react";
import { useGetOtp } from '../../../api/queries/auth/useGetOtp';
import { Loader2 } from "lucide-react"; // Assuming you have a Loader2 icon in your project
import { useEffect } from 'react';

const FormForgotPass = (props) => {
    const ForgotPassSchema = z.object({
        email: z.string().min(1, "L’adresse e-mail est requise").email("L’adresse e-mail n’est pas valide"),
    });

    const ForgotPassForm = useForm({
        resolver: zodResolver(ForgotPassSchema),
        defaultValues: {
            email: '',
        },
    });

    // Use the custom hook to get the OTP
    const { mutate: getOtp,data, isPending , isSuccess} = useGetOtp();

    const HandleSubmit = ({email}) => {
        getOtp(email);
    }

    // Set the email in the parent component
    useEffect(() => {
        if (isSuccess) {
            // data = res , data.data = res.data , res.data.data = {email: ""}
            console.log("OTP sent successfully:", data.data.data.email);
            props.setEmail(data.data.data.email);
            props.setCurrentForm('otp'); // Navigate to the OTP form
        }
    }, [isSuccess]);

    return (
        <div className='w-[65%] max-w-[576px] laptop:space-y-6 desktop:space-y-8 desktop-lg:space-y-16 desktop-xl:space-y-16 space-y-6 flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2 items-center'>
                <h1 className="text-3xl font-semibold">Mot de passe oublié</h1>
                <h2 className="text-gray-500">Saisissez votre e-mail pour recevoir un code de vérification</h2>
            </div>
            <Form {...ForgotPassForm} >
                <form onSubmit={ForgotPassForm.handleSubmit(HandleSubmit)} className="space-y-4 w-full ">
                    <FormField
                        control={ForgotPassForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    <Label htmlFor="Idemail">Email</Label>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        id="Idemail"
                                        placeholder="Enter your email"
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending} className="w-full mt-4">
                        
                        {isPending ? <>Envoi en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Envoyer le code de vérification"}
                    </Button> 
                </form> 
            </Form>
            <div className="w-full flex justify-between items-center laptop:-mt-2 desktop:-mt-4 desktop-lg:-mt-12 desktop-xl:-mt-12 -mt-6">
                   <Button  onClick={()=>{props.setCurrentForm('login')}} variant="ghost" className="w-full">
                        <ArrowLeft className="inline mr-2" />
                        Retour à la connexion
                    </Button>
            </div>
        </div>
    );
}

export default FormForgotPass;
