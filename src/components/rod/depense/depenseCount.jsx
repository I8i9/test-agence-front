import { Loader2 } from 'lucide-react';
import { useFetchDepenseCount } from '../../../api/queries/depense/useFetchCountDepense';
import ToolTipCustom from '../../customUi/tooltip'
import { useStore } from '../../../store/store';
const DepenseCount = ({ isSelected }) => {
    const { data , isLoading } = useFetchDepenseCount();
    const user = useStore(state => state.user);
    console.log(user?.agency?.isExpired )
    
    if (user?.agency?.isExpired) {
        return null;
    }
    return (
        <ToolTipCustom
                trigger=
            {
                data && data?.countReminders !==0 &&
                <span className={`text-xs font-semibold px-1.5 py-1 leading-none rounded-sm ${isSelected ? "bg-rod-accent" : "bg-amber-500"} text-white`}>
                    {isLoading ? <Loader2 className="animate-spin text-white" /> : data?.countReminders}
                </span>
            }
        message={isLoading ? "Chargement..." : `Vous avez ${data?.countReminders} dépense${data?.countReminders > 1 ? 's' : ''} à régler`}
        />

    );
};

export default DepenseCount;