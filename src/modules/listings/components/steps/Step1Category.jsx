import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { useBulkVehicleWizard } from "../../context/BulkVehicleWizardContext";
import { getCategoryOptionsApi } from "../../api/catalogApi";
import CategoryIcon from "../CategoryIcon";
import WizardFooterNav from "../WizardFooterNav";
import { scrollElementIntoWizardView } from "../../utils/wizardScroll";

const Step1Category = () => {
  const { listing, isSaving, saveStep, goPrevious, saveDraft } = useBulkVehicleWizard();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedCategoryId, setSelectedCategoryId] = useState(
    listing?.category?._id || listing?.category || ""
  );
  const [showValidation, setShowValidation] = useState(false);
  const categoryGridRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const data = await getCategoryOptionsApi({ parentCategory: "VEHICLE" });

        if (isMounted) setCategories(data || []);
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error.response?.data?.message || "Unable to load categories"
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setShowValidation(false);
  };

  const handleNext = async () => {
    if (!selectedCategoryId) {
      setShowValidation(true);
      scrollElementIntoWizardView(categoryGridRef.current);
      return;
    }

    try {
      await saveStep(1, { category: selectedCategoryId });
    } catch {
      // Error toast already shown by context; stay on this step.
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-950">Select a Category</h2>
      <p className="mt-1 text-sm text-slate-500">Choose the type of vehicle you are listing.</p>

      <div
        ref={categoryGridRef}
        className={`mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${
          showValidation && !selectedCategoryId ? "rounded-xl ring-2 ring-red-400 ring-offset-2" : ""
        }`}
      >
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category._id;

          return (
            <button
              key={category._id}
              type="button"
              onClick={() => handleSelect(category._id)}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                {category.categoryImage?.url ? (
                  <img
                    src={category.categoryImage.url}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <CategoryIcon
                    name={category.name}
                    size={26}
                    className={isSelected ? "text-blue-600" : "text-slate-500"}
                  />
                )}
              </div>

              <p className={`truncate text-sm font-semibold ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                {category.name}
              </p>
            </button>
          );
        })}

        {categories.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
            No categories available right now
          </div>
        )}
      </div>

      {showValidation && !selectedCategoryId && (
        <p className="mt-2 text-xs font-medium text-red-600">
          Please select a category to continue
        </p>
      )}

      <WizardFooterNav
        isFirstStep
        onPrevious={goPrevious}
        onSaveDraft={saveDraft}
        onNext={handleNext}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Step1Category;
