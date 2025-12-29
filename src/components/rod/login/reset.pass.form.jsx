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
import { useForm } from 'react-hook-form'; 
import { Eye, EyeOff ,ArrowLeft,Loader2 } from "lucide-react";
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useResetPassword } from '../../../api/queries/auth/useResetPassword'; // Assuming you have a mutation function for resetting the password

const FormResetPass = (props) => {
    const ResetPassSchema = z.object({
        password: z.string()
            .min(6, "Le mot de passe doit comporter au moins 6 caractères")
            .max(20, "Le mot de passe doit comporter au maximum 20 caractères")
            .regex(
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={};':"\\|,.<>/?[\]]).{8,}$/,
                "Le mot de passe doit contenir au moins une majuscule, un chiffre et un symbole spécial"
            ),
        confirmPassword: z.string()
            .min(6, "La confirmation du mot de passe est requise")
            .max(20, "La confirmation du mot de passe doit comporter au maximum 20 caractères"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: "Les mots de passe ne correspondent pas",
    });

    const ResetPassForm = useForm({
        resolver: zodResolver(ResetPassSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const { mutate: resetPassword , isPending , isSuccess  } = useResetPassword() ; // Assuming you have a mutation function for resetting the password

    // Handle form submission
    const HandleSubmit = ({password}) => {
        resetPassword( password )
    }

    // return to login form
    useEffect(() => {
        if (isSuccess) {
            props.setEmail(null); // Clear the email after successful reset
            props.setCurrentForm('login'); // Navigate back to the login form
        }
    }, [isSuccess]);

    

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='w-[65%] max-w-[576px] laptop:space-y-6 desktop:space-y-8 desktop-lg:space-y-16 desktop-xl:space-y-16 space-y-6 flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2 items-center'>
                <h1 className="text-3xl font-semibold">Réinitialiser le mot de passe</h1>
                <h2 className=" text-gray-500">Saisissez votre nouveau mot de passe</h2>
            </div>
            <Form {...ResetPassForm} >
                <form onSubmit={ResetPassForm.handleSubmit(HandleSubmit)} className="space-y-7 w-full">
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={ResetPassForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="Idconfirmpassword">Confirmer mote de passe</FormLabel>
                                <FormControl>
                                    
                                    <div className="relative"> 
                                    <Input
                                        {...field}
                                        id="Idconfirmpassword"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Confirmez le mot de passe"
                                        className="w-full"
                                    /> 
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isPending} className="w-full mt-4">
                         {isPending ? <>Mise à jour en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :"Mettre à jour le mote de passe"}
                    </Button>
                </form>
            </Form>
            <div className="w-full flex justify-between items-center laptop:-mt-2 desktop:-mt-4 desktop-lg:-mt-12 desktop-xl:-mt-12 -mt-6"> 
                <Button onClick={()=>{props.setEmail(null);props.setCurrentForm("login");}} variant="ghost" className="w-full">

                    <ArrowLeft className="inline mr-2" />   
                    Annuler
                </Button>
            </div>
        </div>
    );
}

export default FormResetPass;