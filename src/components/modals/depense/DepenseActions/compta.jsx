import { DiamondPercentIcon, Percent, PercentCircle, Scale } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../ui/card'

import React from 'react'
import DetailItem from '../../../customUi/detailitem'

const Compta = ({ DepenseData }) => {
  return (
     <Card className="shadow-none">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium text-lg">
            <DiamondPercentIcon className="w-5 h-5" />
                Comptabilité
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className= "grid grid-cols-3 gap-x-4 gap-y-6 " >
                <DetailItem label="Pourcentage TVA" icon={Percent}>
                    <span >{DepenseData.tva_depense ? DepenseData.tva_depense + '%' : '_'}</span>
                </DetailItem>

                        <DetailItem label="Déductibilité" icon={Scale}>
                    {
                        DepenseData.deductible === true ? 'Déductible fiscalement'
                        : DepenseData.deductible === false ? 'Non déductible fiscalement'
                        : '_'
                    }
                </DetailItem>
                <DetailItem label="Taux de déductibilité " icon={PercentCircle}>{DepenseData.taux_deduction_tva || '_'}</DetailItem>
            </div>
        </CardContent>
    </Card>
  )
}

export default Compta