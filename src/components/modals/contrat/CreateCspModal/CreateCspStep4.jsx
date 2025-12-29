import React from 'react';

import Conducteur from './Conducteur';

const CreateCspStep4 = ({ setContratSpData, ContratSpData, next, prev }) => {
  const supp = ContratSpData?.selectedOptions?.includes("prix_options_conducteur_add");
  const [activeTab, setActiveTab] = React.useState(0);
  const handleNext = () => {
    setActiveTab((prev) => prev + 1);
  }

  return (
      activeTab === 0
      ? <Conducteur
        setContratSpData={setContratSpData}
        ContratSpData={ContratSpData}
        next={supp ? () => handleNext() : next}
        prev={prev}
        supp={false}
      />
      : <Conducteur
        setContratSpData={setContratSpData}
        ContratSpData={ContratSpData}
        next={next}
        prev={() => setActiveTab((prev) => prev - 1)}
        supp={true}
      />

  )
}
 

export default CreateCspStep4