import { CircleAlertIcon, TriangleAlertIcon , CheckCircle } from 'lucide-react'

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'



export const AlertGreen = ({title,description}) => {
  return (
    <Alert className='bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400 border-1 border-green-200'>
      <CheckCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className='text-green-600/80 dark:text-green-400/80'>
       {description}
      </AlertDescription>
    </Alert>
  )
}

export const AlertRed = ({title,description}) => {
  return (
    <Alert className='bg-destructive/10 text-destructive border-1 border-red-200'>
      <TriangleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className='text-destructive/80'>
       {description}
      </AlertDescription>
    </Alert>
  )
}


export const AlertOrange = ({title,description}) => {
  return (
    <Alert className='bg-amber-600/10 text-amber-600  border  border-amber-200'>
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className='text-amber-600/80'>
       {description}
      </AlertDescription>
    </Alert>
  )
}

