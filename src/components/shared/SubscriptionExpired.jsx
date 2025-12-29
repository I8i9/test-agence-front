import React from 'react'
import { useStore } from '../../store/store'
import ExpiredPage from '../../pages/util.pages/expired.page'

const SubscriptionExpired = (props) => {
   const user = useStore((state) => state.user)
    
    if (!user.agency?.isExpired){
        return props.children
    }else{
        return <ExpiredPage />
    }
    }

export default SubscriptionExpired