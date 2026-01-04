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
import { Loader2,ChevronRight,Eye, EyeOff  } from 'lucide-react';
import { useState} from 'react'; 
import { useLogin } from '../../../api//queries/auth/useLogin.js';

const FormLogin = (props) => {

    const LoginformSchema = z.object({
        email: z.string().min(1, "L’adresse e-mail est requise").email("L’adresse e-mail n’est pas valide"),
        password: z.string(),
    });

    const Loginform = useForm({
        resolver: zodResolver(LoginformSchema), 
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Handle form submission 
      const { mutate: login,isPending} = useLogin((step, email) => { props.setEmail(email); props.setCurrentForm(step); });
      const handleLogin = ( {email, password}) => {
          login( {email, password} );

      };

    // Show password toggle state
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className='w-[65%] max-w-[576px] laptop:space-y-6 desktop:space-y-8 desktop-lg:space-y-8  space-y-6 flex flex-col items-center justify-center'>
            <div className='flex flex-col gap-2 items-center'>
                <h1 className="text-3xl font-semibold">Connexion à votre compte</h1>
                <h2 className="text-gray-500">Accédez à votre tableau de bord</h2>
            </div>
         <Form {...Loginform} >
            
            <form onSubmit={Loginform.handleSubmit(handleLogin)} className="space-y-4 w-full "> 
            
            <FormField
                control={Loginform.control}
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
                            placeholder="Enterez votre email"
                            className="w-full"
                        />
                    </FormControl> 
                    <FormMessage /> 
                </FormItem>
                )}
            />
            <FormField
                control={Loginform.control}
                name="password"
                render={({ field }) => (
                    <FormItem> 
                        <FormLabel className="flex justify-between items-center">
                            <Label htmlFor="Idpassword">Mot de passe</Label>
                            <Button type="button" onClick={()=>props.setCurrentForm("forgotPassword")} variant="link" className="text-rod-accent !py-0 !h-fit">
                                Mot de passe oublié?
                            </Button>
                        </FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input
                                {...field}
                                id="Idpassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enterez votre mot de passe"
                                className="w-full"
                            />
                            <Button
                                type="button"
                                variant="icon"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0  top-1/2 -translate-y-1/2"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </Button>
                            </div>
                        </FormControl>
                        <FormMessage /> 
                    </FormItem>
                )} 
            />
            <Button   type="submit" disabled={isPending} className="w-full mt-4">
            {isPending ? <>Connexion en cours...<Loader2 className="text-mute-foreground animate-spin"/></>  :<>Accéder à mon compte<ChevronRight/></>}
            </Button>
            </form>
         </Form>
        </div>
    )
}

export default FormLogin;