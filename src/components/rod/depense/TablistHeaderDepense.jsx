// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function TabsListDepense({ selected, setSelected, depenseCount }) {
  console.log('Depense count rendered:', depenseCount);

  const statuses = [
    { label: 'À Régler', couleur: '#F59E0B' },
    { label: 'Rappel', couleur: '#0369A1' },
    { label: 'Dépenses', couleur: '#D90429' }
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
              layoutId="tabHighlightDepense"
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
              ? depenseCount?.countReminders || 0
              : index === 1
              ? depenseCount?.countRappels || 0
              : depenseCount?.countDepenses || 0}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TabsListDepense;
