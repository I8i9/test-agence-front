import React from 'react'
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical , RectangleEllipsis , ShieldUser , Shield , LogOut, Cog, Settings } from 'lucide-react'
import { useStore } from '../../../store/store.js'
import { useLogout } from '../../../api/queries/auth/useLogout.js'
import { useState } from 'react'

import AgencySubscriptionSheet from '../../sheets/AgencySubscription/agencySubscription.jsx'
import AgencyAccountsSheet from '../../sheets/AgencyAccounts/agencyAccounts.JSX'
import ChangePasswordSheet from '../../sheets/ChangePassword/ChangePassword.jsx'
import { DrawerSettings } from '../../sheets/settings/settingDrawer.jsx'


const User = (props) => {
  // Access the user from the store
  const user = useStore((state) => state.user); 
  //  handle logout
  const { mutate: logout } = useLogout();
  const handleLogout = () => {
    logout();
  }

  const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sheets, setSheets] = useState({
    subscription: false,
    password: false,
    accounts: false,
    settings: false,
  })

const handleSheetChange = (sheetName) => (open) => {
    setSheets((prev) => ({
      ...prev,
      [sheetName]: open,
    }))

    // Close dropdown when any sheet opens
    if (open) {
      setDropdownOpen(false)
    }
  }

  // Handle menu item clicks
  const handleMenuItemClick = (sheetName) => (e) => {
    e.preventDefault()
    e.stopPropagation()

    setSheets((prev) => ({
      ...prev,
      [sheetName]: true,
    }))
  }

  return (
        <>
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger className="!px-1" asChild>
            {/* Trigger Button */}
            <Button variant="ghost" className={`flex items-center cursor-pointer py-6  ${props.DarkMode ? 'hover:bg-zinc-900 hover:text-white' : 'hover:bg-rod-foreground text-rod-primary'}`}>
              <Avatar className="h-9 w-9 rounded-lg ">
                <AvatarFallback className={`rounded-lg ${props.DarkMode ?  'bg-rod-primary text-white' : 'text-rod-primary'}`}>{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {/* User Name and Email */}
              <div className="grid flex-1 text-left text-base ">
                <span className="truncate font-medium leading-tight">{user?.name}</span>
                <span className={`truncate text-sm leading-normal ${props.DarkMode ? 'text-zinc-400' : 'text-muted-foreground'}`}>
                  {user?.role === "admin" ? "Chef d’agence" : "Agent"}
                </span>
              </div>

              <EllipsisVertical />

            </Button>

          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="right"
            align="end"
            sideOffset={0}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarFallback className="rounded-lg text-rod-primary font-medium">{user?.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {/* User Name and Email inside the menu */}
                <div className="grid flex-1 text-left ">
                  <span className="truncate text-base font-medium leading-tight">{user?.name}</span>
                  <span className="text-muted-foreground font-medium truncate leading-normal text-sm">
                    {user?.role === "admin" ? "Chef d’agence" : "Agent"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>

            <DropdownMenuItem className="py-1 cursor-pointer text-base hover:bg-rod-foreground " onClick={handleMenuItemClick("subscription")}   >
              <Shield  /> 
              Mon Abonnement
          </DropdownMenuItem>

              <DropdownMenuItem className="py-1 cursor-pointer text-base hover:bg-rod-foreground " onClick={handleMenuItemClick("password")}>
                <RectangleEllipsis />
                Changer mot de passe
              </DropdownMenuItem>


              { /* Only show this item if the user is an admin */ 
               (user.role === "admin" && user.agency.max_logins>1 ) &&
              <DropdownMenuItem className="py-1 cursor-pointer text-base hover:bg-rod-foreground " onClick={handleMenuItemClick("accounts")}>
                <ShieldUser />
                Gestion des comptes
              </DropdownMenuItem>
              }

              {
                /* Only show this item if the user is an admin*/
                //(user.role === "admin" && user.agency.max_logins>1 ) &&
                <DropdownMenuItem className="py-1 cursor-pointer text-base hover:bg-rod-foreground " onClick={handleMenuItemClick("settings")}>
                  <Settings />
                  Paramètres
                </DropdownMenuItem>
              }

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="py-1 cursor-pointer text-base hover:bg-rod-foreground ">
                    <LogOut />
                    Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/*render sheets */}
        
        <AgencySubscriptionSheet open={sheets.subscription} onOpenChange={handleSheetChange("subscription")} />

        <AgencyAccountsSheet open={sheets.accounts} onOpenChange={handleSheetChange("accounts")} />

        <ChangePasswordSheet open={sheets.password} onOpenChange={handleSheetChange("password")} /> 

        <DrawerSettings open={sheets.settings} onOpenChange={handleSheetChange("settings")} />
        </>
  )
}

export default User