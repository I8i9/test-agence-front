import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,

} from "@/components/ui/sheet"
import { useEffect, useState } from 'react'
import SendMailChangePassword from './SendMail.jsx'
import FormOTPChangePassword from './formOtp.jsx'
import FormChangePassword from './formChangePassword.jsx'
import Finish from './finishChangePassword.jsx'
import { RectangleEllipsis } from 'lucide-react'
import { Separator } from "@/components/ui/separator"

const ChangePasswordSheet = (props) => {

    const [currentForm , setCurrentForm] = useState('sendMail'); // default form is login
    // steps for forget password process
    const Steps = {
    sendMail : {
        FormComponent: SendMailChangePassword,
        propsPassed : {setCurrentForm}
    } ,
    otp : {
        FormComponent: FormOTPChangePassword,
        propsPassed : { setCurrentForm }
    }
    ,
    resetPassword : {
        FormComponent: FormChangePassword,
        propsPassed : { setCurrentForm }
    }
        ,
        finish :{
            FormComponent: Finish,
            propsPassed : {onOpenChange: props.onOpenChange }
        }

    };

    const { FormComponent, propsPassed  } = Steps[currentForm] ?? {
    FormComponent: SendMailChangePassword,
    ppropsPassed: {setCurrentForm},
    };

    useEffect(() => {
        if (props.open) {
            setCurrentForm('sendMail'); // Reset to the initial form when the sheet opens
        }
    } , [props.open]);

    return (
        <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className="!max-w-lg w-[480px] overflow-y-auto no-scrollbar">
      <SheetHeader>
      <SheetTitle>
        <div className='flex items-center gap-3 text-rod-primary font-semibold text-xl '>
          <RectangleEllipsis />
           Changer le mot de passe
        </div>
      </SheetTitle>
      <SheetDescription className="text-base text-gray-500 leading-tight">
        Envoyez un code de vérification par email   
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

export default ChangePasswordSheet