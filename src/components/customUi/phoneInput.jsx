import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Plus, X } from 'lucide-react';
import { FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const formatPhone = (input) => {
  const digits = input.replace(/\D/g, "");
  return digits.replace(/^(\d{0,2})(\d{0,3})(\d{0,3}).*/, (_, p1, p2, p3) =>
    [p1, p2, p3].filter(Boolean).join(" ")
  );
};

const unformatPhone = (input) => {
  return input.replace(/\D/g, "");
};

const PhoneInput = ({ field, placeholder = [] }) => {
  const [phonelist, setPhonelist] = useState(placeholder); // UI only
  const [phone, setPhone] = useState('');
  const [errorPhone, setErrorPhone] = useState(null);

  const regex = /^[24579]\d{7}$/;

  const handleAddPhoneNumber = () => {
    const phoneRaw = unformatPhone(phone);
    if (phonelist.includes(phoneRaw)) {
      return setErrorPhone("Ce numéro a déjà été ajouté.");
    }
    if (!regex.test(phoneRaw.trim())) {
      return setErrorPhone("Veuillez entrer un numéro de téléphone valide.");
    }

    console.log('Adding phone number:', field);

    const updated = [...phonelist, phoneRaw];
    setPhonelist(updated);
    field.onChange(updated); // update form value → triggers Zod
    setPhone('');
    setErrorPhone(null);
  };

  const handleRemovePhoneNumber = (index) => {
    if (phonelist.length > 1) {
      const updated = phonelist.filter((_, i) => i !== index);
      setPhonelist(updated);
      field.onChange(updated); // update form value
    }
  };

  return (
    <>
      <div className='flex items-center gap-2'>
        <Input
          value={phone}
          maxLength={10}
          onChange={(e) => {
            setPhone(formatPhone(e.target.value));
            setErrorPhone(null);
          }}
          type="text"
          className="w-full"
          placeholder="Numéro de téléphone"
        />
        {
          phonelist.length < 3 && 
          <Button variant="ghost" onClick={handleAddPhoneNumber} type="button">
          <Plus />
          </Button>
        }
        
      </div>
      {errorPhone ? (
        <p className="text-sm text-red-500 mt-1">{errorPhone}</p>
      ) : (
        <FormDescription className="mt-1">
          Vous pouvez ajouter jusqu'à 3 numéros de téléphone.
        </FormDescription>
      )}
      <div className="flex gap-2 flex-wrap mt-2">
        {phonelist.map((number, index) => (
          <div key={index} className="flex items-center gap-1 px-2 py-1 text-sm font-medium bg-rod-foreground rounded-md">
            +216 {formatPhone(number)}
            {phonelist.length === 1 ? null : (
              <Button
                type="button"
                variant="icon"
                className="text-gray-500 h-0 w-0  mb-0.5 leading-none"
                onClick={() => handleRemovePhoneNumber(index)}
              >
                <X />
              </Button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PhoneInput;
