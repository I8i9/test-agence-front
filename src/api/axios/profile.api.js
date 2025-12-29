import mainapi from './main.api.js'


export const Getprofileapi=async()=>{
const respone=await mainapi.get('/profile')
return respone
}

export const updateProfileapi=async(updatepayload)=>{
    const respone=await mainapi.patch('/profile',updatepayload)
    return respone
}

