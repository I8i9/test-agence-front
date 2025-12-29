import { Camera, AlertCircle, X, Maximize, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import {  z } from 'zod';
import { Form , FormField , FormItem  , FormControl , FormMessage} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const CarImages = ({next , prev , setCar , Car}) => {

  const imageFormSchema = z.object({
  front: z
      .instanceof(File, { message: 'Veuillez sélectionner une image' })
      .refine(
        file =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        { message: 'Le fichier doit être une image' }
      ).optional(),
  rear: z
      .instanceof(File, { message: 'Veuillez sélectionner une image' })
      .refine(
        file =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        { message: 'Le fichier doit être une image' }
      ).optional(),
  right: z
      .instanceof(File, { message: 'Veuillez sélectionner une image' })
      .refine(
        file =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        { message: 'Le fichier doit être une image' }
      ).optional(),
  left: z
      .instanceof(File, { message: 'Veuillez sélectionner une image' })
      .refine(
        file =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        { message: 'Le fichier doit être une image' }
      ).optional(),
  interior: z
      .instanceof(File, { message: 'Veuillez sélectionner une image' })
      .refine(
        file =>
        ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        { message: 'Le fichier doit être une image' }
      ).optional(),
  });

    // Initialize form with zod validation
  const imagesForm = useForm(
    {
      resolver : zodResolver(imageFormSchema),
      defaultValues: {
        front: Car?.images?.front || null,
        rear: Car?.images?.rear || null,
        right: Car?.images?.right || null,
        left: Car?.images?.left || null,
        interior: Car?.images?.interior || null
      }
    }
  )

  const [images, setImages] = useState({
    front:  null,
    rear:  null,
    right:  null,
    left:  null,
    interior: null
  });


  useEffect(() => {
    // Initialize images state with existing values from form
    setImages({
      front: imagesForm.getValues('front') ? URL.createObjectURL(imagesForm.getValues('front')) : null,
      rear: imagesForm.getValues('rear') ? URL.createObjectURL(imagesForm.getValues('rear')) : null,
      right: imagesForm.getValues('right') ? URL.createObjectURL(imagesForm.getValues('right')) : null,
      left: imagesForm.getValues('left') ? URL.createObjectURL(imagesForm.getValues('left')) : null,
      interior: imagesForm.getValues('interior') ? URL.createObjectURL(imagesForm.getValues('interior')) : null
    });

  }, []);

  // Check if all images are uploaded


  // handle submit and go next
  const HandleSubmit = (data) => {
    console.log('Form submitted with data:', data);

    setCar((prev) => ({
        ...prev,
        images: {
            ...data
        }
    }));

    next();
   
  }

  const uploadAreas = [
    { id: 'front', label: 'Vue Avant', subtitle: 'Face avant du véhicule',  },
    { id: 'rear', label: 'Vue Arrière', subtitle: 'Face arrière du véhicule',  },
    { id: 'right', label: 'Vue Droite', subtitle: 'Face droite du véhicule',  },
    { id: 'left', label: 'Vue Gauche', subtitle: 'Face gauche du véhicule',  },
    { id: 'interior', label: 'Vue Intérieure', subtitle: 'Face intérieure du véhicule', }
  ];

  const [expandedImage, setExpandedImage] = useState(null);

  const handleFileUpload = async (areaId, event) => {
    const file = event.target.files[0];
    if (file) {

      imagesForm.setValue(areaId, file );
      // Trigger validation and wait for result
      const isValid = await imagesForm.trigger(areaId);

      if (isValid) {
      // Revoke old object URL if one already exists
          if (images[areaId]) {
            URL.revokeObjectURL(images[areaId]);
          }

          const objectUrl = URL.createObjectURL(file);

          setImages(prev => ({
            ...prev,
            [areaId]: objectUrl
          }));
      }
      

    // Allow re-upload of the same file
    event.target.value = '';
    }
  };

  // Cleanup all object URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(images).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);


  const handleRemoveImage = (areaId) => {

    if (images[areaId]) {
      URL.revokeObjectURL(images[areaId]);
    }

    imagesForm.setValue(areaId, null );

    setImages(prev => ({
      ...prev,
      [areaId]: null
    }));


  };

  const handleExpandImage = (areaId) => {
     const area = uploadAreas.find(a => a.id === areaId);
      setExpandedImage({
        src: images[areaId],
        label: area.label,
        subtitle: area.subtitle
      }); 
  }; 

  const handleCloseExpanded = () => {
    setExpandedImage(null);
  }

  return ( 
    <>
    <div className="h-full flex flex-col items-center justify-center "> 
      <Form {...imagesForm}>
      <form id="add-garage-car-images-form" onSubmit={imagesForm.handleSubmit(HandleSubmit)} className="h-full w-full grid grid-cols-[repeat(3,1fr)]  grid-rows-[repeat(2,1fr)] gap-8 ">
        {uploadAreas.slice(0, 5).map((area) => (
            <div key={area.id} className={` ${imagesForm.formState.errors[area.id] ? ' border-red-500' : 'border-gray-300'} w-full relative   h-full max-h-[214px]  hover:bg-rod-foreground rounded-lg group  transition-colors cursor-pointer flex flex-col items-center justify-center group ${!images[area.id] ? 'border-2 border-dashed' : '' }`}>
              
              {!images[area.id] ? (
                <FormField 
                name = {area.id}
                control={imagesForm.control}
                render={(field) => (
                  <>
                  <FormItem>
                    <FormControl>
                      <Input
                        name={area.id}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(area.id, e)}
                        ref = {field.ref}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      </FormControl>
                  </FormItem>
                    <div className="p-3 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <Camera className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium ">{area.label}</p>
                      <p className="text-gray-500 text-base">
                        {imagesForm.formState.errors[area.id] ? (
                          imagesForm.formState.errors[area.id].message
                        ) : (
                          area.subtitle
                        )}
                      </p>

                    </div>
                    <div className="text-center mt-4">
                    <Button variant="outline" className="text-sm ">
                      Parcourir
                    </Button>
                    </div>
                    </>
                  )}
                  />
              ) : (
                <div onClick={(e) => {
                          e.stopPropagation();
                          handleExpandImage(area.id);
                        }} className="relative w-full h-full">
                  <img
                    src={images[area.id]}
                    alt={area.label}
                    className="w-full h-full  object-cover rounded-lg "
                  />
                  
                  {/* Hover overlay with buttons */}
                  <div className="absolute inset-0 bg-rod-primary/20 rounded-lg group  group-hover:bg-rod-primary/55 transition-all duration-500 pointer-events-none">
                    <div className="absolute top-2 right-2 flex gap-2 pointer-events-auto z-20">
                      
                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(area.id);
                        }}
                        className="w-8 h-8 bg-white cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-rod-foreground rounded-md flex items-center justify-center transition-opacity duration-300 ease-in-out shadow-md backdrop-blur-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                
                  
                  {/* Text overlay in bottom-left corner */}
                  <div className="absolute bottom-4 left-4 text-white drop-shadow-lg gap-y-3">
                    <p className="text-xl  font-medium leading-tight">{area.label}</p>
                    <p className="opacity-90  leading-tight">{area.subtitle}</p>
                  </div>
                </div>
              )  
              }
            </div> 
        ))}
        
        {/* Information Notice */}
        <div className="flex items-center max-h-[214px] gap-3 p-4 bg-amber-600/10 text-amber-600 border  border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 = flex-shrink-0 mb-11" />
          <div className="flex flex-col justify-center">
            <p className="text-lg font-medium ">Information importante</p>
            <p className="text-sm  mt-1 text-amber-600/80">
              La qualité des images influe sur la visibilité de vos offres.
            </p>
          </div>
        </div>
      </form>
      </Form>
      {/* Action Buttons  */}
      <div className=" w-full flex-shrink-0 mt-6">
        <div className="w-full flex justify-between gap-4">
          <Button onClick={prev} type="button" variant="outline">
            <ChevronLeft />
            Précédent
          </Button>
          <Button type="submit" form="add-garage-car-images-form"  variant="default"  className="flex items-center gap-2">
            Suivant
            <ChevronRight/>
          </Button>
        </div>
        
      </div>
    </div> 
  {/* Full-Page Modal for Expanded Image */}
    {expandedImage &&
  ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] bg-rod-primary/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={handleCloseExpanded}
      style={{ pointerEvents: 'auto' }} // make sure it's clickable
    >

      


      {/* Invisible blocker to prevent background interactions */}
      <div className="absolute inset-0 z-0" />

      {/* Content wrapper that stops propagation */}
      <div
        className="relative z-10 max-w-full max-h-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCloseExpanded();
          }}
           className="fixed top-4 right-4 cursor-pointer transition-all duration-300 ease-in-out  flex items-center justify-center"
        >
          <X className="w-6 h-6 text-gray-300 hover:text-gray-400" />
        </button>

        {/* Image */}
        <img
          src={expandedImage.src}
          alt={expandedImage.label}
          className="max-w-full max-h-[80dvh] object-contain rounded-lg shadow-2xl"
        />

        {/* Caption */}
        <div className="mt-6 text-center text-white">
          <h2 className="text-2xl font-semibold">{expandedImage.label}</h2>
          <p className="text-lg opacity-80">{expandedImage.subtitle}</p>
        </div>
      </div>
    </div>,
    document.body
  )}

    </>
  );
};

export default CarImages;