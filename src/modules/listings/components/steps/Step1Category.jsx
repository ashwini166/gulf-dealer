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

        const [vehicleCategories, equipmentCategories] = await Promise.all([
          getCategoryOptionsApi({ parentCategory: "VEHICLE" }),
          getCategoryOptionsApi({ parentCategory: "EQUIPMENT" }),
        ]);

        const categoryMap = new Map();

        [...(vehicleCategories || []), ...(equipmentCategories || [])].forEach(
          (category) => {
            if (category?._id) {
              categoryMap.set(category._id, category);
            }
          }
        );

        if (isMounted) setCategories(Array.from(categoryMap.values()));
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load categories"
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

  const getCategorySubtitle = (category) => {
    if (category?.subtitle) return category.subtitle;

    if (category?.brands) {
      return Array.isArray(category.brands)
        ? category.brands.join(", ")
        : category.brands;
    }

    if (category?.shortDescription) return category.shortDescription;

    const name = String(category?.name || "").trim().toLowerCase();

    const subtitleMap = {
      car: "BMW, Audi, Mercedes",
      cars: "BMW, Audi, Mercedes",
      motercycle: "Honda, Hero, Suzuki",
      motercycles: "Honda, Hero, Suzuki",
      motorcycle: "Honda, Hero, Suzuki",
      motorcycles: "Honda, Hero, Suzuki",
      "heavy equipment": "Benz, Volvo",
      "heavy equipments": "Benz, Volvo",
      "special number": "BMW, Audi, Mercedes",
      "special numbers": "BMW, Audi, Mercedes",
      buggy: "Honda, Hero, Suzuki",
      caravan: "Benz, Volvo",
      carvaan: "Benz, Volvo",
      "commercial vehicle": "Benz, Volvo",
      "commercial vehicles": "Benz, Volvo",
      "showroom & dealer": "Benz, Volvo",
      "showrooms & dealers": "Benz, Volvo",
    };

    return subtitleMap[name] || "";
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
    <div className="flex min-h-full w-full min-w-0 flex-col px-3 pb-4 sm:px-5 md:px-6 lg:px-0">
      <div className="w-full">
        <h2 className="text-[19px] font-bold leading-tight text-slate-950 sm:text-[22px] md:text-[24px]">
          Select a Category
        </h2>
        <p className="mt-1 text-[13px] leading-5 text-slate-500 sm:mt-2 sm:text-[15px] sm:leading-6 md:text-[16px]">
          Choose the type of vehicle you are listing.
        </p>
      </div>

      <div
        ref={categoryGridRef}
        className={`mt-4 grid w-full grid-cols-2 gap-2 sm:mt-6 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 ${
          showValidation && !selectedCategoryId ? "rounded-xl ring-2 ring-red-400 ring-offset-2" : ""
        }`}
      >
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category._id;
          const subtitle = getCategorySubtitle(category);

          return (
            <button
              key={category._id}
              type="button"
              onClick={() => handleSelect(category._id)}
              className={`group flex min-h-[96px] min-w-0 flex-col items-start rounded-xl bg-white p-2 text-left transition-all duration-200 sm:min-h-[112px] sm:rounded-2xl sm:p-3 md:min-h-[120px] ${
                isSelected
                  ? "border-2 border-blue-600 shadow-sm"
                  : "border border-slate-200 hover:border-slate-300 active:border-slate-400"
              }`}
            >
              <div
                className={`flex h-9 w-11 shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-11 sm:w-[52px] sm:rounded-lg md:h-12 md:w-14 ${
                  isSelected ? "ring-1 ring-blue-100" : ""
                }`}
              >
                {category?.categoryImage?.url ? (
                  <img
                    src={category.categoryImage.url}
                    alt={category.name || "Category"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <CategoryIcon
                      name={category.name}
                      size={16}
                      className={isSelected ? "text-blue-600" : "text-slate-500"}
                    />
                  </div>
                )}
              </div>

              <p
                className={`mt-1.5 w-full truncate text-[12px] font-bold leading-4 sm:mt-2 sm:text-[14px] sm:leading-5 ${
                  isSelected ? "text-slate-950" : "text-slate-900"
                }`}
                title={category.name}
              >
                {category.name}
              </p>

              {subtitle && (
                <p
                  className="mt-0.5 w-full truncate text-[10px] font-medium leading-4 text-slate-500 sm:text-[12px]"
                  title={subtitle}
                >
                  {subtitle}
                </p>
              )}
            </button>
          );
        })}

        {categories.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-5 text-center text-[13px] text-slate-400 sm:p-8 sm:text-sm">
            No categories available right now
          </div>
        )}
      </div>

      {showValidation && !selectedCategoryId && (
        <p className="mt-2 text-xs font-medium text-red-600">
          Please select a category to continue
        </p>
      )}

      <div className="mt-auto pt-5 sm:pt-7">
        <WizardFooterNav
          isFirstStep
          onPrevious={goPrevious}
          onSaveDraft={saveDraft}
          onNext={handleNext}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default Step1Category;
