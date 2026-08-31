import { useState } from "react";

import { useBulkVehicleWizard } from "../../context/BulkVehicleWizardContext";
import { getServiceCountryCurrencyByName } from "../../config/gulfLocations.config";
import FormField from "../FormField";
import ToggleSwitchField from "../ToggleSwitchField";
import WizardFooterNav from "../WizardFooterNav";

const Step9Pricing = () => {
  const { listing, isSaving, saveStep, goPrevious, saveDraft } = useBulkVehicleWizard();

  const existingPricing = listing?.pricing || {};
  const selectedCurrency =
    existingPricing.currency ||
    getServiceCountryCurrencyByName(listing?.location?.country);
  const listingType = listing?.listingType;
  const isBulkListing = Boolean(listing?.isBulkListing);

  const [price, setPrice] = useState(
    existingPricing.price !== null && existingPricing.price !== undefined ? String(existingPricing.price) : ""
  );
  const [isNegotiable, setIsNegotiable] = useState(existingPricing.isNegotiable ?? false);
  const [error, setError] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);
  const [acceptanceError, setAcceptanceError] = useState("");

  const handlePriceChange = (value) => {
    if (value === "" || /^\d*\.?\d{0,3}$/.test(value)) {
      setPrice(value);
      setError("");
    }
  };

  const handleNext = async () => {
    const numericPrice = Number(price);

    if (!price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (isBulkListing && !isAccepted) {
      setAcceptanceError("Please accept the terms to submit this bulk listing");
      return;
    }

    try {
      await saveStep(9, {
        price: numericPrice,
        currency: selectedCurrency,
        isNegotiable,
      });
    } catch {
      // Error toast already shown by context.
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">Pricing</h2>
      <p className="mt-1 text-sm text-slate-500">Set a competitive price to attract serious buyers.</p>

      <div className="mt-5">
        <FormField
          label={
            listingType === "RENT"
              ? `Rental Price (${selectedCurrency} / day)`
              : `Listing Price (${selectedCurrency})`
          }
          required
          error={error}
        >
          <div className={`flex h-11 items-center overflow-hidden rounded-lg border ${error ? "border-red-400" : "border-slate-300"} focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100`}>
            <span className="border-r border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-500">
              {selectedCurrency}
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="0.000"
              className="h-full flex-1 border-0 px-3 text-sm font-semibold text-blue-600 outline-none"
            />
          </div>
        </FormField>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 px-4">
        <ToggleSwitchField
          label="Price Negotiable"
          description="Buyers can negotiate the listed price"
          checked={isNegotiable}
          onChange={setIsNegotiable}
        />
      </div>

      {isBulkListing && (
        <div className={`mt-5 rounded-xl border p-3 transition-all duration-200 ${acceptanceError ? "border-red-400 ring-2 ring-red-400 ring-offset-1" : "border-slate-200"}`}>
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={isAccepted}
              onChange={(e) => {
                setIsAccepted(e.target.checked);
                setAcceptanceError("");
              }}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">
              I confirm that the vehicle information is accurate and I accept the{" "}
              <a href="/terms-and-conditions" target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy-policy" target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">
                Listing Policy
              </a>
              .
            </span>
          </label>
          {acceptanceError && <p className="mt-2 text-xs font-medium text-red-600">{acceptanceError}</p>}
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

export default Step9Pricing;
