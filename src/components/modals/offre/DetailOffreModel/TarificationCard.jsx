import DetailItem from "../../../customUi/detailitem";
import { DollarSign,  CreditCard, ShieldCheck, ShieldHalf } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { useState } from "react";
const PolitiquesOffreCard = ({ data }) => {
  const [showMore, setShowMore] = useState(false);
  let ranges = [];

  if (data?.prix_dynamique_offre) {
    const sortedKeys = Object.keys(data?.prix_dynamique_offre)
      .map(Number)
      .sort((a, b) => a - b);

    ranges = [
      { min: 1, max: sortedKeys[0], price: data.prix_jour_offre },
      ...sortedKeys.map((key, index) => {
        const min = key + 1;
        const max = sortedKeys[index + 1] ?? null;
        return { min, max, price: data?.prix_dynamique_offre[key] };
      }),
    ];
  }

  const toggleShowMore = () => setShowMore(!showMore);
  const applyDiscount = (value) => value - (value * data?.promo?.taux_promo || 0) / 100;

  return (
    <Card className="shadow-none h-[340px]">
      <CardHeader >
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <CreditCard className="w-5 h-5 text-primary" /> Tarification de l'offre
        </CardTitle>
      </CardHeader>

      <CardContent className="relative space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          <DetailItem icon={DollarSign} label="Prix par jour">
            {data?.promo?.taux_promo && data?.promo?.showpromo ? (
              <div className="flex items-center gap-1">
                <span className="line-through text-xs text-muted-foreground ">
                  {Math.ceil(data.prix_jour_offre)} DT
                </span>
                <span className="font-medium ml-0.5">
                  {Math.ceil(applyDiscount(data.prix_jour_offre))} DT
                </span>
              </div>
            ) : (
              `${Math.ceil(data.prix_jour_offre)} DT`
            )}
          </DetailItem>

          <DetailItem icon={ShieldHalf} label="Caution">
            {data.depot_pol != null ? data.depot_pol === 0 ? 'Sans Caution' : `${data.depot_pol} DT` : 'Sans Caution'}
          </DetailItem>
        </div>

          <div className="flex flex-col w-full gap-2">
            <div className={`w-full ${showMore ? 'shadow-sm rounded-md bg-white' : ''}`}>
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableCell className="font-medium text-muted-foreground">Durée</TableCell>
                    <TableCell className="text-end font-medium text-muted-foreground">Prix/Jour</TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className={`${ranges.length > 2 ? 'max-h-[220px] overflow-y-auto' : ''}`}>
                  {ranges.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground font-medium">
                        Pas de tarification par durée
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {ranges.slice(0, showMore ? ranges.length : 3).map(({ min, max, price }, i) => {
                        const label = max === null ? `+${min} jours` : `${min} - ${max} jours`;
                        const applypromo = data?.promo?.showpromo;
                        const hasDiscount = !!data?.promo?.taux_promo && applypromo;
                        const finalPrice = hasDiscount && applypromo ? applyDiscount(price) : price;

                        return (
                          <TableRow key={i}>
                            <TableCell className="text-muted-foreground font-medium">{label}</TableCell>
                            <TableCell className="flex justify-end items-center gap-1">
                              {hasDiscount ? (
                                <>
                                  <div className="text-xs line-through text-muted-foreground font-medium">
                                    {Math.ceil(price)} DT
                                  </div>
                                  <div className="font-medium text-base ml-0.5 ">
                                    {Math.ceil(finalPrice)} DT
                                  </div>
                                </>
                              ) : (
                                <div className="font-medium text-base">{Math.ceil(finalPrice)} DT</div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {ranges.length > 3 && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            onClick={toggleShowMore}
                            className="text-sm font-medium text-primary leading-none text-center cursor-pointer"
                          >
                            {showMore ? "Voir moins" : "Voir plus"}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
      </CardContent>
    </Card>
  );
};

export default PolitiquesOffreCard;
