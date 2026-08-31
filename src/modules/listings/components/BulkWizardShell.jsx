import { useState } from "react";
import { Car, Loader2, X } from "lucide-react";

import { useBulkVehicleWizard } from "../context/BulkVehicleWizardContext";
import WizardStepper from "./WizardStepper";

const stepLabels = [
  { position: 1, label: "Category" },
  { position: 2, label: "Listing Type" },
  { position: 3, label: "Vehicle Info" },
  { position: 4, label: "Specs" },
  { position: 5, label: "Features" },
  { position: 6, label: "Media" },
  { position: 7, label: "Location" },
  { position: 8, label: "Pricing" },
];

const BulkWizardShell = ({ children }) => {
  const {
    currentStepPosition,
    totalSteps,
    isInitializing,
    initError,
    saveDraft,
  } = useBulkVehicleWizard();

  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const progressPercent = Math.round((currentStepPosition / totalSteps) * 100);

  if (isInitializing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
        <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-5 shadow-xl">
          <Loader2 size={20} className="animate-spin text-blue-600" />
          <span className="text-sm font-medium text-slate-700">Loading vehicle...</span>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
          <p className="text-sm font-medium text-red-600">{initError}</p>
          <p className="mt-2 text-xs text-slate-500">
            If this keeps happening, contact support or check your business plan status.
          </p>
          <button
            type="button"
            onClick={() => saveDraft()}
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Car size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-950">Add Vehicle</p>
                <p className="text-xs text-slate-500">
                  Step {currentStepPosition} of {totalSteps} —{" "}
                  {stepLabels.find((s) => s.position === currentStepPosition)?.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{progressPercent}%</span>
              </div>

              <button
                type="button"
                onClick={() => setShowExitConfirm(true)}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="mt-4">
            <WizardStepper steps={stepLabels} currentStep={currentStepPosition} />
          </div>
        </div>

        <div id="vehicle-listing-wizard-top" data-wizard-scroll-area className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>

      {showExitConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900">Exit this vehicle?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Your progress has been saved. You can continue editing this vehicle anytime from
              your listings.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Keep Editing
              </button>

              <button
                type="button"
                onClick={() => saveDraft()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Back to Listings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkWizardShell;
