import React, { useState, useEffect } from "react"
import { MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton'
import { useMapQuery } from "../../api/queries/maps/usemapquery"
import { useDebounce } from "../../hooks/useDebounce" // Import your debounce hook

const LoadingSearchSkeleton = () => (
  <div className="flex flex-col p-2">
    {[...Array(3)].map((_, idx) => (
      <div key={idx} className="flex items-center gap-3 px-4 py-2 h-10 w-full">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
)

export function MapInput({ field, prev }) {
  // Input value that updates immediately
  const [inputValue, setInputValue] = useState(field.value?.title || '')
  const [focused, setFocused] = useState(false)

  // Debounced value that updates after 500ms delay
  const debouncedInputValue = useDebounce(inputValue, 500)

  // Use the debounced value for API calls
  const { data, isFetching } = useMapQuery(debouncedInputValue)

  console.log('map input data ', data);

  // Met à jour le texte si on clique sur la carte (field.value change de l'extérieur)
  useEffect(() => {
    if (field.value?.title && field.value.title !== inputValue) {
      setInputValue(field.value.title);
    }
  }, [field.value?.title]);

  const handleSelect = (item) => {
    const newLocation = {
      lng: item.geometry.location.lng,
      lat: item.geometry.location.lat,
      title: item.formatted_address
    };
    setInputValue(item.formatted_address); // Use formatted_address, not item.title
    field.onChange(newLocation);
    setFocused(false);
  };

  // Show loading indicator while typing (before debounce completes)
  const isTyping = inputValue !== debouncedInputValue;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          value={inputValue}
          placeholder={prev || 'Rechercher le lieu de l\'agence'}
          onChange={(e) => {
            setInputValue(e.target.value);
            setFocused(true);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
        />
       
      </div>

      {focused && debouncedInputValue.trim().length > 1 ? (
        <Card className="absolute z-50 mt-2 w-full p-0 shadow-lg overflow-hidden bg-white">
          {isFetching || isTyping ? (
            <LoadingSearchSkeleton />
          ) : data?.results?.length ? (
            <div className="flex flex-col max-h-[250px] overflow-y-auto">
              {data.results.map((item, i) => (
                <button
                  key={item.place_id || i}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Empêche le onBlur avant le clic
                    handleSelect(item);
                  }}
                  className="flex items-center px-4 py-3 hover:bg-slate-50 transition-colors gap-3 border-b last:border-0 text-left"
                >
                  <MapPin className="text-blue-500 shrink-0 mb-0.5" size={16} />
                  <span className="text-sm font-medium truncate">
                    {item.formatted_address}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              Aucun résultat trouvé pour "{debouncedInputValue}"
            </div>
          )}
        </Card>
      ):null}
    </div>
  )
}