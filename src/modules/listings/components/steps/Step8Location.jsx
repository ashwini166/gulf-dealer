import { useMemo, useRef, useState } from "react";

import { useBulkVehicleWizard } from "../../context/BulkVehicleWizardContext";
import {
  GULF_COUNTRIES,
  getNormalizedLocationCity,
  getNormalizedLocationCountry,
} from "../../config/gulfLocations.config";
import FormField from "../FormField";
import ToggleSwitchField from "../ToggleSwitchField";
import WizardFooterNav from "../WizardFooterNav";
import MapLinkPreview from "../MapLinkPreview";
import { carFormConfig } from "../../config/categoryForms/carForm.config";
import { commercialFormConfig } from "../../config/categoryForms/commercialForm.config";
import { heavyEquipmentFormConfig } from "../../config/categoryForms/heavyEquipmentForm.config";
import { motorbikeFormConfig } from "../../config/categoryForms/motorbikeForm.config";
import { buggyFormConfig } from "../../config/categoryForms/buggyForm.config";
import { caravanFormConfig } from "../../config/categoryForms/caravanForm.config";
import { specialNumberFormConfig } from "../../config/categoryForms/specialNumberForm.config";
import { scrollFirstWizardError } from "../../utils/wizardScroll";

const configByFormType = {
  CAR: carFormConfig,
  COMMERCIAL: commercialFormConfig,
  HEAVY_EQUIPMENT: heavyEquipmentFormConfig,
  MOTORBIKE: motorbikeFormConfig,
  BUGGY: buggyFormConfig,
  CARAVAN: caravanFormConfig,
  SPECIAL_NUMBER: specialNumberFormConfig,
};

const inputClass =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100";

const Step8Location = () => {
  const { listing, isSaving, saveStep, goPrevious, saveDraft } = useBulkVehicleWizard();

  const formType = listing?.category?.vehicleFormType || "CAR";
  const config = configByFormType[formType] || carFormConfig;
  const hasAreaField = Boolean(config.hasAreaField);

  const existingLocation = listing?.location || {};

  const normalizedCountry = getNormalizedLocationCountry(existingLocation.country);
  const normalizedCity = getNormalizedLocationCity(
    normalizedCountry,
    existingLocation.city,
    existingLocation.governorate
  );

  const [country, setCountry] = useState(normalizedCountry);
  const [governorate, setGovernorate] = useState(normalizedCity);
  const [city, setCity] = useState(normalizedCity);
  const [area, setArea] = useState(existingLocation.area || "");
  const [showPhoneNumber, setShowPhoneNumber] = useState(existingLocation.showPhoneNumber ?? true);
  const [showWhatsappNumber, setShowWhatsappNumber] = useState(existingLocation.showWhatsappNumber ?? true);
  const [mapsLink, setMapsLink] = useState(existingLocation.mapsLink || existingLocation.googleMapsUrl || "");

  const [errors, setErrors] = useState({});
  const fieldRefs = useRef({});

  const governorateOptions = useMemo(() => {
    return GULF_COUNTRIES.find((item) => item.name === country)?.governorates || [];
  }, [country]);

  const handleCountryChange = (value) => {
    setCountry(value);
    setGovernorate("");
    setCity("");
    setErrors((previous) => ({ ...previous, country: "" }));
  };

  const handleGovernorateChange = (value) => {
    setGovernorate(value);
    setCity(value);
    setErrors((previous) => ({ ...previous, governorate: "", city: "" }));
  };

  const handleNext = async () => {
    const nextErrors = {};

    if (!country) nextErrors.country = "Country is required";
    if (!governorate) nextErrors.governorate = "City is required";
    if (!city) nextErrors.city = "City/Area is required";
    if (hasAreaField && !area) nextErrors.area = "Area is required";
    if (mapsLink && !/^https?:\/\/.+/i.test(mapsLink.trim())) {
      nextErrors.mapsLink = "Enter a valid Google Maps link";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      scrollFirstWizardError(fieldRefs, ["country", "governorate", "city", "area", "mapsLink"], nextErrors);
      return;
    }

    try {
      await saveStep(8, {
        country,
        governorate,
        city,
        area: hasAreaField ? area : undefined,
        mapsLink: mapsLink.trim() || undefined,
        showPhoneNumber,
        showWhatsappNumber,
      });
    } catch {
      // Error toast already shown by context.
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">Seller &amp; Location</h2>
      <p className="mt-1 text-sm text-slate-500">Tell buyers where the vehicle is located.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div ref={(node) => { fieldRefs.current.country = node; }}>
        <FormField label="Country" required error={errors.country}>
          <select value={country} onChange={(e) => handleCountryChange(e.target.value)} className={inputClass}>
            <option value="">Select country</option>
            {GULF_COUNTRIES.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </FormField>
        </div>

        <div ref={(node) => {
          fieldRefs.current.governorate = node;
          fieldRefs.current.city = node;
        }}>
        <FormField label="City" required error={errors.governorate || errors.city}>
          <select value={governorate} onChange={(e) => handleGovernorateChange(e.target.value)} disabled={!country} className={inputClass}>
            <option value="">Select city</option>
            {governorateOptions.map((item) => (
              <option key={item.name} value={item.name}>{item.name}</option>
            ))}
          </select>
        </FormField>
        </div>

        {hasAreaField && (
          <div ref={(node) => { fieldRefs.current.area = node; }}>
          <FormField label="Area" required error={errors.area}>
            <input
              type="text"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setErrors((previous) => ({ ...previous, area: "" }));
              }}
              placeholder="e.g. Adliya, Deira, Al Olaya"
              disabled={!city}
              className={inputClass}
            />
          </FormField>
          </div>
        )}
      </div>

      <div ref={(node) => { fieldRefs.current.mapsLink = node; }} className="mt-4">
        <FormField label="Google Maps Link" error={errors.mapsLink}>
          <input
            type="url"
            value={mapsLink}
            onChange={(e) => {
              setMapsLink(e.target.value);
              setErrors((previous) => ({ ...previous, mapsLink: "" }));
            }}
            placeholder="https://maps.google.com/..."
            className={inputClass}
          />
        </FormField>
        <MapLinkPreview value={mapsLink} />
      </div>

      <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
        <ToggleSwitchField
          label="Show Phone Number"
          description="Buyers can call you directly"
          checked={showPhoneNumber}
          onChange={setShowPhoneNumber}
        />
        <ToggleSwitchField
          label="Show WhatsApp Number"
          description="Buyers can message you on WhatsApp"
          checked={showWhatsappNumber}
          onChange={setShowWhatsappNumber}
        />
      </div>

      <WizardFooterNav
        onPrevious={goPrevious}
        onSaveDraft={saveDraft}
        onNext={handleNext}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Step8Location;
