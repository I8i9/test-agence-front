import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users , Trash2 } from 'lucide-react'
import { useStore } from '../../../store/store'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteAccount } from '../../../api/queries/accounts/useDeleteAccount'

const AccountsList = (props) => {
    const user = useStore((state) => state.user); // Access the user from the store

    const { mutate: deleteAccount } = useDeleteAccount();

    const handleDeleteAccount = (accountId) => {
        deleteAccount(accountId);
    };
  return (
      <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
                    <CardHeader className="w-full px-0">
                      <CardTitle className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Users  size={24} className=''/>
                            <h2 className='text-xl font-medium  leading-tight'>Comptes Actuels</h2>
                        </div>
                        <div className='flex items-center justify-center px-2 py-0.5 text-sm bg-rod-foreground rounded-md'>
                             {props.accounts.length}/{user.agency.max_logins} comptes
                        </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-2">
                        <div className='space-y-4'>
                            {props.accounts?.map((account,index) => {
                                const name = account.nom_agent_login || "Compte sans nom";
                                const email = account.email_login || "_";
                               return <div key={index} className='flex items-center justify-between py-4 px-3 rounded-lg border '>
                                    <div className='flex items-center gap-4'>
                                         <Avatar className="h-10 w-10 rounded-lg">
                                            <AvatarFallback className="rounded-lg text-rod-primary font-medium">{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className='flex flex-col text-left'>
                                            <span className='text-base leading-tight flex gap-1 items-center font-medium'>
                                                {name}
                                            </span>
                                           <span className='text-sm leading-none text-gray-500'>
                                                {email}
                                            </span> 
                                        </div>
                                    </div>

                                    { email !== user.email ?

                                    <AlertDialog key={index}>
                                        <AlertDialogTrigger asChild>
                                            <button variant="ghost" size="icon" className="text-rod-accent hover:text-rod-accent p-2 cursor-pointer hover:bg-rod-foreground rounded-md">
                                                <Trash2 size={20}   />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle className="text-rod-accent">Supprimer le compte de l’agent {name} ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Cette action est irréversible. Toutes les données associées à ce compte seront définitivement supprimées, y compris l’historique et les accès liés.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter className="mt-4">
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction className="bg-rod-accent hover:bg-red-700 text-white " onClick={()=>handleDeleteAccount(account.id_login)} >
                                                Supprimer définitivement
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    :

                                    // If the account is the current user's account, we don't show the delete button
                                    <Badge key={index} className='mt-1 text-xs leading-none  bg-blue-500'>
                                        Actuel
                                    </Badge>
                                    
                                    }
                                    
                                </div>
                            })}
                        </div>
                    </CardContent>
        </Card>
    
  )
}

export default AccountsList