
import { useState, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

function TabsListDemande({ table, removeUnread, setDisabled }) {
  const allRows = table.getPreFilteredRowModel().rows;

  const counts = useMemo(() => {
    return allRows.reduce((acc, row) => {
      const status = row.original?.status_demande;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
  }, [allRows]);

  const statuses = [
    {
      label: 'Reçue',
      value: 'RECU',
      couleur: '#0369A1',
      show: {
        image: true,
        date_creation_demande: true,
        sequence_offre: true,
        lieu_depart_retour: true,
        date_debut_demande: true,
        date_fin_demande: true,
        prix_total: true,
        id_demande: true,
        client: false,
        status_demande: false,
      },
    },
    {
      label: 'Confirmé',
      value: 'APAYE',
      couleur: '#047857',
      show: {
        image: true,
        date_creation_demande: false,
        sequence_offre: false,
        lieu_depart_retour: true,
        date_debut_demande: true,
        date_fin_demande: true,
        prix_total: true,
        id_demande: true,
        client: true,
        status_demande: false,
      },
    },
    {
      label: 'Refusé',
      value: 'REFUSE',
      couleur: '#D90429',
      show: {
        image: true,
        date_creation_demande: false,
        sequence_offre: false,
        lieu_depart_retour: true,
        date_debut_demande: true,
        date_fin_demande: true,
        prix_total: true,
        id_demande: true,
        status: true,
        client: true,
        status_demande: false,
      },
    },
    {
      label: 'Annulé',
      value: 'ANNULE',
      couleur: '#F59E0B',
      show: {
        image: true,
        date_creation_demande: false,
        sequence_offre: false,
        lieu_depart_retour: true,
        date_debut_demande: true,
        date_fin_demande: true,
        prix_total: true,
        id_demande: true,
        status: true,
        client: true,
        status_demande: false,
      },
    },
  ];

  const [selected, setSelected] = useState(0);

  const handleClick = (index, value) => {
    const filters = [
      ...table.getState().columnFilters.filter(f => f.id !== 'status_demande'),
      { id: 'status_demande', value }
    ];
    table.setColumnFilters(filters);
    setSelected(index);
    setTimeout(() => {
      table.setColumnVisibility(statuses[index].show);
      if (value !== "RECU") {
        removeUnread();
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }, 200);
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
              layoutId="tabHighlightDemande"
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
            {value === "" ? allRows.length : counts[value] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TabsListDemande;
