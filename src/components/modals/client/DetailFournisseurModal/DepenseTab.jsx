import { Separator } from "@/components/ui/separator";
import { DollarSign, HandCoins, Icon, Loader2, Receipt, Wallet } from 'lucide-react'; 
import { allCosts } from "../../../../utils/costs";
import { FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter';
import { Skeleton } from "../../../ui/skeleton"; 
import { useFetchFournisseurDepenses } from "../../../../api/queries/fournisseurs/useFetchFournisseurDepenses";

const DepenseSkeleton = () => (
  <div key={"expense-skeleton-garage"} className="space-y-2 flex-1 overflow-y-auto no-scrollbar py-2">
    {Array.from({ length: 7 }).map((_, index) => (       
      <div key={index} className="flex items-start justify-between border p-2 rounded-lg ">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full flex items-center justify-center"></Skeleton>
          <div>
            <Skeleton className="h-4.5 w-48"></Skeleton>
            <div className="flex gap-1 mt-2">
              <Skeleton className="h-4 w-32"></Skeleton>
              <Skeleton className={"size-0.5"}></Skeleton>
              <Skeleton className="h-4 w-32"></Skeleton>
              <Skeleton className={"size-0.5"}></Skeleton>
              <Skeleton className="h-4 w-32"></Skeleton>
              <Skeleton className={"size-0.5"}></Skeleton>
              <Skeleton className="h-4 w-32"></Skeleton>
            </div>
          </div>
        </div>
        <Skeleton className="h-5 w-24 p-2"></Skeleton>
      </div>
    ))}
  </div>
)

const DepensesTab = ({ fournisseurId }) => {
  const { data, isLoading, error, isError } = useFetchFournisseurDepenses(fournisseurId);
  console.log("Fournisseur Depenses Data:", data);
  
  const expenses = data || [];
  const totalAmount = expenses.reduce((total, expense) => total + expense.montant_depense, 0);

  // Error state
  if (isError || error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">{error?.message || 'Une erreur est survenue'}</p>
      </div>
    );
  }

  return (
    <div className="h-full   flex flex-col ">
      {/* Loading State */}
      {isLoading ? (
        <DepenseSkeleton />
      ) : expenses.length === 0 ? (
        // Empty State - now inside the main structure
        <div className="h-[523px] flex flex-col items-center justify-center gap-2">
          <span className="p-3 rounded-xl bg-rod-foreground mb-1">
            <HandCoins className="w-8 h-8 mx-auto" />
          </span>
          <p className="text-xl font-semibold">Aucune dépense enregistrée</p>
          <p className="text-gray-500 text-lg leading-none text-center">
            Les frais associés à ce fournisseur apparaîtront ici.
          </p>
        </div>
      ) : (
        <>
          {/* Expenses List */}
          <div key={"expense-modal-garage"} className="h-[470px] space-y-2 overflow-y-auto no-scrollbar py-2 ">
            {expenses.map((expense) => {
              const { icon: IconComponent, label } = allCosts.find(cost => cost.value === expense.type_depense) || allCosts.find(cost => cost.value === "AUTRE");
              return (
                <div key={expense.id_depense} className="flex items-start justify-between p-2 border rounded-lg hover:bg-rod-foreground">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                      {expense.type_depense === "PNEUS" ? (
                        <Icon iconNode={IconComponent} /> 
                      ) : (
                        <IconComponent />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-lg">{label}</p>
                      <p className="text-base flex gap-3 text-gray-500">
                        {expense.sequence_depense && (
                          <span>{expense.sequence_depense}</span>
                        )}
                        •
                        <span>{FormatDateEEEEddMMyyyy(expense.date_creation_depense)}</span>
                        {expense.kilometrage_depense && (
                          <>
                            •
                            <span>{expense.kilometrage_depense + " Km"}</span>
                          </>
                        )}
                        {expense.recu_depense && (
                          <>
                            •
                            <span>{expense.recu_depense}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-xl p-2">
                    {parseFloat(expense.montant_depense.toFixed(2))} DT
                  </span>
                </div>
              );
            })}
          </div>

          {/* Total Section - Fixed at bottom */}
          <div key={"costs-total"} className="flex-shrink-0">
            <div className="mb-4">
              <Separator />
            </div>
            <div className="flex justify-between items-center px-2">
              <span className="text-xl font-medium flex items-center gap-2">
                <span className="p-2 rounded-lg bg-rod-foreground">
                  <DollarSign className="w-6 h-6" />
                </span>
                <span className="font-semibold">Total Dépenses</span>
              </span>
              <span className="text-xl flex items-end flex-col gap-1 font-semibold">
                <span className="leading-none">{parseFloat(totalAmount.toFixed(2))} DT</span>
                <span className="leading-none text-gray-500 text-base font-normal">
                  ({expenses.length} {expenses.length > 1 ? "dépenses" : "dépense"})
                </span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DepensesTab;