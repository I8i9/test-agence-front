import React from 'react';
import { Loader2 } from 'lucide-react';
import { useFetchDemandeCount } from '../../../api/queries/demande/useFetchCount.js';
import ToolTipCustom from '../../customUi/tooltip.jsx';
import { useStore } from '../../../store/store.js';

const DemandeCount = () => {
    const user = useStore(state => state.user);
    const { data , isLoading } = useFetchDemandeCount({enabled: !user?.agency?.isExpired});

    if (user?.agency?.isExpired) {
        return null;
    }

    return (
        <ToolTipCustom
        trigger=
            {data && data?.count !== 0 &&
            <span className='text-xs font-semibold px-1.5 py-1 leading-none rounded-sm bg-rod-accent text-white '>
                {isLoading ? <Loader2 className="animate-spin text-white" /> : data?.count}
            </span>
            }
        message={isLoading ? "Chargement..." : `Vous avez ${data?.count} nouvelle${data?.count > 1 ? 's' : ''} demande${data?.count > 1 ? 's' : ''}`}
        />
    );
};

export default DemandeCount;