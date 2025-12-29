import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card"
import { Check, UserPlus } from "lucide-react";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import {Form , FormItem, FormLabel, FormControl, FormMessage, FormField, FormDescription} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAddAccount } from "../../../api/queries/accounts/useAddAccount";
import { Loader2 ,Eye , EyeOff } from "lucide-react";
import { useState } from 'react';


const AddAccountForm = () => {
    const { mutate: addAccount, isPending } = useAddAccount();

    const AccountFormSchema = z.object({
        nom_agent: z.string()
            .min(1, "Le nom et prénom sont requis")
            .max(50, "Le nom et prénom doivent comporter au maximum 50 caractères"),
        email_login: z.string()
            .min(1, "L’adresse e-mail est requise")
            .email("L’adresse e-mail n’est pas valide"),
        password_login: z.string()
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
    .refine((data) => data?.password_login === data?.confirmPassword, {
        path: ['confirmPassword'],
        message: "Les mots de passe ne correspondent pas",
    });

    const AddAccountForm = useForm({
        resolver: zodResolver(AccountFormSchema),
        defaultValues: {
            nom_agent: '',
            email_login: '',
            password_login: '',
            confirmPassword: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    

    const handleAddAccount = (data) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...accountData } = data; // Exclude confirmPassword
    addAccount(accountData);
};


  return (
     <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
                    <CardHeader className="w-full px-0">
                      <CardTitle className='flex items-center gap-2'>
                        <UserPlus  size={24} className=''/>
                        <h2 className='text-xl font-medium  leading-tight'>Ajouter un autre compte</h2>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        <Form {...AddAccountForm} >
                            <form onSubmit={AddAccountForm.handleSubmit(handleAddAccount)} className="space-y-8  w-full">
                                <FormField
                                    control={AddAccountForm.control}
                                    name="nom_agent"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Nom et Prénom</FormLabel>
                                        <FormControl>   
                                            <Input
                                            type="text"
                                            placeholder="Ex : Mohamed Rhaiem"
                                            {...field}
                                            className="w-full"
                                            />
                                        </FormControl>
                                        {
                                            AddAccountForm.formState.errors.email ? 
                                            <FormMessage/>
                                            :
                                            <FormDescription>
                                             Indiquez le nom de compte.
                                            </FormDescription>
                                        }
                                        
                                        </FormItem>
                                    )}
                                    />
                                <FormField
                                    control={AddAccountForm.control}
                                    name="email_login"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Adresse Email</FormLabel>
                                        <FormControl>
                                            <Input
                                            type="text"
                                            placeholder="Ex : votre@email.com"
                                            {...field}
                                            className="w-full"
                                            />
                                        </FormControl>
                                        {
                                            AddAccountForm.formState.errors.email ? 
                                            <FormMessage/>
                                            :
                                            <FormDescription>
                                             Indiquez l’email de compte.
                                            </FormDescription>
                                        }
                                        
                                        </FormItem>
                                    )}
                                    />
                                <FormField
                                    control={AddAccountForm.control}
                                    name="password_login"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mot de passe</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="***************"
                                                    className="w-full"
                                                    {...field}
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
                                                AddAccountForm.formState.errors.password_login ? 
                                                <FormMessage/>
                                                :
                                                <FormDescription>
                                                    Indiquez mot de passe de compte
                                                </FormDescription>
                                            }
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={AddAccountForm.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmer le mot de passe</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="***************"
                                                    {...field}
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            {
                                                AddAccountForm.formState.errors.confirmPassword ? 
                                                <FormMessage/>
                                                :
                                                <FormDescription>
                                                    Confirmer le mot de passe de compte
                                                </FormDescription>
                                            }
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" disabled={isPending} className="w-full mt-4 flex gap-2 leading-snug">
                                    { isPending ? <>Ajout en cours...<Loader2 className="text-mute-foreground animate-spin"/></> : <><Check/> Ajouter le compte</>}
                                </Button>
                        </form>
                    </Form>        
                    </CardContent>
        </Card>
  )
}

export default AddAccountForm