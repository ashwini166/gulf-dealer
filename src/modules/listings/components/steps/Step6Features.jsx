import { useState } from "react";

import { useBulkVehicleWizard } from "../../context/BulkVehicleWizardContext";
import { carFormConfig } from "../../config/categoryForms/carForm.config";
import { commercialFormConfig } from "../../config/categoryForms/commercialForm.config";
import { heavyEquipmentFormConfig } from "../../config/categoryForms/heavyEquipmentForm.config";
import { motorbikeFormConfig } from "../../config/categoryForms/motorbikeForm.config";
import { buggyFormConfig } from "../../config/categoryForms/buggyForm.config";
import { caravanFormConfig } from "../../config/categoryForms/caravanForm.config";
import { specialNumberFormConfig } from "../../config/categoryForms/specialNumberForm.config";
import CollapsibleFeatureGroup from "../CollapsibleFeatureGroup";
import WizardFooterNav from "../WizardFooterNav";

const configByFormType = {
  CAR: carFormConfig,
  COMMERCIAL: commercialFormConfig,
  HEAVY_EQUIPMENT: heavyEquipmentFormConfig,
  MOTORBIKE: motorbikeFormConfig,
  BUGGY: buggyFormConfig,
  CARAVAN: caravanFormConfig,
  SPECIAL_NUMBER: specialNumberFormConfig,
};

const Step6Features = () => {
  const { listing, isSaving, saveStep, goPrevious, saveDraft } = useBulkVehicleWizard();

  const formType = listing?.category?.vehicleFormType || "CAR";
  const config = configByFormType[formType] || carFormConfig;
  const featureGroups = Array.isArray(config?.featureGroups)
    ? config.featureGroups
    : [];

  const existingFeatures = listing?.features || {};

  const buildInitialSelected = () => {
    const initial = {};
    featureGroups.forEach((group) => {
      initial[group.key] = existingFeatures[group.key] || [];
    });
    return initial;
  };

  const [selected, setSelected] = useState(buildInitialSelected);

  const toggleFeature = (groupKey, option) => {
    setSelected((previous) => {
      const current = previous[groupKey] || [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      return { ...previous, [groupKey]: next };
    });
  };

  const handleNext = async () => {
    try {
      await saveStep(6, selected);
    } catch {
      // Error toast already shown by context.
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">Vehicle Features</h2>
      <p className="mt-1 text-sm text-slate-500">Select all features included with your vehicle.</p>

      {featureGroups.length === 0 ? (
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm text-slate-600">
            No additional features are available for this vehicle category.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {featureGroups.map((group, index) => (
            <CollapsibleFeatureGroup
              key={group.key}
              title={group.label}
              options={group.options}
              selectedValues={selected[group.key]}
              onToggle={(option) => toggleFeature(group.key, option)}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      )}

      <WizardFooterNav
        onPrevious={goPrevious}
        onSaveDraft={saveDraft}
        onNext={handleNext}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Step6Features;
