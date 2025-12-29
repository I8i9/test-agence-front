import { X } from 'lucide-react';
import React from 'react'
import ReactDOM from 'react-dom';


const ImagesCard = ({images}) => {

    const [expand , setExpand] = React.useState(null);

    const handleExpandImage = (areaId) => {
     const area = uploadAreas.find(a => a.id === areaId);
      setExpand({
        src: images[areaId],
        label: area.label,
        subtitle: area.subtitle
      }); 
    }; 

    const handleCloseExpanded = () => {
    setExpand(null);
    };

    const uploadAreas = [
    { id: 'front_image_garage', label: 'Vue Avant', subtitle: 'Face avant du véhicule',  },
    { id: 'rear_image_garage', label: 'Vue Arrière', subtitle: 'Face arrière du véhicule',  },
    { id: 'right_image_garage', label: 'Vue Droite', subtitle: 'Face droite du véhicule',  },
    { id: 'left_image_garage', label: 'Vue Gauche', subtitle: 'Face gauche du véhicule',  },
    { id: 'interior_image_garage', label: 'Vue Intérieure', subtitle: 'Face intérieure du véhicule', }
  ];
  return (
    <div  className='grid grid-cols-3 grid-rows-2  gap-8 h-[450px]'>
        {Object.entries(images).map(([key, value]) => (
          <div onClick={() => {handleExpandImage(key);}} key={key} src={value} alt={`${key}`} className='w-full relative h-full max-h-[214px] border-gray-300 hover:bg-rod-foreground rounded-lg group  transition-colors cursor-pointer flex flex-col items-center justify-center group' >

            <img src={value} alt={`${key}`} className='w-full h-full object-cover rounded-lg '/>
            <div className="absolute inset-0 bg-rod-primary/20 rounded-lg group group-hover:bg-rod-primary/55 transition-all duration-500 pointer-events-none"/>
            <div className="absolute bottom-4 left-4 text-white drop-shadow-lg gap-y-3">
                <p className="text-xl  font-medium leading-tight">{uploadAreas.find(area => area.id === key)?.label}</p>
                <p className="opacity-90  leading-tight">{uploadAreas.find(area => area.id === key)?.subtitle}</p>
            </div>
          </div>
        ))}

     {expand &&
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
                src={expand.src}
                alt={expand.label}
                className="max-w-full max-h-[80dvh] object-contain rounded-lg shadow-2xl"
              />

              {/* Caption */}
              <div className="mt-6 text-center text-white">
                <h2 className="text-2xl font-semibold">{expand.label}</h2>
                <p className="text-lg opacity-80">{expand.subtitle}</p>
              </div>
            </div>
          </div>,
          document.body
    )}
    </div>
  )
}

export default ImagesCard