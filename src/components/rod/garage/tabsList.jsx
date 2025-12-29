import { useState, useMemo, startTransition } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function TabsListGarage({ table, isLoading }) {
  const allRows = table.getPreFilteredRowModel().rows;

  const counts = useMemo(() => {
    return allRows.reduce((acc, row) => {
      const status = row.getValue('status_garage');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [allRows]);

  const statuses = [
    { label: 'Toutes', value: 'all', number: isLoading ? "" : allRows.length || 0, couleur: '#231F20' },
    { label: 'Disponible', value: 'DISPONIBLE', number: isLoading ? "" : counts['DISPONIBLE'] || 0, couleur: '#047857' },
    { label: 'En location', value: 'EN_LOCATION', number: isLoading ? "" : counts['EN_LOCATION'] || 0, couleur: '#0369A1' },
    { label: 'Publié', value: 'PUBLIE', number: isLoading ? "" : counts['PUBLIE'] || 0, couleur: '#D97706' },
    { label: 'En panne', value: 'EN_PANNE', number: isLoading ? "" : counts['EN_PANNE'] || 0, couleur: '#D90429' },
  ];

  const [selected, setSelected] = useState(0);

  const handleClick = (index, value) => {
    setSelected(index);
    startTransition(() => {
      if (value === 'all') {
        table.setColumnFilters(
          table.getState().columnFilters.filter(filter => filter.id !== 'status_garage')
        );
      } else {
        table.setColumnFilters([
          ...table.getState().columnFilters,
          { id: 'status_garage', value: value }
        ]);
      }
    });
  };

  return (
    <div className="w-full flex items-center justify-between h-full rounded-md py-1 px-1 bg-rod-foreground cursor-pointer relative">
      {statuses.map(({ label, value, number, couleur }, index) => (
        <div
          key={index}
          onClick={() => handleClick(index, value)}
          className="w-full h-full py-1 laptop:px-2.5 px-3 rounded-sm flex justify-center font-normal items-center gap-2 relative"
        >
          {selected === index && (
            <motion.div
              layoutId="tabHighlightGarage"
              className="absolute inset-0 rounded-sm bg-white"
               transition={{ type: 'spring', stiffness: 250, damping: 30 }}
            />
          )}
          <span
            className={`text-base font-medium whitespace-nowrap relative z-10 ${
              selected === index ? 'text-rod-primary' : 'text-gray-500'
            }`}
          >
            {label}
          </span>
          <div
            style={{ backgroundColor: couleur }}
            className="text-white text-xs font-semibold flex justify-center rounded-xs items-center px-1 leading-none py-0.5 relative z-10"
          >
            {number}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TabsListGarage;
