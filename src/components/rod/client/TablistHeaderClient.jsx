// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function TabsListClient({ selected, setSelected, fournisseursClientCount }) {
  console.log('Client count rendered:', fournisseursClientCount);

  const statuses = [
    { label: 'Fournisseurs', couleur: '#0369A1' }, 
    { label: 'Clients', couleur: '#F59E0B' },
  ];

  return (
    <div className="w-full flex items-center justify-between h-full rounded-md py-1 px-1 bg-rod-foreground cursor-pointer relative">
      {statuses.map(({ label, couleur }, index) => (
        <div
          key={index}
          onClick={() => setSelected(index)}
          className="w-full h-full py-1 laptop:px-2.5 px-3 rounded-sm flex justify-center font-normal items-center gap-2 relative"
        >
          {/* Sliding highlight animation */}
          {selected === index && (
            <motion.div
              layoutId="tabHighlightClient"
              className="absolute inset-0 rounded-sm"
              style={{ backgroundColor: 'white' }}
               transition={{ type: 'spring', stiffness: 250, damping: 30 }}
            />
          )}

          <span  className={`text-base font-medium whitespace-nowrap relative z-10 ${
              selected === index ? 'text-rod-primary' : 'text-gray-500'
            }`}>
            {label}
          </span>
          <div
            style={{ backgroundColor: couleur }}
            className='text-white text-xs font-semibold flex justify-center rounded-xs items-center px-1 leading-none py-0.5 relative z-10'
          >
            {index === 0
                ? fournisseursClientCount?.fournisseurs || 0                            
                : fournisseursClientCount?.clients || 0
            }
          </div>
        </div>
      ))}
    </div>
  );
}

export default TabsListClient;
