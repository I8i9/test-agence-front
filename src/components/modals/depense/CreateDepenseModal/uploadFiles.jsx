import React from 'react'
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import MultipleFilesField from '../../../customUi/MultipleFilesField';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const UploadFiles = ({ setDepenseData, DepenseData, next, prev }) => {

    const handleNext = () => {
        setDepenseData(prev => ({ ...prev, files }));
        next();
    }

    const [files, setFiles] = React.useState(DepenseData?.files || []);
    return (
            <div className="flex flex-col justify-between  ">
                <div className='mt-4 h-[500px]' >
                    <Label className="ml-12"> Télécharger les fichiers (optionnel)</Label>
                    <span className="text-muted-foreground text-sm ml-12">Vous pouvez télécharger des fichiers pertinents liés à cette dépense, tels que des reçus ou des factures.</span>
                        <MultipleFilesField files={files} setFiles={setFiles} />
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t">
                        <Button variant="outline" onClick={prev} className="rounded-sm">
                        <ChevronLeft  className="h-4 w-4" />
                        Retour
                        </Button>
                
                        <Button onClick={handleNext} type="button" className="rounded-sm">
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                        </Button>
                </div>
            </div>
  )
}

export default UploadFiles