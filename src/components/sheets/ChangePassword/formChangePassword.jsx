import { useEffect , useState } from 'react'
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { RectangleEllipsis, Eye, EyeOff , Loader2 } from 'lucide-react'
import { Form ,FormField , FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input';
import { useResetPassword } from '../../../api/queries/auth/useResetPassword';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';




const FormChangePassword = (props) => {

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

      const [showPassword, setShowPassword] = useState(false);

      useEffect(() => {
          if (isSuccess) {
              props.setCurrentForm('finish'); // Navigate back to the login form
          }
      }, [isSuccess]);

  return (
    <Card className="shadow-none ">
        <CardContent className="py-2 flex flex-col items-center">
            <div className="p-3 bg-amber-100 rounded-md flex items-center justify-center">
                <RectangleEllipsis className="w-6 h-6 text-amber-500 " />
            </div>
            <h2 className="text-lg font-medium mt-4">
                Nouveau mot de passe
            </h2>
            <p className="text-gray-500 mt-2 leading-tight text-center flex flex-col items-center">
                Code vérifié avec succès. Définissez maintenant votre nouveau mot de passe.
            </p>

            <Form {...ResetPassForm} >
                <form onSubmit={ResetPassForm.handleSubmit(HandleSubmit)} className="space-y-7 mt-8 w-full">
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

        </CardContent>

    </Card>
  )
}

export default FormChangePassword