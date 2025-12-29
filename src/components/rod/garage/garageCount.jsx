import React from 'react';
import { Loader2, TriangleAlert } from 'lucide-react';
import { useFetchGarageCount } from '../../../api/queries/garage/useCountGarage.js';
import ToolTipCustom from '../../customUi/tooltip.jsx';
import { useStore } from '../../../store/store.js';

const GarageCount = ({isSelected}) => {
    const { data , isLoading } = useFetchGarageCount();
    const user = useStore(state => state.user);
    
    if (user?.agency?.isExpired) {
        return null;
    }
    return (
        <ToolTipCustom
            trigger={data && data?.count !== 0 &&
            <span className={` flex justify-center items-center  leading-none rounded-sm ${isSelected ? 'text-white' : 'text-amber-600'} `}>
                {(data?.count > 0 && !isLoading) && <TriangleAlert className='w-5 h-5' />}
            </span>
            }
            message = {isLoading ? "Chargement..." : `Vous avez ${data?.count} voiture${data?.count > 1 ? 's' : ''} avec des problèmes`}

        />
    );
};

export default GarageCount;