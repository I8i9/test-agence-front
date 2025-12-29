import { useState, useEffect } from "react"
import { ChevronDownIcon, ChevronUpIcon, CheckIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { z } from "zod"



export const OptionItem = ({ option, selected, onValidate, isValidated, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSelected, setIsSelected] = useState(!!selected);

  const Icon = option.icon;

  const optionConfigSchema = z
  .object({
    pricingMode: z.enum(["FREE", "FIXED", "PER_DAY","NEGOTIABLE"]),
    value: z.coerce.number().positive("Le montant doit être positif").optional(),
  })
  .refine(
    (data) => {
      // If pricing mode is not FREE, value is required
      if (data.pricingMode !== "FREE" && data.pricingMode !== "NEGOTIABLE") {
        return data.value !== undefined && data.value > 0
      }
      return true
    },
    {
      message: "Le montant est requis et doit être positif",
      path: ["value"],
    },
  )
  const form = useForm({
    resolver: zodResolver(optionConfigSchema),
    defaultValues: {
      pricingMode: selected?.pricingMode || "FREE",
      value: selected?.value,
    },
  })

  const pricingMode = form.watch("pricingMode")

  // explain why this useEffect is 
  useEffect(() => {
    setIsSelected(!!selected)
  }, [selected])



  const handleSelect = () => {
    const newSelected = !isSelected
    setIsSelected(newSelected)

    if (newSelected) {
      setIsExpanded(true)
    } else {
      setIsExpanded(false)
      onRemove()
    }
  }

  const onSubmit = (data) => {
    if (isSelected) {
      onValidate?.({
        pricingMode: data.pricingMode,
        value: data.pricingMode === "FREE" || data.pricingMode === "NEGOTIABLE" ? undefined : data.value,
      })
      setIsExpanded(false)
    }
  }

  return (
    <div
       
      className={`
        border rounded-lg transition-all 
        ${isSelected ? "border-primary bg-primary/5" : ""}
      `}
    >
    <div onClick={handleSelect} className={`border rounded-md ${!isSelected ? "hover:bg-rod-foreground" : ''} p-4 flex gap-4 cursor-pointer`}>
       <div
          className={
            `flex items-center justify-center size-10 rounded-lg shrink-0 transition-all duration-300 ${
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
            }`
          }
        >
          {isSelected ? <CheckIcon className="size-6" /> : <Icon className="size-" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base leading-tight">{option.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
            </div>
            {isExpanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
          </div>
          {isValidated && (
            <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
              ✓ Ajouté -{" "}
              {selected.pricingMode === "FREE"
                ? "Gratuite"
                : selected.pricingMode === "NEGOTIABLE"
                ? "À Négocier"
                : `${selected.pricingMode === "FIXED" ? "Fixe" : "Par Jour"}: ${selected.value} DT`}
            </div>
          )}
        </div>
        </div>


        {isSelected && isExpanded && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 pb-4 pt-2 border-t space-y-4">
            <FormField
              control={form.control}
              name="pricingMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="my-2">Frais d'option </FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {option.availableModes.includes("FREE") && (
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="FREE" id={`${option.id}-FREE`} />
                          <Label htmlFor={`${option.id}-FREE`} className="text-sm cursor-pointer">
                            Gratuite
                          </Label>
                        </div>
                      )}
                      {option.availableModes.includes("FIXED") && (
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="FIXED" id={`${option.id}-FIXED`} />
                          <Label htmlFor={`${option.id}-FIXED`} className="text-sm cursor-pointer">
                            Payant (Fixe)
                          </Label>
                        </div>
                      )}
                      {option.availableModes.includes("PER_DAY") && (
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="PER_DAY" id={`${option.id}-PER_DAY`} />
                          <Label htmlFor={`${option.id}-PER_DAY`} className="text-sm cursor-pointer">
                            Payant (Par Jour)
                          </Label>
                        </div>
                      )}

                      {option.availableModes.includes("NEGOTIABLE") && (
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="NEGOTIABLE" id={`${option.id}-NEGOTIABLE`} />
                          <Label htmlFor={`${option.id}-NEGOTIABLE`} className="text-sm cursor-pointer">
                            À négocier avec le client
                          </Label>
                        </div>
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {pricingMode !== "FREE" && pricingMode !== "NEGOTIABLE" && (
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (DT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Tapez le montant"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

              <Button type="submit" className="w-full">
                Ajouter l'option
              </Button>
          </form>
        </Form>
      )}
  </div>
  )
};