import { Camera, Info,Clock4 ,MapPinned} from 'lucide-react'
import {MapInput} from '../../customUi/mapInput.jsx'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
  import { useStore } from '../../../store/store'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import FileInput from '../../customUi/fileInput'
import { useForm , useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import WorkingHoursInput from '../../customUi/horaireinput'
import z from 'zod'
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
    FormField,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import {useEffect , useState } from 'react'
import PhoneInput from '../../customUi/phoneInput'
import MapPicker from '../../customUi/mappicker.jsx'



const AgencyProfileForm = ({data , updateProfile , usesetimage}) => {
  const user = useStore((state) => state.user)
  const timeRange = z.object({
    debut: z.string(),
    fin: z.string(),
  });

  const [upadatedData, setUpdatedData] = useState(false);

const formSchema = z.object({
      logo: z
      .instanceof(File, { message: 'Veuillez sélectionner une image' })
      .refine(
        file =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        { message: 'Le fichier doit être une image' }
      ).optional(),
      name_agency: z.string()
      .min(3, { message: 'le nom de l\'agence doit être minimum 3 caractères' })
      .max(50, { message: 'Le nom de l\'agence ne doit pas dépasser 50 caractères' })
      .optional(),
      description: z.string()
      .min(10, { message: 'La description doit comporter au moins 10 caractères' })
      .max(500, { message: 'La description ne doit pas dépasser 500 caractères' })
      .optional(),
      email : z.string()
      .email({ message: 'Veuillez entrer un email valide' })
      .optional(),
      phone: z.array(
      z.string().regex(/^[24579]\d{7}$/, "Numéro de téléphone invalide")
      ).optional(),
      working_hours:z.object({
      Lundi: timeRange.or(z.literal(false)),
      Mardi: timeRange.or(z.literal(false)),
      Mercredi: timeRange.or(z.literal(false)),
      Jeudi: timeRange.or(z.literal(false)),
      Vendredi: timeRange.or(z.literal(false)),
      Samedi: timeRange.or(z.literal(false)),
      Dimanche: timeRange.or(z.literal(false)),
    }).optional(),
    location: z.object({lng: z.number(),lat: z.number(),title:z.string()}).optional(),
    })

    const defaultValues =  {
            logo: undefined,
            name_agency : undefined,
            description: undefined,
            email : undefined,
            phone:undefined,
            working_hours:undefined,
            location:undefined,
          } ;
      
    const profileForm = useForm({
        resolver: zodResolver(formSchema),defaultValues
        
  })
    const { control } = profileForm
    const file = useWatch({ name: 'logo', control }) 
    const [previewUrl, setPreviewUrl] = useState()
    useEffect(() => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        return () => {
          URL.revokeObjectURL(url)
        }
      } else {
        setPreviewUrl(null)
      }
    }, [file])  

const HandleSubmit =(data) => {
  const { logo, ...restData } = data;
  
  const hasDataToUpdate = Object.values(restData).some(value => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0));

  if(logo && logo instanceof File){
    usesetimage(logo).then(() => {
      setUpdatedData(true);
    });
  } 
  
  if (hasDataToUpdate) {
    updateProfile(restData).then(() => {
      if(!upadatedData){
        setUpdatedData(true);
      }
    });
  }

};

  useEffect(() => {
    if (upadatedData) {
      profileForm.reset(defaultValues);
      setUpdatedData(false);
      
    }
  }, [upadatedData]);



  return (
    <Form {...profileForm}>
    <form id='agency-profile-form'   onSubmit={profileForm.handleSubmit(HandleSubmit)} className='px-4 space-y-8'>

            <Card className="w-full max-full pb-8 px-4 pt-4 shadow-none ">
              <CardHeader className="w-full px-0">
                <CardTitle className='flex items-center gap-2'>
                   <Camera className="mb-0.5" size={24} />
                   <h2 className='text-xl font-medium leading-tight'>Logo de l'agence</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className='flex justify-between items-center'>
                    <Avatar className="h-24 w-24 rounded-full">
                        <AvatarImage className="object-cover" src={previewUrl ? previewUrl : user?.agency?.logo_path}  />
                        <AvatarFallback className="text-xl font-medium">{user.agency?.name_agency?.slice(0, 2)?.toUpperCase() || ''}</AvatarFallback>
                    </Avatar>
                   <FormField
                        control={profileForm.control}
                        name="logo"
                        render={() => (
                            <FormItem>
                            <FormControl>
                                <FileInput name="logo" />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                </div>
              </CardContent>
          </Card>
          
          <Card className="w-full max-full pb-8 px-4 pt-4 shadow-none ">
              <CardHeader className="w-full px-0">
                <CardTitle className='flex items-center gap-2'>
                  <Info className="mb-1"  size={24} />
                   <h2 className='text-xl font-medium leading-tight mb-0.5  '>Informations de Base</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className ="space-y-8 px-2">
                <FormField
                  control={profileForm.control}
                  name="name_agency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de l'agence</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={data?.nom_agence}
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      {
                        profileForm.formState.errors.name_agency ? 
                          <FormMessage/>
                          :
                           <FormDescription>
                          Indiquez le nom de votre agence.
                          </FormDescription>
                      }
                     
                    </FormItem>
                  )}
                />
    
                <div className='flex flex-col'>
                  <FormField
                    control={profileForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description de l'agence</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={data?.bio_agence}
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        {
                          profileForm.formState.errors.description ? 
                            <FormMessage/>
                            :
                             <FormDescription>
                            Indiquez une brève description de votre agence.
                            </FormDescription>
                        }
                      </FormItem>
                    )}
                  />
                </div>
    
                <div className='flex flex-col'>
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de l'agence</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={data?.email_agence}
                            {...field}
                            className="w-full"
                          />
                        </FormControl>
                        {
                          profileForm.formState.errors.email ? 
                            <FormMessage/>
                            :
                             <FormDescription>
                            Indiquez l'email de votre agence.
                            </FormDescription>
                        }
                      </FormItem>
                    )}
                  />
                </div>
    
                <div className='flex flex-col'>
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Numéros de Téléphone</FormLabel>
         
                           <FormControl>
                        <PhoneInput field={field} placeholder={data?.telephone_agence}  />
                        </FormControl>
                         
                      </FormItem>
                    )}
                  />
                      
                </div>
              </CardContent>
          </Card>

          {/* horaire */}



          {/* map */}
    
          <Card className="w-full max-full pb-8 px-4 pt-4 shadow-none ">
              <CardHeader className="w-full px-2">
                <CardTitle className='flex items-center gap-2'>
                  <Clock4  className="mb-1" size={24} />
                   <h2 className='text-xl font-medium leading-tight mb-0.5'>Horaires d'Ouverture</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <div className='flex justify-between items-center'>
                  <FormField control={profileForm.control} 
                  name='working_hours'
                  render={({ field }) => (
                    <FormItem>
                   <WorkingHoursInput field={field} prev={data?.horaire_agence}/>
                   <FormMessage/>
                   </FormItem>
                )}
                  />
                </div>
              </CardContent>

          </Card>
          <Card className="w-full max-full pb-8 pt-4 shadow-none ">
              <CardHeader className="w-full px-6">
                <CardTitle className='flex items-center gap-2'>
                  <MapPinned className="mb-1" size={24} />
                   <h2 className='text-xl font-medium leading-tight'>Localisation</h2>
                </CardTitle>
              </CardHeader>

              <CardContent>
             
              <div className='flex flex-col '>
                <FormField 
                control={profileForm.control}
                  name='location'
                    render={({ field }) => (
                      <FormItem>
                      <MapInput field={field} prev={data?.location?.title}/>
                      <MapPicker value={field.value} onChange={field.onChange} prev={data?.location}/>
                      </FormItem>
                    )}
                />
              </div>
              </CardContent>
          </Card>
        </form>
        </Form>
        
  )
}

export default AgencyProfileForm