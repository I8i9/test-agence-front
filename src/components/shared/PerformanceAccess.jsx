import React from 'react'
import { useStore } from '../../store/store'
import RestrictedPage from '../../pages/util.pages/restricted.page'

const PerformanceAccess = (props) => {
  const user = useStore((state) => state.user)
  
if (user.agency?.subscription && user.agency?.subscription.includes("Performance")){
    return props.children
}else{
    return <RestrictedPage type="Performance"   />
}
}

export default PerformanceAccess