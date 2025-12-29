import { DialogContent ,DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X, UserCheck } from 'lucide-react';

// Success Modal Component
export const SuccessModal = ({ onViewOffers, onPublishAnother , title , description , button1 , button2 ,  button1Disabled = false }) => {
  return (
    <>
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <DialogContent className="flex items-center w-136 h-fit scale-85 desktop:scale-90 desktop-lg:scale-110 gap-1 flex-col">
          {/* Success Icon */}
          <div className="bg-green-100 rounded-full p-2 mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          {/* Title */}
           <h2 className="text-2xl font-semibold leading-tight">
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-base text-center">
            {description}
          </p>

          {/* Action Buttons */}
          <DialogFooter className=" w-full grid grid-cols-1 items-center gap-2 mt-6">
            <Button disabled={button1Disabled} onClick={onPublishAnother} className="[&>svg]:!w-5 [&>svg]:!h-5 " >
               {button1}
              </Button>
            {button2 && onViewOffers &&
            <Button className="[&>svg]:!w-5 [&>svg]:!h-5 " variant="outline" onClick={onViewOffers}>
              {button2}
            </Button>
            }
            
          </DialogFooter>
      </DialogContent>
    </> 
  );
};

// Error Modal Component
export const ErrorModal = ({ onViewOffers, onRetry, errorMessage , title ="Ajout Échoué", button1 , button2  }) => {
  console.log("Error message in ErrorModal:", errorMessage);
  return (
    <>
      <DialogTitle className="sr-only">Ajout échoué</DialogTitle>
      <DialogContent className="flex items-center w-136 h-fit scale-85 desktop:scale-90 desktop-lg:scale-110 gap-1 flex-col">
       {/* Error Icon */}
           <div className="rounded-full bg-red-100 p-2 mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold leading-tight">
            {title || "Ajout échoué"}
          </h2>

          {/* Description */}
          <p className="text-gray-500 text-base text-center">
            {errorMessage || "Une erreur s'est produite. Veuillez réessayer plus tard."}
          </p>

          {/* Action Buttons */}
          <DialogFooter className=" w-full grid grid-cols-1 items-center gap-2 mt-6">
            <Button onClick={onRetry} className="[&>svg]:!w-5 [&>svg]:!h-5 " >
              {button1}
              </Button>
            {(button2 && onViewOffers) &&
            <Button className="[&>svg]:!w-5 [&>svg]:!h-5 " variant="outline" onClick={onViewOffers}>
              {button2}
            </Button>
            }
          </DialogFooter>
      </DialogContent>
    </>
  );

   
   
};