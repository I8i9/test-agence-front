import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, } from 'lucide-react';
import { OptionItem } from './optionComponent';
import {  useState } from 'react';
import { availableOptions } from '@/utils/dataOptions';

const CreateStep5 = ({ setOffreData, offreData, next, prev }) => {

    const [selectedOptions, setSelectedOptions] = useState(offreData?.selectedOptions || {})
    const [validatedOptionsArray, setValidatedOptionsArray] = useState( offreData?.Validated || []);

    const handleNext = () => {
        setOffreData((prev) => ({
        ...prev,
        selectedOptions: selectedOptions,
        Validated: validatedOptionsArray,
        }))
        next()
    }

    const handleOptionValidate = (optionId, data) => {
        setSelectedOptions((prev) => ({
        ...prev,
        [optionId]: data,
        }))

    const option = availableOptions.find((opt) => opt.id === optionId)
        if (option) {
        setValidatedOptionsArray((prev) => {
            const filtered = prev.filter((item) => item.id !== optionId)
            return [
            ...filtered,
            {
                id: option.id,
                title: option.title,
                icon: option.icon,
                description: option.description,
                pricingMode: data.pricingMode,
                value: data.value,
            },
            ]
        })
        }
    }

    const handleRemoveOption = (optionId) => {
        setSelectedOptions((prev) => {
        const newOptions = { ...prev }
        delete newOptions[optionId]
        return newOptions
        })

        setValidatedOptionsArray((prev) => prev.filter((item) => item.id !== optionId))
    }
    return (
        <div className='flex flex-col h-full'>
            {/* Content Area */}
            <div className='flex-1'>
                <h3 className="flex items-center justify-between gap-1 font-semibold text-lg mb-4">
                    Options supplémentaires <span className='text-base font-medium text-gray-500'>{(validatedOptionsArray.length > 0) && `(${validatedOptionsArray.length} sélectionnée${validatedOptionsArray.length > 1 ? 's' : ''})`}</span> 
                </h3>
                <div className='space-y-2 overflow-y-auto h-[422px] pr-2 -mr-4'>
                    {availableOptions.map((option) => {
                        if ((option.id === "plein_carburant" && offreData?.carburant_pol === "PLEIN_INCLUS") || (option.id === "livraison" && offreData?.livraison_pol === "AGENCE")) {
                            return null; // Skip rendering this option
                        }
                        return (<OptionItem
                            key={option.id}
                            option={option}
                            isValidated={!!validatedOptionsArray.find((item) => item.id === option.id)}
                            selected={selectedOptions[option.id]}
                            onValidate={(data) => handleOptionValidate(option.id, data)}
                            onRemove={() => handleRemoveOption(option.id)}
                        />)
                    }
                        
                    )}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={prev} className="rounded-sm">
                    <ChevronLeft className="h-4 w-4" />
                    Retour
                </Button>
                
                <Button onClick={handleNext}  className="rounded-sm">
                    Suivant 
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default CreateStep5;