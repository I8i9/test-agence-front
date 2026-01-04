/* eslint-disable no-unused-vars */
import FormLogin from '../components/rod/login/login.form.jsx';
import Logo  from '../assets/logos/rod_logo_1.svg';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import TunisiaFlag from '../assets/icons/Tunisia_Flag.svg';
import FormForgotPass from '../components/rod/login/forgot.pass.form.jsx';
import FormOTP from '../components/rod/login/OTP.form.jsx';
import FormResetPass from '../components/rod/login/reset.pass.form.jsx';
import { useState } from 'react';
import  Dashboard  from '../assets/login/dashboard.png';
import { ArrowUpRight, GraduationCap, Headset, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useVerifyOtp } from '../api/queries/auth/useVerifyOtp.js';
import { useVerify2FALogin } from '../api/queries/auth/use2FAlogin.js';
import { useGet2FAOtp } from '../api/queries/auth/useGet2FAOtp.js';
import { useGetOtp } from '../api/queries/auth/useGetOtp.js';

const LoginPage = () => { 

  const [currentForm , setCurrentForm] = useState('login'); // default form is login
  const [email , setEmail] = useState(null); // to store email for reset password
  const verifyForgotOtp = useVerifyOtp(); // For password reset
  const verify2faOtp = useVerify2FALogin(); // You'll need to create this query hook
  const resend2faOtp = useGet2FAOtp();
  const resendresetOtp = useGetOtp();

  // steps for forget password process
  const Steps = {
  login : {
    FormComponent: FormLogin,
    props : {setCurrentForm , setEmail }
  } ,
  forgotPassword : {
    FormComponent: FormForgotPass,
    props : {setCurrentForm , setEmail }
  },
  otp : {
    FormComponent: FormOTP,
    props: { 
      type: 'forgotPassword',
      email, 
      setEmail,
      onVerifySuccess: verifyForgotOtp, // Pass forgot pass mutation
      resendOtpAction: resendresetOtp,
      setCurrentForm 
    }
  }, 
  loginOtp: {
    FormComponent: FormOTP,
    props: { 
      type: '2fa',
      email,  
      setEmail,
      onVerifySuccess: verify2faOtp, // Pass 2FA login mutation
      resendOtpAction: resend2faOtp,
      setCurrentForm 
    }
  },
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
      <motion.div initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }} id='leftside' className='w-full h-full pb-3 flex flex-col justify-between'>
        <div  className='w-full flex justify-between items-center laptop:h-[68px] desktop:h-19 desktop-lg:h-[88px] desktop-xl:h-[104px] h-16 laptop:px-5 desktop:px-6 desktop-lg:px-8 desktop-xl:px-8 px-5'>
            <img src={Logo} alt="rod logo" className=' laptop:h-8 desktop:h-8 desktop-lg:h-10 desktop-xl:h-12 h-8' />
            <Button variant="link" className='text-rod-primary flex gap-1 items-center'>
              <Link to={"/"} className='flex items-center'>rod.tn<ArrowUpRight className='ml-1 mb-0.5' /></Link>
            </Button>
        </div>


        <div className='w-full mb-32 flex flex-col items-center'>

          <FormComponent  {...props} />

        </div>


          <div className='w-full flex justify-start gap-1 desktop-lg:gap-2 desktop-xl:gap-2 items-center h-fit  laptop:px-5 desktop:px-6 desktop-lg:px-8 desktop-xl:px-8 px-5'>
            <img className='laptop:h-6 desktop:h-6 desktop-lg:h-8 desktop-xl:h-12 h-6' src={TunisiaFlag}/>
            <h3 className='laptop:text-xs desktop:text-xs desktop-lg:text-sm desktop-xl:text-base text-xs leading-none '>Platforme 100% <br/> Tunisienne</h3>
          </div>
      </motion.div>
      <motion.div 
      id='rightside'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}

      
      className='w-full h-full bg-rod-foreground flex flex-col justify-between pt-12 desktop:pt-16 gap-4 overflow-hidden'>
          <div className='font-extrabold place-self-start text-4xl desktop:text-[40px] desktop-lg:text-[52px] pl-18   desktop:pl-20  pr-6 desktop:pr-12 '>
            La Patforme tout-en-un pour
            <span className='text-rod-accent'> gérez votre agence </span> 
          </div>
          <div className='grid-cols-3 gap-8 grid w-full pl-18 desktop:pl-20 pr-6 desktop:pr-7 desktop-lg:pr-12 text-[clamp(14px,2vw,18px)]'>
            <div className='flex flex-col items-start '>
              <span className='bg-white drop-shadow-xs w-fit  h-fit rounded-xl p-2.5 desktop-lg:p-3'>
                <GraduationCap className='text-rod-accent size-6 desktop-lg:size-8' />
              </span>
              <span className=' font-bold mt-2 desktop:mt-3'>Migration guidée</span>
                            {<span className=' font-normal text-start text-gray-500 leading-tight'>Formation gratuit pour votre personels</span> }

              
              
            </div>
            <div className='flex flex-col items-start '>
              <span className='bg-white drop-shadow-xs w-fit  h-fit rounded-xl p-2.5 desktop-lg:p-3'>
                <Headset className='text-rod-accent size-6 desktop-lg:size-8' />
              </span>
              <span className=' font-bold mt-2 desktop:mt-3'>Assistance 7j/7</span>
              {<span className=' font-normal text-start text-gray-500 leading-tight'>Assistance rapide et fiable à chaque étape.</span> }

              
              
            </div>
            <div className='flex flex-col items-start '>
              <span className='bg-white drop-shadow-xs w-fit  h-fit rounded-xl  p-2.5 desktop-lg:p-3'>
                <Tag className='text-rod-accent size-6 desktop-lg:size-8' />
              </span>
              <span className=' font-bold mt-2 desktop:mt-3'>Prix imbattable</span>
                            {<span className=' font-normal text-start text-gray-500 leading-tight'>La solution la moins chère du marché.</span> }


              
              
          </div>

        </div>

        <div className='w-full h-fit mt-4 flex justify-end items-end rounded-ss-lg pl-18 desktop:pl-20'>
          <img src={Dashboard} alt="dashboard" className='h-fit pt-1 bg-white  object-contain ring-10 ring-rod-primary rounded-ss-[10px]'/>
        </div>
        
      </motion.div>
    </div>
  )
}

export default LoginPage