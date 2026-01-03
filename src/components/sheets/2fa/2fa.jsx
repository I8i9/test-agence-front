import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,

} from "@/components/ui/sheet"
import {  useState } from 'react'

import { KeyRound } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { useStore } from "../../../store/store.js"
import Disable2FA from "./Disable2fa.jsx"
import Enable2FA from "./Enable2fa.jsx"
import Enable2faOtp from "./Enable2faOtp.jsx"
import FinishEnable from "./enableFinish.jsx"
import Disable2faOtp from "./Disable2faOtp.jsx"
import FinishDisable from "./disableFinish.jsx"

const TwoFactorSheet = (props) => {


    const user = useStore((state) => state.user);
    const [currentForm , setCurrentForm] = useState(user?.twoFAEnabled ? 'disable2FA' : 'enable2FA'); 
    const [password , setPassword] = useState('');
    // two scenarios depending on where the 2FA is enabled or not
    // we will declare steps and construct it based on 2fa status


    const Steps = user?.twoFAEnabled ? {
        disable2FA : {
            FormComponent: Disable2FA,
            propsPassed : {setCurrentForm ,  setPassword   }
        },
        otp2fadisable : {
           FormComponent: Disable2faOtp,
            propsPassed : { setCurrentForm, password   }
        },
        disableFinish : {
            FormComponent: FinishDisable,
            propsPassed : { setCurrentForm , onOpenChange : props.onOpenChange }
        }
    } : {
        enable2FA : {
            FormComponent: Enable2FA,
            propsPassed : {setCurrentForm  }
        },
        otp2fa : {
            FormComponent: Enable2faOtp,
            propsPassed : { setCurrentForm  }
        },
        enableFinish : {
            FormComponent: FinishEnable,
            propsPassed : { setCurrentForm , onOpenChange : props.onOpenChange }
        }
    };

    const { FormComponent, propsPassed } = Steps[currentForm] 
      ?? (user?.twoFAEnabled
      ? { FormComponent: Disable2FA, propsPassed: { setCurrentForm , setPassword } }
      : { FormComponent: Enable2FA, propsPassed: { setCurrentForm } });


    return (
        <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className="!max-w-lg w-[480px] overflow-y-auto no-scrollbar">
      <SheetHeader>
      <SheetTitle>
        <div className='flex items-center gap-3 text-rod-primary font-semibold text-xl '>
          <KeyRound />
           Authentification à deux facteurs
        </div>
      </SheetTitle>
      <SheetDescription className="text-base text-gray-500 leading-tight">
        Renforcez la sécurité de votre compte en ajoutant une seconde étape de vérification.
      </SheetDescription>
      <Separator className="mt-4"/>
      </SheetHeader>

      <div className='px-4'>

        <FormComponent {...propsPassed} />

      </div>
      </SheetContent>
    </Sheet>
    )
};

export default TwoFactorSheet