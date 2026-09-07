import { useEffect, useRef, useState } from "react";

import useAuth from "../../../auth/hooks/useAuth";
import { useBulkVehicleWizard } from "../../context/BulkVehicleWizardContext";
import { carFormConfig } from "../../config/categoryForms/carForm.config";
import { commercialFormConfig } from "../../config/categoryForms/commercialForm.config";
import { heavyEquipmentFormConfig } from "../../config/categoryForms/heavyEquipmentForm.config";
import { motorbikeFormConfig } from "../../config/categoryForms/motorbikeForm.config";
import { buggyFormConfig } from "../../config/categoryForms/buggyForm.config";
import { caravanFormConfig } from "../../config/categoryForms/caravanForm.config";
import { specialNumberFormConfig } from "../../config/categoryForms/specialNumberForm.config";
import DynamicField from "../formFields/DynamicField";
import FormField from "../FormField";
import WizardFooterNav from "../WizardFooterNav";
import PlateSummary from "../detail/PlateSummary";
import { scrollFirstWizardError } from "../../utils/wizardScroll";
import { normalizePhoneContact, validatePhoneContact } from "../../utils/phoneNumber";
import { useListingAttributeConfig } from "../../hooks/useListingAttributeConfig";

const configByFormType = {
  CAR: carFormConfig,
  COMMERCIAL: commercialFormConfig,
  HEAVY_EQUIPMENT: heavyEquipmentFormConfig,
  MOTORBIKE: motorbikeFormConfig,
  BUGGY: buggyFormConfig,
  CARAVAN: caravanFormConfig,
  SPECIAL_NUMBER: specialNumberFormConfig,
};

const Step4VehicleInfo = () => {
  const { listing, isSaving, saveStep, goPrevious, saveDraft } = useBulkVehicleWizard();
  const { user } = useAuth();

  const categoryId = listing?.category?._id || listing?.category;
  const formType = listing?.category?.vehicleFormType || "CAR";
  const baseConfig = configByFormType[formType] || carFormConfig;
  const { config } = useListingAttributeConfig(categoryId, baseConfig);
  const infoTitle =
    formType === "SPECIAL_NUMBER" ? "Plate Info" : `${config.label} Information`;

  const existingInfo = listing?.vehicleInfo || {};
  const dealerProfile = user?.dealerProfile || user?.dealer || {};
  const accountSellerName =
    dealerProfile.businessName ||
    user?.businessName ||
    user?.dealerName ||
    user?.fullName ||
    user?.name ||
    "";
  const accountPhone = `${user?.countryCode || ""} ${user?.phone || ""}`.trim();
  const accountWhatsapp =
    `${user?.whatsappCountryCode || user?.countryCode || ""} ${
      user?.whatsapp || user?.whatsappNumber || user?.phone || ""
    }`.trim();
  const accountEmail = user?.email || dealerProfile.email || "";

  const buildInitialForm = () => {
    const initial = {};
    config.vehicleInfoFields.forEach((field) => {
      if (field.type === "brandSelect") {
        initial[field.name] = existingInfo.brand?._id || existingInfo.brand || "";
      } else if (field.type === "modelSelect") {
        initial[field.name] = existingInfo.catalogModel?._id || existingInfo.catalogModel || "";
      } else if (field.type === "toggleSwitch") {
        initial[field.name] = existingInfo[field.name] ?? false;
      } else if (field.name === "sellerName") {
        initial[field.name] = accountSellerName || existingInfo[field.name] || "";
      } else if (field.name === "mobileNumber") {
        initial[field.name] = existingInfo[field.name] || accountPhone;
      } else if (field.name === "whatsappNumber") {
        initial[field.name] = existingInfo[field.name] || accountWhatsapp || accountPhone;
      } else if (field.name === "contactEmail") {
        initial[field.name] = existingInfo[field.name] || accountEmail;
      } else {
        initial[field.name] = existingInfo[field.name] ?? "";
      }
    });
    return initial;
  };

  const [form, setForm] = useState(buildInitialForm);
  const [errors, setErrors] = useState({});
  const fieldRefs = useRef({});

  useEffect(() => {
    if (!accountSellerName && !accountPhone && !accountWhatsapp && !accountEmail) return;

    const timeoutId = window.setTimeout(() => {
      setForm((previous) => ({
        ...previous,
        sellerName: accountSellerName || previous.sellerName || "",
        mobileNumber: previous.mobileNumber || accountPhone,
        whatsappNumber: previous.whatsappNumber || accountWhatsapp || accountPhone,
        contactEmail: previous.contactEmail || accountEmail,
      }));
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [accountEmail, accountPhone, accountSellerName, accountWhatsapp]);

  const handleChange = (fieldName, value) => {
    setForm((previous) => {
      const next = { ...previous, [fieldName]: value };
      if (fieldName === "brand") {
        next.catalogModel = "";
        next.variantTrim = "";
      }
      if (fieldName === "catalogModel") next.variantTrim = "";
      if (fieldName === "mobileNumber" && previous.whatsappAvailable) next.whatsappNumber = value;
      if (fieldName === "whatsappAvailable" && value) next.whatsappNumber = previous.mobileNumber || "";
      return next;
    });
    setErrors((previous) => ({
      ...previous,
      [fieldName]: "",
      ...(fieldName === "mobileNumber" || fieldName === "whatsappAvailable" ? { whatsappNumber: "" } : {}),
    }));
  };

  const validate = () => {
    const nextErrors = {};

    config.vehicleInfoFields.forEach((field) => {
      if (field.required && !form[field.name]) {
        nextErrors[field.name] = `${field.label} is required`;
      }

      if (field.type === "phone") {
        const fieldValue = field.name === "whatsappNumber" && form.whatsappAvailable
          ? form.mobileNumber
          : form[field.name];
        const phoneError = validatePhoneContact(fieldValue, field.label);
        if (field.required || fieldValue) {
          if (phoneError) nextErrors[field.name] = phoneError;
        }
      }
    });

    if (form.vinNumber && String(form.vinNumber).trim().length !== 17) {
      nextErrors.vinNumber = "VIN number must be exactly 17 characters";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      scrollFirstWizardError(
        fieldRefs,
        config.vehicleInfoFields.map((field) => field.name),
        nextErrors
      );
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    const payload = { ...form, sellerName: accountSellerName || form.sellerName || "" };
    if (payload.whatsappAvailable) payload.whatsappNumber = payload.mobileNumber;
    config.vehicleInfoFields.forEach((field) => {
      if (field.type === "phone" && payload[field.name]) {
        payload[field.name] = normalizePhoneContact(payload[field.name]);
      }
    });

    if (payload.manufacturingYear) payload.manufacturingYear = Number(payload.manufacturingYear);
    if (payload.mileage !== undefined && payload.mileage !== "") payload.mileage = Number(payload.mileage);
    if (payload.vinNumber) payload.vinNumber = String(payload.vinNumber).trim().toUpperCase();

    try {
      await saveStep(4, payload);
    } catch {
      // Error toast already shown by context.
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">{infoTitle}</h2>
      <p className="mt-1 text-sm text-slate-500">Provide accurate details to attract buyers.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {config.vehicleInfoFields.map((field) => {
          const renderField =
            field.name === "sellerName" ? { ...field, readOnly: true } : field;
          const isFullWidth = field.span === 2;

          return (
            <div
              key={field.name}
              ref={(el) => (fieldRefs.current[field.name] = el)}
              className={isFullWidth ? "sm:col-span-2" : ""}
            >
              {field.type === "toggleSwitch" ? (
                <>
                  <DynamicField
                    field={renderField}
                    value={form[field.name]}
                    onChange={(value) => handleChange(field.name, value)}
                    error={errors[field.name]}
                    form={form}
                    categoryId={categoryId}
                  />
                  {errors[field.name] ? (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors[field.name]}</p>
                  ) : null}
                </>
              ) : (
                <FormField label={field.label} required={field.required} error={errors[field.name]}>
                  <DynamicField
                    field={renderField}
                    value={form[field.name]}
                    onChange={(value) => handleChange(field.name, value)}
                    error={errors[field.name]}
                    form={form}
                    categoryId={categoryId}
                  />
                </FormField>
              )}
            </div>
          );
        })}
      </div>

      {formType === "SPECIAL_NUMBER" && (
        <div className="mt-5">
          <PlateSummary vehicleInfo={form} />
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

export default Step4VehicleInfo;
