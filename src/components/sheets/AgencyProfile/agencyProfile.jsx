import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
  
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Building2, Loader2, Save } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import AgencyProfileSkeleton from './agencyProfile.skeleton'
import AgencyProfileForm from './agencyProfile.form'
import {  useGetProfile } from '../../../api/queries/profile/useGetProfile.js'
import  {useUpdateData} from '../../../api/queries/profile/useupdateProfile.js'
import {useUploadAgencyLogo} from '../../../api/queries/images/useUploadAgencyLogo.js'


const AgencyProfileSheet = () => {


    const { data, isLoading,isError } = useGetProfile();

    const {mutateAsync :updateProfile , isPending} = useUpdateData();
    const {mutateAsync :usesetimage , isPending : imageIsPending  } =  useUploadAgencyLogo()
    

  return (
    <Sheet>
        <SheetTrigger className=" cursor-pointer hover:text-rod-primary hover:underline text-gray-500 leading-tight transition-all duration-300 ease-in-out">
                Modifier mon agence
        </SheetTrigger>
        <SheetContent side="right" className="!max-w-lg w-[480px]  overflow-y-scroll no-scrollbar">
            <SheetHeader>
            <SheetTitle>
                    <div className='flex items-center gap-3 text-rod-primary font-semibold text-xl '>
                        <Building2 className="mb-1" />
                        Profil d'Agence
                    </div>
            </SheetTitle>
            <SheetDescription className="text-base text-gray-500 leading-tight">
                Modifiez les informations de votre agence. Elles seront visibles par vos clients.    
            </SheetDescription>
            <Separator className="mt-4"/>
            </SheetHeader>
            {
              isLoading ? <AgencyProfileSkeleton/>:
              isError ?
              <div className='text-destructive h-full flex-1 min-h-0 mx-auto w-full items-center justify-center'>Une erreur est survenue lors du chargement du profil de l’agence.</div>
              :
              
              <AgencyProfileForm updateProfile={updateProfile} usesetimage={usesetimage}  data={data}/>
            }
            

          
            {
              isError || isLoading ? null :<SheetFooter><Button form='agency-profile-form' disabled={isPending || imageIsPending} type="submit" className="flex gap-2 items-center">
              {(isPending || imageIsPending) ?
              <>
                <Loader2 className="animate-spin" /> 
                Sauvegarde en cours...
              </>
              :
                <>Sauvegarder <Save className='mt-0.5'/></>
              }
              
              
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Annuler</Button>
            </SheetClose>
            </SheetFooter>
            }
            
            
          
        </SheetContent>
        
    </Sheet>
  )
}

export default AgencyProfileSheet