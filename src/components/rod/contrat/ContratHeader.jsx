import { useState, useMemo } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Input } from "../../../components/ui/input.jsx";
import { Search, SquarePlus } from "lucide-react";
import CreateCspModal from "../../modals/contrat/CreateCspModal/CreateCspModal";
import { Button } from "../../ui/button.jsx";

function TabsListContrats({ table }) {
  const allRows = table.getPreFilteredRowModel().rows;

  const counts = useMemo(() => {
    // Count contracts that have each status in their statuses array
    return allRows.reduce((acc, row) => {
      const statuses = row.original?.statuses || [];
      statuses.forEach(status => {
        acc[status] = (acc[status] || 0) + 1;
      });
      return acc;
    }, {});
  }, [allRows]);

  const statuses = [
    { label: "En cours", value: "En_cours", couleur: "#047857" },
    { label: "Planifié", value: "Planifiee", couleur: "#0369A1" },
    { label: "Bientôt Expire", value: "Bientot_expire", couleur: "#D97706" },
    { label: "Expiré", value: "Termine", couleur: "#D90429" },
    { label: "À Régulariser", value: "Impaye", couleur: "#18181b" },
  ];

  const [selected, setSelected] = useState(0);

  const handleClick = (index, value) => {
    const filters = [
      ...table.getState().columnFilters.filter((f) => f.id !== "statuses"),
      { id: "statuses", value },
    ];
    table.setColumnFilters(filters);
    setSelected(index);
  };

  return (
    <div className="w-full flex items-center justify-center gap-1 h-full rounded-md py-1 px-1 bg-rod-foreground cursor-pointer relative">
      {statuses.map(({ label, value, couleur }, index) => (
        <div
          key={index}
          onClick={() => handleClick(index, value)}
          className="w-full h-full py-1 laptop:px-2.5 px-3 rounded-sm flex justify-center font-normal items-center gap-2 relative"
        >
          {selected === index && (
            <motion.div
              layoutId="tabHighlightContrat"
              className="absolute inset-0 rounded-sm"
              style={{ backgroundColor: 'white' }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
            />
          )}
          <span
            className={`text-base font-medium whitespace-nowrap relative z-10 ${
              selected === index ? "text-rod-primary" : "text-gray-500"
            }`}
          >
            {label}
          </span>
          <div
            style={{ backgroundColor: couleur }}
            className="text-white text-xs font-semibold flex justify-center rounded-xs items-center px-1 leading-none py-0.5 relative z-10"
          >
            {counts[value] || 0}
          </div>
        </div>
      ))}
    </div>
  );
}

const ContratHeader = ({ table, setGlobalFilter, globalFilter }) => {
  const [ContractCspopen, setContractCspopen] = useState(false);

  return (
    <div className="flex w-full h-full justify-between">
      <div className="h-full col-start-1 col-span-2">
        <Button
          onClick={() => setContractCspopen(true)}
          className="flex items-center leading-none gap-2 h-full whitespace-nowrap"
        >
          <SquarePlus /> Contrat Sur Place
        </Button>
      </div>
      <div className="flex gap-4">
      <div className="col-start-3 col-span-3 h-full">
        <TabsListContrats table={table} />
      </div>
      
      <div className="relative w-full max-w-[272px] desktop:max-w-full h-full">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Rechercher..."
          className="w-full px-10 h-full"
        />
      </div>
      
      {ContractCspopen && (
        <CreateCspModal open={ContractCspopen} setOpen={setContractCspopen} />
      )}
      </div>
    </div>
  );
};

export default ContratHeader;