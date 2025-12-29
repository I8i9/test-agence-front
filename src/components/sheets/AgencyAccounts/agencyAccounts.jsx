import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,

} from "@/components/ui/sheet"
import { ShieldUser} from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useStore } from '../../../store/store'
import AccountsList from './accountsList'
import useGetAccounts from '../../../api/queries/accounts/useGetAccounts'
import AgencyAccountsSkeleton from './agencyAccounts.skeleton'
import AddAccountForm from './addAccount.form'
import AddAccountRestricted from './addAccountRestricted'




const AgencyAccountsSheet = ( props ) => {

    const user = useStore((state) => state.user); // Access the user from the store
    // Fetch accounts
    const { data: accounts, isLoading, isPending , isError } = useGetAccounts({ enabled: props.open });

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange} >
        <SheetContent side="right" className="!max-w-lg w-[480px]  overflow-y-scroll no-scrollbar">
            <SheetHeader>
            <SheetTitle>
                    <div className='flex items-center gap-3 text-rod-primary font-semibold text-xl '>
                        <ShieldUser />
                        Comptes de l’agence
                    </div>
            </SheetTitle>
            <SheetDescription className="text-base text-gray-500 leading-tight">
                Gérez les comptes liés à votre agence. Maximum {user.agency.max_logins} comptes autorisés.
            </SheetDescription>
            <Separator className="mt-4"/>
            </SheetHeader>
            <div className='px-4 space-y-8 pb-8'>
                {isLoading || isPending ? 
                    <AgencyAccountsSkeleton />
                    :
                isError ?
                    <div className='text-destructive h-full w-full items-center justify-center'>Une erreur est survenue lors du chargement des comptes.</div>
                    :
                    <>
                    <AccountsList accounts={accounts}/>

                    {(accounts?.length < user?.agency?.max_logins) ? (
                        <AddAccountForm />
                    ) : (
                        <AddAccountRestricted />
                    )}
                    </>
                }
            </div>

            
            
        </SheetContent>
        
    </Sheet>
  )
}

export default AgencyAccountsSheet