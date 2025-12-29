
import { Button } from '@/components/ui/button';
import Information from '../DepenseActions/information'
import React from 'react';

const CreateDepenseStep5 = ({ DepenseData, prev, next , maximizedFacture , setMaximizedFacture , isPending }) => {
  console.log('DepenseData in Step 5' , DepenseData);

  return (
    <div className="space-y-6 ">
      <div className='flex flex-col gap-4'>
        <Information isForForm={true} DepenseData={DepenseData} maximizedFacture={maximizedFacture} setMaximizedFacture={setMaximizedFacture}  />
      </div>
    {/* Navigation buttons */}
      <div className="flex-shrink-0 flex justify-between items-center  pt-4 border-t ">
        <Button 
          variant="outline" 
          onClick={prev}
          className="flex items-center gap-2"
        >
          Retour
        </Button>
        <Button 
          disabled={isPending}
          onClick={next}
          type="button"
          className="flex items-center gap-2 bg-rod-primary hover:bg-rod-primary/90"
        >
          Confirmer
        </Button>
      </div>
    </div>
  )
}

export default CreateDepenseStep5