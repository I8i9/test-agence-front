import { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function TabsListOffres({ table }) {

  const statuses = [
    { label: 'Active', value: 'En cours', couleur: '#047857' },      // Active
    { label: 'Suspendu', value: 'Suspendu', couleur: '#0369A1' },    // Paused
    { label: 'Terminée', value: 'Terminée', couleur: '#D90429' },    // Finished
  ];


  const allRows = table.getPreFilteredRowModel().rows;

  // Comptage des statuts
  const counts = useMemo(() => {
    return allRows.reduce((acc, row) => {
      const status = row.original?.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [allRows]);



  const [selected, setSelected] = useState(0);

  const handleClick = (index, value) => {
    const filters = value
      ? [...table.getState().columnFilters.filter(f => f.id !== 'status'), { id: 'status', value }]
      : table.getState().columnFilters.filter(f => f.id !== 'status');

    table.setColumnFilters(filters);
    setSelected(index);
  };

  return (
    <div className="w-full flex items-center justify-between h-full rounded-md py-1 px-1 bg-rod-foreground cursor-pointer relative">
      {statuses.map(({ label, value, couleur }, index) => (
        <div
          key={index}
          onClick={() => handleClick(index, value)}
          className="w-full h-full py-1 laptop:px-2.5 px-3 rounded-sm flex justify-center font-normal items-center gap-2 relative"
        >
          {selected === index && (
            <motion.div
              layoutId="tabHighlightOffreHeader"
              className="absolute inset-0 rounded-sm"
              style={{ backgroundColor: 'white' }}
              transition={{ type: 'spring', stiffness: 250, damping: 30 }}
            />
          )}
          <span  className={`text-base font-medium whitespace-nowrap relative z-10 ${
              selected === index ? 'text-rod-primary' : 'text-gray-500'
            }`} >
            {label}
          </span>
          <div
            style={{ backgroundColor: couleur }}
            className="text-white text-xs font-semibold flex justify-center rounded-xs items-center px-1 leading-none py-0.5 relative z-10"
          >
            {value === '' ? allRows.length : counts[value] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TabsListOffres;
