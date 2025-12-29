    import React from 'react'
import SideBar from '../components/rod/mainlayout/SideBar'
import Header from '../components/rod/mainlayout/header'
import { Outlet } from 'react-router-dom'
import Loading from '../components/rod/mainlayout/loading'
import SubscriptionExpired from '../components/shared/SubscriptionExpired'
import { useStore } from '../store/store.js'
    
    const MainLayout = () => {
      const { isLoadingBar } = useStore();
      return (
        <div className='grid grid-cols-[14dvw_86dvw] h-[100dvh] w-[100dvw] relative'>

            <SideBar /> 

            <div id='header-outlet' className='grid grid-rows-[9dvh_91dvh]'>
                 <Header />
                <div id='outlet-content' className=' h-full w-full  laptop:px-4 laptop:py-4 desktop:px-6 desktop:py-6 desktop-lg:px-10 desktop-lg:py-10 desktop-xl:px-12 desktop-xl:py-12'>
                  <SubscriptionExpired >
                    <Outlet />
                  </SubscriptionExpired> 
                </div>
            </div>
            {/*loading bar*/}
            { isLoadingBar &&  <Loading />}
        </div>
      )
    }   
    export default MainLayout