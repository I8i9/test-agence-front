import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, SearchX, Search, ChevronLeft, ChevronRight, Store, Loader2, Mail, Phone, MapPin } from "lucide-react";
import ToolTipCustom from "../../../customUi/tooltip";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import useFetchFournisseur from "../../../../api/queries/fournisseurs/useFetchFournisseur";
import { fournisseurTypes, getTypeStyle } from "../../../../utils/fournisseur";

const CreateDepenseStep2 = ({ setDepenseData, DepenseData, next, prev }) => {
  const [selectedFournisseurId, setSelectedFournisseurId] = useState({id : DepenseData?.id_fournisseur || "" , data : null});
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: FournisseurData, error, isFetching } = useFetchFournisseur();

  useEffect(() => {
    if (selectedFournisseurId?.id && selectedFournisseurId?.id !== DepenseData.id_fournisseur) {
      setDepenseData(prev => ({ ...prev, id_fournisseur: selectedFournisseurId?.id  , fournisseur : selectedFournisseurId?.data }) );
    }
  }, [selectedFournisseurId?.id, setDepenseData, DepenseData.id_fournisseur]); 
  
  if (error) {
    toast.error("Une erreur est survenue. Veuillez réessayer.");
  }

  const fournisseurs = FournisseurData || [];

  // Extract unique types from fournisseurs data
  const types = [...new Set(fournisseurs.map(f => f.type_fournisseur))].sort();

  // Filter fournisseurs based on selected filters and search term
  const filteredFournisseurs = fournisseurs.filter(fournisseur => {
    const matchesType = selectedType === 'all' || !selectedType || fournisseur.type_fournisseur === selectedType;
    const matchesSearch = !searchTerm || 
      fournisseur.nom_fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fournisseur.type_fournisseur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fournisseur.contact_name_fournisseur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fournisseur.email_fournisseur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fournisseur.telephone_fournisseur?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleNext = () => {
    if (!selectedFournisseurId?.id) {
      toast.error("Veuillez sélectionner un fournisseur avant de continuer.");
      return;
    }
    next();
  };

  const handleNextNull = () => {
    setDepenseData(prev => ({ ...prev, id_fournisseur: null }));
    next();
  };

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      {/* Header */}
      <div className='w-full flex gap-2 p-1'>
        <div>
          <Select value={selectedType} onValueChange={handleTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Tous les types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>{fournisseurTypes[type]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="relative flex items-center w-[320px] ml-auto ">
          <span className="absolute left-2 text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <Input 
            placeholder="Rechercher..." 
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          /> 
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
        {isFetching && (
          <div className='self-center place-self-center flex flex-col items-center justify-center h-full'>
            <Loader2 className="animate-spin" />
          </div>
        )}
        
        {filteredFournisseurs.length === 0 && !isFetching ? (
          <div className="flex-1 w-full flex flex-col items-center justify-center gap-2">
            {(selectedType === 'all' && searchTerm === '') ? (
              <div className='flex flex-col items-center gap-1'>
                <span className='p-2 bg-rod-foreground rounded-full'>
                  <Store className='w-8 h-8' />
                </span>
                <span className='text-gray-600 text-lg'>Aucun fournisseur n'est disponible</span>
              </div>
            ) : (
              <div className='flex flex-col items-center gap-1'>
                <span className='p-2 bg-rod-foreground rounded-full'>
                  <SearchX className='w-8 h-8 text-rod-primary' />
                </span>
                <span className='text-gray-600 text-lg'>Aucun fournisseur trouvé</span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full flex-1 overflow-y-auto ">
            <div className="grid grid-cols-3 gap-4 p-1">
              {filteredFournisseurs.map(fournisseur => (
                <div key={fournisseur.id_fournisseur}>
                  <FournisseurCard 
                    fournisseur={fournisseur} 
                    isSelected={selectedFournisseurId?.id === fournisseur.id_fournisseur}
                    onSelect={setSelectedFournisseurId}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>
        
        <div className="flex gap-4">
          <Button variant="ghost" onClick={handleNextNull}>
            Dépense sans fournisseur
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!selectedFournisseurId?.id || isFetching}
          >
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateDepenseStep2;

const FournisseurCard = ({ fournisseur, isSelected, onSelect }) => {
  const handleCardClick = () => {
    onSelect(isSelected ? null : {id: fournisseur.id_fournisseur, data: fournisseur});
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`relative w-full h-[216px] flex flex-col p-4 bg-white rounded-lg border transition-all cursor-pointer  ${
        isSelected ? 'ring-2 ring-rod-primary' : 'hover:border-gray-300'
      }`}
    >
      {/* Type badge */}
      <div className={`absolute z-10 top-2 left-2  text-xs rounded-sm font-medium px-1.5 py-0.5 ${getTypeStyle(fournisseur.type_fournisseur)}`}>
        {fournisseurTypes[fournisseur.type_fournisseur]}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className='absolute top-2 right-2 bg-rod-primary text-white rounded-full p-1'>
          <Check className='w-4 h-4' />
        </div>
      )}
      
      {/* Logo or Icon */}
      <div className="w-full h-28 flex items-center justify-center mb-3 mt-4">
        <Avatar className="size-28 border">
          <AvatarImage className="object-cover" src={fournisseur.logo_fournisseur} alt={fournisseur.nom_fournisseur} />
          <AvatarFallback className="bg-rod-foreground">
            <Store className="w-8 h-8 text-rod-primary" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Fournisseur details */}
      <div className="flex flex-col gap-2 items-center flex-1">
        <ToolTipCustom 
          trigger={
            <h3 className="text-lg font-medium text-rod-primary leading-none truncate max-w-full text-center">
              {fournisseur.nom_fournisseur}
            </h3>
          }
          message={fournisseur.nom_fournisseur}
        />

        {fournisseur.contact_name_fournisseur && (
          <ToolTipCustom 
            trigger={
              <p className="text-sm text-gray-500 leading-none truncate max-w-full">
                {fournisseur.contact_name_fournisseur}
              </p>
            }
            message={fournisseur.contact_name_fournisseur}
          />
        )}

      
      </div>
    </div>
  );
};