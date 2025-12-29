import React from 'react'
import Logo from "../../assets/logos/rod_logo_1.svg"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-rod-foreground'>
        <motion.img  
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
            }}
       src={ Logo } alt="rod logo" className=' laptop:h-12 desktop:h-14 desktop-lg:h-16 desktop-xl:h-18 h-12' />
    </div>
  )
}

export default LoadingPage