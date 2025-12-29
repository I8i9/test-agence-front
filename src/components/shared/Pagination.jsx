import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function Pagination({ table , isLoading , isError = false }) {
  const pageCount = table.getPageCount();
  const [inputValue, setInputValue] = useState("1");
  const pageIndex = table.getState().pagination.pageIndex;
  
    const handleInputChange = (e) => {
      const val = e.target.value;
      if (/^\d*$/.test(val)) {
        setInputValue(val); // Accept only digits
      }
    };
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        let value = parseInt(inputValue, 10);
  
        if (isNaN(value) && inputValue !== "") 
           return;
  
        if (value < 1 || inputValue==="") value = 1;
        if (value > pageCount) value = pageCount;
  
        table.setPageIndex(value - 1); // Use TanStack's method
        setInputValue(value.toString()); // Reflect the validated value
      }
    };

    useEffect(() => {
      if( inputValue !== pageIndex + 1){
        setInputValue(pageIndex + 1);
      }
    }, [pageIndex]);

  if (isLoading || isError || table.getRowModel().rows.length === 0 ) {
    return null; 
  }
  return (
    <div className = "w-full h-full">
        <div className="flex items-center justify-end"> 
          
          <div className="flex items-center">
                  <Button
                    variant="ghost"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="h-8 flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
          
                  <span className="flex items-center gap-1">
                    <Input
                      type="text"
                      maxLength={2}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-7 h-7 px-0 mr-1 !text-base text-center border-none"
                    />
                    sur <span className="px-2">{table.getPageCount()}</span>
                  </span>
          
                  <Button
                    variant="ghost"
                    onClick={() =>  table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="h-8 flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
        </div>
      </div>
  )
  }


export default Pagination