import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "../../../ui/badge";
import {
  Settings,
} from "lucide-react";
import { availableOptions } from "../../../../utils/dataOptions";
function OptionsOffreCard({ optionsData }) {

  console.log("optionsData dans OptionsOffreCard:", optionsData);


  return (
    <Card className="border shadow-none h-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Settings className="w-5 h-5" />
          Options supplémentaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(optionsData).length > 0 ? (
          <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[324px] h-auto pr-2 -mr-4">
            {Object.entries(optionsData).map(([key, value]) => {
              const config = availableOptions.find(option => option.id === key);
              if (!config || !value) return null;
              const IconComponent = config.icon;

              return (
                <div
                  key={key}
                  className="flex justify-between items-start relative py-3.5 px-2.5 rounded-md border bg-background hover:bg-muted/40 h-full"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="bg-muted p-2 rounded-full ">
                      {IconComponent && (
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2.5">
                      <div>
                        <div className="flex flex-col gap-2">
                          <p className="font-medium text-sm text-foreground">
                            {config.title}
                          </p>
                          <p className="text-sm text-muted-foreground leading-none">
                            {config.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col absolute right-3 ">
                    {value && value?.mode!== "FREE" && value?.mode !== "NEGOTIABLE" ? (
                      
                      <span className="text-sm leading-none font-medium py-0.5 rounded-sm">
                        {value.mode === "FIXED"
                          ? `${value.prix} DT`
                          : value.mode === "PER_DAY"
                          && <>{value.prix + " DT"}<span className="text-xs text-gray-500">/Jour</span></>
                        }
                      </span>
                    ) : 
                    value?.mode === "FREE" ?
                    (
                      <Badge
                        variant="secondary"
                        className="text-sm font-medium px-1 py-1 leading-none rounded-sm bg-rod-foreground"
                      >
                        Gratuite
                      </Badge>
                    ):   <Badge
                        variant="secondary"
                        className="text-sm font-medium px-1 py-1 leading-none rounded-sm bg-rod-foreground"
                      >
                        À Négocier 
                      </Badge> }
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Aucune option supplémentaire disponible
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default OptionsOffreCard;