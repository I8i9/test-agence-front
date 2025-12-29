import FormLogin from '../components/rod/login/login.form.jsx';
import Logo  from '../assets/logos/rod_logo_1.svg';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TunisiaFlag from '../assets/icons/Tunisia_Flag.svg';
import FormForgotPass from '../components/rod/login/forgot.pass.form.jsx';
import FormOTP from '../components/rod/login/OTP.form.jsx';
import FormResetPass from '../components/rod/login/reset.pass.form.jsx';
import { useState } from 'react';

const LoginPage = () => { 

  const [currentForm , setCurrentForm] = useState('login'); // default form is login
  const [email , setEmail] = useState(null); // to store email for reset password
  // steps for forget password process
  const Steps = {
  login : {
    FormComponent: FormLogin,
    props : {setCurrentForm }
  } ,
  forgotPassword : {
    FormComponent: FormForgotPass,
    props : {setCurrentForm , setEmail }
  },
  otp : {
    FormComponent: FormOTP,
    props : { setCurrentForm, email , setEmail }
  }
  ,
  resetPassword : {
    FormComponent: FormResetPass,
    props : { setCurrentForm,  setEmail , email }
  }

};

  const { FormComponent, props } = Steps[currentForm] ?? {
  FormComponent: FormLogin,
  props: {setCurrentForm},
};

  return (
    <div className='grid grid-cols-[50%_50%] w-full h-screen '>
      <div id='leftside' className='w-full h-full pb-3 flex flex-col justify-between'>
        <div  className='w-full flex justify-between items-center laptop:h-[68px] desktop:h-19 desktop-lg:h-[88px] desktop-xl:h-[104px] h-16 laptop:px-5 desktop:px-6 desktop-lg:px-8 desktop-xl:px-8 px-5'>
            <img src={Logo} alt="rod logo" className=' laptop:h-8 desktop:h-9 desktop-lg:h-10 desktop-xl:h-12 h-8' />
            <Button variant="link" className='text-rod-primary flex gap-1 items-center'>
              <Link to={"/"}>rod.tn/home</Link>
            </Button>
        </div>


        <div className='w-full mb-32 flex flex-col items-center'>

          <FormComponent  {...props} />

        </div>


          <div className='w-full flex justify-start gap-1 desktop-lg:gap-2 desktop-xl:gap-2 items-center h-fit  laptop:px-5 desktop:px-6 desktop-lg:px-8 desktop-xl:px-8 px-5'>
            <img className='laptop:h-6 desktop:h-6 desktop-lg:h-8 desktop-xl:h-12 h-6' src={TunisiaFlag}/>
            <h3 className='laptop:text-xs desktop:text-xs desktop-lg:text-sm desktop-xl:text-base text-xs leading-none '>Platforme 100% <br/> Tunisienne</h3>
          </div>
      </div>
      <div className='w-full h-full bg-rod-foreground'>
        
      </div>
    </div>
  )
}

export default LoginPage