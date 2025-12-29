import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Check, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" 
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const CreateDepenseStep4 = ({ setDepenseData, DepenseData, next, prev }) => {
  const [selectedOption, setSelectedOption] = useState(DepenseData?.option_paiement || "full")
  const totalAmount = DepenseData?.montant_depense || 0 

  const formSchema = z.object({
    montant_paye: z.union([
      z.string().refine(val => val === "" || !isNaN(Number(val)), "Doit être un nombre valide"),
      z.number(),
    ])
      .transform(val => Number(val) || 0)
      .refine(val => val >= 0, "Le montant payé doit être positif")
      .refine(val => val <= totalAmount - (DepenseData?.rts_depense || 0), `Le montant payé ne peut pas dépasser ${(totalAmount - (DepenseData?.rts_depense || 0)).toFixed(3)} DT`), 
    mode_paiement: z.enum(["VIREMENT", "CHEQUE", "ESPECE", "TRAITE"], {
      required_error: "La méthode de paiement est requise",
    }),
    reference_paiement: z.string().optional(),
    paiement_echelonne: z.boolean().default(false),
  })
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      montant_paye: DepenseData?.montant_paye || 0,
      mode_paiement: DepenseData?.mode_paiement || "ESPECE",
      reference_paiement: DepenseData?.reference_paiement || "",
      paiement_echelonne: DepenseData?.paiement_echelonne || false,
    },
  })

  // Update form values when payment option changes
  useEffect(() => {
    if (selectedOption === "full") {
      form.setValue("montant_paye", totalAmount - (DepenseData?.rts_depense || 0))
      form.setValue("paiement_echelonne", false)
    } else if (selectedOption === "partial") {
      form.setValue("montant_paye", DepenseData?.montant_paye || 0)
      form.setValue("paiement_echelonne", true)
    } else if (selectedOption === "none") {
      form.setValue("montant_paye", 0)
      form.setValue("paiement_echelonne", true)
    }
  }, [selectedOption, totalAmount, form])

  const onSubmit = (data) => {
    setDepenseData((prev) => ({
      ...prev,
      montant_paye: data.montant_paye,
      mode_paiement: data.mode_paiement,
      reference_paiement: data.reference_paiement || null,
      paiement_echelonne: data.paiement_echelonne,
      option_paiement: selectedOption,
    }))
    next()
  }

  const isInputDisabled = selectedOption === "none"
  const isAmountDisabled = selectedOption === "full" || selectedOption === "none"
  const isReferenceDisabled = form.watch("mode_paiement") === "ESPECE"

  return (
    <div className="flex flex-col h-full">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto space-y-6 p-1">
        <Form {...form}>
          <form id="declarer-depense-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6"> 

            {/* Payment Options */}
            <div className="space-y-4">
              <div className="flex gap-3">
                {/* Full Payment Option */}
                <Card
                  className={`flex-1 p-4 shadow-none cursor-pointer transition-all border-2 ${
                    selectedOption === "full"
                      ? "border-green-500 "
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => setSelectedOption("full")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        selectedOption === "full" ? "bg-green-500" : "bg-green-100"
                      }`}
                    >
                      <Check
                        className={`w-5 h-5 ${selectedOption === "full" ? "text-white" : "text-green-600"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">Paiement Complet</h4>
                      <p className="text-xs text-gray-600">Montant total</p>
                    </div>
                  </div>
                </Card>

                {/* Partial Payment Option */}
                <Card
                  className={`flex-1 p-4 shadow-none cursor-pointer transition-all border-2 ${
                    selectedOption === "partial"
                      ? "border-blue-500 "
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => setSelectedOption("partial")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        selectedOption === "partial" ? "bg-blue-500" : "bg-blue-100"
                      }`}
                    >
                      <Clock
                        className={`w-5 h-5 ${
                          selectedOption === "partial" ? "text-white" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">Paiement Échelonné</h4>
                      <p className="text-xs text-gray-600">Montant partiel</p>
                    </div>
                  </div>
                </Card>

                {/* No Payment Option */}
                <Card
                  className={`flex-1 p-4 shadow-none cursor-pointer transition-all border-2 ${
                    selectedOption === "none"
                      ? "border-red-500 "
                      : "border-border hover:bg-muted"
                  }`}
                  onClick={() => setSelectedOption("none")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        selectedOption === "none" ? "bg-red-500 " : "bg-red-100"
                      }`}
                    >
                      <X
                        className={`w-5 h-5 ${selectedOption === "none" ? "text-white" : "text-red-600"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm">Pas de Paiement</h4>
                      <p className="text-xs text-gray-600">Plus tard</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Payment Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="montant_paye"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Montant Payé</FormLabel>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01" 
                          className="pr-12 bg-white border-gray-200 "
                          disabled={isAmountDisabled}
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <span
                          className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none transition-opacity duration-200 ${
                            isAmountDisabled ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          DT
                        </span>
                      </div>
                      {form.formState.errors?.montant_paye ? (
                        <FormMessage />
                      ) : (
                        <FormDescription >
                          {selectedOption === "partial" && `Max: ${(totalAmount - (DepenseData?.rts_depense || 0)).toFixed(3)} DT`}
                          {selectedOption === "full" && "Paiement du montant total"}
                          {selectedOption === "none" && "Aucun paiement pour le moment"}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mode_paiement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel >Méthode de Paiement</FormLabel>
                      <FormControl>
                        <Select 
                          value={field.value} 
                          onValueChange={field.onChange}
                          disabled={isInputDisabled}
                        >
                          <SelectTrigger 
                            className="w-full bg-white border-gray-200 "
                            disabled={isInputDisabled}
                          >
                            <SelectValue placeholder="Sélectionnez une méthode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VIREMENT">Virement Bancaire</SelectItem>
                            <SelectItem value="CHEQUE">Chèque</SelectItem>
                            <SelectItem value="TRAITE">Traite</SelectItem>
                            <SelectItem value="ESPECE">Espèces</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      {form.formState.errors?.mode_paiement ? (
                        <FormMessage />
                      ) : (
                        <FormDescription >
                          Sélectionnez la méthode de paiement utilisée
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reference_paiement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel >
                      Référence de Paiement 
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: RIB, numéro de chèque, numéro de transaction..."
                        className="bg-white border-gray-200 "
                        disabled={isInputDisabled || isReferenceDisabled}
                        {...field}
                      />
                    </FormControl>
                    {form.formState.errors?.reference_paiement ? (
                      <FormMessage />
                    ) : (
                      <FormDescription >
                        Numéro de chèque, RIB, ou référence de transaction
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between mt-4 pt-4 border-t">
        <Button variant="outline" onClick={prev} className="rounded-sm">
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>

        <Button form="declarer-depense-form" className="rounded-sm">
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default CreateDepenseStep4