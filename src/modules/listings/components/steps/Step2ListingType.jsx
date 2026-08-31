import { useRef, useState } from "react";
import { Tag, RefreshCw } from "lucide-react";

import { useBulkVehicleWizard } from "../../context/BulkVehicleWizardContext";
import WizardFooterNav from "../WizardFooterNav";
import { scrollElementIntoWizardView } from "../../utils/wizardScroll";

const listingTypeOptions = [
  { value: "SALE", label: "For Sale", description: "List your vehicle as a one-time purchase for interested buyers.", icon: Tag },
  { value: "RENT", label: "For Rent", description: "Rent out your vehicle on a daily, weekly, or monthly basis.", icon: RefreshCw },
];

const conditionOptions = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
  { value: "CERTIFIED", label: "Certified" },
];

const conditionOptionsByFormType = {
  CAR: [
    { value: "NEW", label: "New" },
    { value: "USED", label: "Used" },
    { value: "CERTIFIED", label: "Certified Used" },
  ],
  COMMERCIAL: [
    { value: "NEW", label: "Brand New" },
    { value: "USED", label: "Used" },
  ],
  HEAVY_EQUIPMENT: [
    { value: "NEW", label: "Brand New" },
    { value: "USED", label: "Used" },
  ],
  MOTORBIKE: [
    { value: "NEW", label: "New" },
    { value: "USED", label: "Used" },
  ],
  BUGGY: [
    { value: "NEW", label: "New" },
    { value: "USED", label: "Used" },
  ],
  CARAVAN: [
    { value: "NEW", label: "New" },
    { value: "USED", label: "Used" },
  ],
};

const Step2ListingType = () => {
  const { listing, isSaving, saveStep, goPrevious, saveDraft } = useBulkVehicleWizard();

  const formType = listing?.category?.vehicleFormType || "CAR";
  const isSpecialNumber = formType === "SPECIAL_NUMBER";
  const activeConditionOptions =
    conditionOptionsByFormType[formType] || conditionOptions;

  const activeListingTypeOptions = isSpecialNumber
    ? [
        { value: "SALE", label: "For Sale", description: "List this number plate for a fixed price.", icon: Tag },
      ]
    : listingTypeOptions;

  const requiresCondition = !isSpecialNumber;

  const [listingType, setListingType] = useState(
    isSpecialNumber ? "SALE" : listing?.listingType || "",
  );
  const [condition, setCondition] = useState(listing?.condition || "");
  const [showValidation, setShowValidation] = useState({ listingType: false, condition: false });
  const listingTypeRef = useRef(null);
  const conditionRef = useRef(null);

  const handleNext = async () => {
    const nextValidation = {
      listingType: !listingType,
      condition: requiresCondition && !condition,
    };

    if (nextValidation.listingType || nextValidation.condition) {
      setShowValidation(nextValidation);
      scrollElementIntoWizardView(
        nextValidation.listingType ? listingTypeRef.current : conditionRef.current
      );
      return;
    }

    try {
      await saveStep(2, {
        listingType,
        condition: requiresCondition ? condition : undefined,
      });
    } catch {
      // Error toast already shown by context.
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">Listing Type</h2>
      <p className="mt-1 text-sm text-slate-500">
        {isSpecialNumber
          ? "This number plate will be listed for sale."
          : "Are you selling or renting your vehicle?"}
      </p>

      <div
        ref={listingTypeRef}
        className={`mt-5 grid gap-3 sm:grid-cols-2 ${
          showValidation.listingType ? "rounded-xl ring-2 ring-red-400 ring-offset-2" : ""
        }`}
      >
        {activeListingTypeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = listingType === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setListingType(option.value);
                setShowValidation((prev) => ({ ...prev, listingType: false }));
              }}
              className={`rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                <Icon size={17} />
              </span>
              <p className={`mt-3 text-sm font-semibold ${isSelected ? "text-blue-700" : "text-slate-900"}`}>{option.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{option.description}</p>
            </button>
          );
        })}
      </div>

      {showValidation.listingType && (
        <p className="mt-2 text-xs font-medium text-red-600">Please choose an option to continue</p>
      )}

      {requiresCondition && (
      <div ref={conditionRef} className="mt-6">
        <p className="text-sm font-semibold text-slate-900">Vehicle Condition</p>

        <div
          className={`mt-2.5 flex overflow-hidden rounded-lg border ${
            showValidation.condition ? "border-red-400 ring-2 ring-red-400 ring-offset-2" : "border-slate-200"
          }`}
        >
          {activeConditionOptions.map((option) => {
            const isSelected = condition === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setCondition(option.value);
                  setShowValidation((prev) => ({ ...prev, condition: false }));
                }}
                className={`flex-1 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isSelected ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {isSelected ? `✓ ${option.label}` : option.label}
              </button>
            );
          })}
        </div>

        {showValidation.condition && (
          <p className="mt-2 text-xs font-medium text-red-600">Please select the vehicle's condition</p>
        )}
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

export default Step2ListingType;
