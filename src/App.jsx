import { Toaster } from "@/components/ui/sonner"
import AppRoutes from "./routes.jsx"
import { useMediaQuery } from "react-responsive";
import MobilePage from "./pages/util.pages/mobile.page.jsx";
import { useEffect } from "react";
import './assets/costumscrollbar.css'

function App() {

  const isNarrow = useMediaQuery({ maxWidth: 1279.9  })
  const isShort = useMediaQuery({ maxHeight: 619.9 })

 const isMobile = isNarrow || isShort || /mobile/i.test(navigator.userAgent);

 useEffect(() => {
   // Log the device type to the console
    if (isMobile) {
      console.log("Mobile device detected");
    } else {
      console.log("Desktop device detected");
    }
  }, [isMobile]);


  return (
    <div> 
      {/* show mobile page when screen is less than 1280px */
      isMobile ? 
      
      <MobilePage />

      :
      // show the app routes when screen is greater than 1280px
      // this is to avoid the app to be rendered on mobile devices
      <AppRoutes />

      }
      <Toaster position="top-center"/>
    </div>
  )
}

export default App
