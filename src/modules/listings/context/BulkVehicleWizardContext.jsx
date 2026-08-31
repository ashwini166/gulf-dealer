import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { submitSingleBulkListingApi } from "../api/bulkListingApi";

import {
  getListingByIdApi,
  saveListingStepApi,
  saveListingMediaApi,
} from "../api/vehicleListingApi";
import { createBulkDraftListingApi } from "../api/bulkListingApi";

const BulkVehicleWizardContext = createContext(null);

// Dealer's own business plan already replaces the Plan step entirely —
// the subscription is fixed to whatever is tied to their Dealer profile
// (dealer.businessSubscriptionRef), never chosen per-vehicle.
const BULK_STEP_SEQUENCE = [1, 2, 4, 5, 6, 7, 8, 9];
const TOTAL_BULK_STEPS = BULK_STEP_SEQUENCE.length;

const scrollWizardToTop = () => {
  requestAnimationFrame(() => {
    const scrollArea = document.querySelector("[data-wizard-scroll-area]");
    if (scrollArea) {
      scrollArea.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
};

export const BulkVehicleWizardProvider = ({ children, subscriptionId: providedSubscriptionId }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const draftCreationPromiseRef = useRef(null);

  const subscriptionId = providedSubscriptionId || searchParams.get("subscriptionId") || "";
  const listingId = searchParams.get("listingId") || "";
  const requestedStep = Number(searchParams.get("step")) || 1;

  const [listing, setListing] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateUrl = useCallback(
    (nextListingId, nextStep) => {
      setSearchParams({
        subscriptionId,
        listingId: nextListingId,
        step: String(nextStep),
      });
    },
    [subscriptionId, setSearchParams]
  );

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        setIsInitializing(true);
        setInitError("");

        if (!subscriptionId) {
          throw new Error("No business plan found for this dealer account");
        }

        if (listingId) {
          const existingListing = await getListingByIdApi(listingId);
          if (isMounted) setListing(existingListing);
        } else {
          // Guards against React Strict Mode's double effect
          // invocation in development, which would otherwise
          // create two separate draft listings.
          if (!draftCreationPromiseRef.current) {
            draftCreationPromiseRef.current = createBulkDraftListingApi(subscriptionId);
          }

          const newDraft = await draftCreationPromiseRef.current;

          if (isMounted) {
            setListing(newDraft);
            updateUrl(newDraft._id, 1);
          }
        }
      } catch (error) {
        if (isMounted) {
          const message =
            error.response?.data?.message ||
            error.message ||
            "Unable to load this vehicle listing";
          setInitError(message);
        }
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptionId, listingId]);

  const currentStepIndex = BULK_STEP_SEQUENCE.indexOf(requestedStep);
  const currentStep = currentStepIndex === -1 ? 1 : requestedStep;

  const goToStepIndex = useCallback(
    (index) => {
      if (!listing?._id) return;
      const clampedIndex = Math.max(0, Math.min(index, BULK_STEP_SEQUENCE.length - 1));
      updateUrl(listing._id, BULK_STEP_SEQUENCE[clampedIndex]);
      scrollWizardToTop();
    },
    [listing, updateUrl]
  );

  const goNext = useCallback(async () => {
    const index = BULK_STEP_SEQUENCE.indexOf(currentStep);

    if (index === BULK_STEP_SEQUENCE.length - 1) {
      try {
        await submitSingleBulkListingApi(listing._id);
        showToast("Vehicle submitted for admin review", "success");
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Listing saved as draft, but couldn't be submitted for review yet.";
        showToast(message, "error");
      }

      navigate(`/vehicles?subscriptionId=${subscriptionId}`);
      return;
    }

    goToStepIndex(index + 1);
  }, [currentStep, goToStepIndex, navigate, subscriptionId, listing, showToast]);

  const goPrevious = useCallback(() => {
    const index = BULK_STEP_SEQUENCE.indexOf(currentStep);
    goToStepIndex(index - 1);
  }, [currentStep, goToStepIndex]);

  const saveStep = useCallback(
    async (step, payload, { advance = true } = {}) => {
      if (!listing?._id) throw new Error("Listing not initialized yet");

      setIsSaving(true);

      try {
        const updatedListing = await saveListingStepApi(listing._id, step, payload);
        setListing(updatedListing);

        if (advance) goNext();

        return updatedListing;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to save. Please check your input and try again.";
        showToast(message, "error");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [listing, goNext, showToast]
  );

  const saveMedia = useCallback(
    async (formData, { advance = true } = {}) => {
      if (!listing?._id) throw new Error("Listing not initialized yet");

      setIsSaving(true);

      try {
        const updatedListing = await saveListingMediaApi(listing._id, formData);
        setListing(updatedListing);

        if (advance) goNext();

        return updatedListing;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Unable to upload media. Please try again.";
        showToast(message, "error");
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [listing, goNext, showToast]
  );

  const saveDraft = useCallback(() => {
    navigate(`/vehicles?subscriptionId=${subscriptionId}`);
  }, [navigate, subscriptionId]);

  const value = {
    listing,
    currentStep,
    totalSteps: TOTAL_BULK_STEPS,
    currentStepPosition: currentStepIndex === -1 ? 1 : currentStepIndex + 1,
    isInitializing,
    initError,
    isSaving,
    goToStep: (step) => goToStepIndex(BULK_STEP_SEQUENCE.indexOf(step)),
    goNext,
    goPrevious,
    saveStep,
    saveMedia,
    saveDraft,
    subscriptionId,
  };

  return (
    <BulkVehicleWizardContext.Provider value={value}>
      {children}
    </BulkVehicleWizardContext.Provider>
  );
};

export const useBulkVehicleWizard = () => {
  const context = useContext(BulkVehicleWizardContext);

  if (!context) {
    throw new Error("useBulkVehicleWizard must be used within a BulkVehicleWizardProvider");
  }

  return context;
};
