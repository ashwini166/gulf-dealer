export const WIZARD_STEPS = [
  { step: 1, label: "Category" },
  { step: 2, label: "Listing Type" },
  { step: 4, label: "Vehicle Info" },
  { step: 5, label: "Specs" },
  { step: 6, label: "Features" },
  { step: 7, label: "Media" },
  { step: 8, label: "Location" },
  { step: 9, label: "Pricing" },
];

export const SPECIAL_NUMBER_FORM_TYPE = "SPECIAL_NUMBER";

export const isSpecialNumberFormType = (formType) =>
  formType === SPECIAL_NUMBER_FORM_TYPE;

export const getListingWizardFormType = (listing) =>
  listing?.category?.vehicleFormType || listing?.vehicleFormType || "";

export const getWizardSteps = (formType) =>
  WIZARD_STEPS.reduce((steps, item) => {
    if (isSpecialNumberFormType(formType) && item.step === 5) return steps;

    steps.push({
      ...item,
      label:
        isSpecialNumberFormType(formType) && item.step === 4
          ? "Plate Info"
          : item.label,
    });

    return steps;
  }, []);

export const getWizardStepSequence = (formType) =>
  getWizardSteps(formType).map((item) => item.step);
