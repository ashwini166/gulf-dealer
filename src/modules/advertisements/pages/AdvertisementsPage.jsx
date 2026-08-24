import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  FileText,
  Image as ImageIcon,
  Megaphone,
  Monitor,
  Plus,
  Search,
  Shield,
  Smartphone,
  Tablet,
  Wallet,
  X,
} from "lucide-react";

import StatCard from "../../../components/ui/StatCard";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import { advertisementsApi } from "../api/advertisementsApi";

const categories = {
  HOME_PAGE_BANNER: "Homepage Banner",
  LISTING_BANNER: "Listing Page Banner",
  LARGE_CATEGORY_BANNER: "Large Category Ad",
  SMALL_ADVERTISEMENT_SPACE: "Small Ad Space",
};

const devices = [
  { key: "desktop", label: "Desktop", icon: Monitor },
  { key: "tablet", label: "Tablet", icon: Tablet },
  { key: "mobile", label: "Mobile", icon: Smartphone },
];

const durationOptions = [7, 15, 30, 60, 90];

const formatCurrency = (value) => `BHD ${(Number(value) || 0).toFixed(3)}`;

const wizardSteps = [
  "Placement",
  "Creative",
  "Settings",
  "Duration",
  "Review",
  "Payment",
  "Done",
];

const placementMeta = [
  {
    category: "HOME_PAGE_BANNER",
    title: "Homepage Banner",
    label: "Highest Visibility",
    labelClass: "bg-blue-50 text-blue-600",
    description:
      "Prime visibility at the very top of the GulfInCart homepage. Seen by every visitor the moment they land on the site.",
    dimensions: "1440 x 200 px",
    previewImageUrl:
      "https://gulfincart-dev.s3.ap-south-1.amazonaws.com/ui/ads-form/homepage-banner-preview.png",
  },
  {
    category: "LISTING_BANNER",
    title: "Listing Page Banner",
    label: "High Intent",
    labelClass: "bg-emerald-50 text-emerald-600",
    description:
      "Displayed inside active vehicle listing pages. Reaches buyers who are already browsing and ready to purchase.",
    dimensions: "728 x 90 px",
    previewImageUrl:
      "https://gulfincart-dev.s3.ap-south-1.amazonaws.com/ui/ads-form/listingpage-banner-preview.png",
  },
  {
    category: "LARGE_CATEGORY_BANNER",
    title: "Large Category Ad",
    label: "Broad Reach",
    labelClass: "bg-purple-50 text-purple-600",
    description:
      "Featured prominently in category and search results pages. Captures high-volume browse traffic across all categories.",
    dimensions: "300 x 250 px",
    previewImageUrl:
      "https://gulfincart-dev.s3.ap-south-1.amazonaws.com/ui/ads-form/large-category-ads-preview.png",
  },
  {
    category: "SMALL_ADVERTISEMENT_SPACE",
    title: "Small Ad Space",
    label: "Cost Effective",
    labelClass: "bg-orange-50 text-orange-600",
    description:
      "Sidebar and inline card slots across the platform. Ideal for sustained brand presence at an accessible price point.",
    dimensions: "160 x 600 px",
    previewImageUrl:
      "https://gulfincart-dev.s3.ap-south-1.amazonaws.com/ui/ads-form/small-ad-sapace-preview.png",
  },
];

const durationCopy = {
  7: "Quick boost",
  15: "Extended reach",
  30: "Best value",
  60: "Long exposure",
  90: "Maximum exposure",
};

const formatDate = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

const getTitle = (ad) => ad?.name || categories[ad?.category] || "Advertisement";

const getStatusClass = (status) => {
  if (status === "ACTIVE") return "bg-emerald-100 text-emerald-700";
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "REJECTED") return "bg-red-100 text-red-700";
  if (status === "DRAFT") return "bg-slate-100 text-slate-600";
  return "bg-slate-100 text-slate-500";
};

const getTierPrice = (plan, durationDays) =>
  Number(
    plan?.pricingTiers?.find((tier) => tier.durationDays === Number(durationDays))?.price ||
      0,
  );

const getMostPopularDuration = (pricingTiers = []) =>
  pricingTiers.find((tier) => tier.isMostPopular)?.durationDays || 30;

const getPlacementMeta = (category) =>
  placementMeta.find((placement) => placement.category === category) ||
  placementMeta[0];

const getBenefitStatus = (planAdBenefits, category) => {
  const benefit = planAdBenefits?.[category];
  const included = Number(benefit?.included || 0);
  const used = Number(benefit?.used || 0);
  const remaining = Number(benefit?.remaining || 0);

  if (remaining > 0) {
    return {
      benefit,
      included,
      used,
      remaining,
      isAvailable: true,
      label: `${remaining} included left`,
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    };
  }

  if (included > 0) {
    return {
      benefit,
      included,
      used,
      remaining,
      isAvailable: false,
      label: `Included used ${used}/${included}`,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    };
  }

  return {
    benefit,
    included,
    used,
    remaining,
    isAvailable: false,
    label: "Paid placement",
    className: "border-slate-200 bg-slate-50 text-slate-500",
  };
};

const objectUrlCache = new WeakMap();

const getObjectUrl = (file) => {
  if (!file) return "";
  if (file.url) return file.url;
  if (!objectUrlCache.has(file)) {
    objectUrlCache.set(file, URL.createObjectURL(file));
  }
  return objectUrlCache.get(file);
};

const WizardProgress = ({ step }) => (
  <div className="border-b border-slate-100 px-3 py-2 lg:px-5">
    <div className="grid grid-cols-7 items-start gap-1.5">
      {wizardSteps.map((item, index) => {
        const stepNumber = index + 1;
        const completed = stepNumber < step;
        const active = stepNumber === step;

        return (
          <div key={item} className="relative flex flex-col items-center">
            {index > 0 ? (
              <span
                className={`absolute right-1/2 top-3 h-0.5 w-full ${
                  completed || active ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            ) : null}
            <span
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                completed
                  ? "bg-emerald-500 text-white"
                  : active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-400"
              }`}
            >
              {completed ? <Check size={14} /> : stepNumber}
            </span>
            <span
              className={`mt-1 hidden text-[10px] font-semibold sm:block ${
                completed ? "text-emerald-500" : active ? "text-blue-600" : "text-slate-400"
              }`}
            >
              {item}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const PlacementSketch = ({ placement }) => (
  <div className="overflow-hidden rounded-xl bg-slate-50 p-2">
    <div className="h-[180px] overflow-hidden rounded-lg bg-white ring-1 ring-slate-100">
      <img
        src={placement.previewImageUrl}
        alt={`${placement.title} preview`}
        className="h-full w-full object-cover"
      />
    </div>
  </div>
);

const PlacementComparisonCard = ({ placement, isSelected, startingPrice, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`relative flex min-h-[208px] flex-col rounded-2xl border p-3 text-left shadow-sm transition ${
      isSelected
        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
        : "border-slate-200 bg-white hover:border-blue-200 hover:shadow-md"
    }`}
  >
    <div className="relative overflow-hidden rounded-xl bg-slate-50 p-2">
      <div className="h-[82px] overflow-hidden rounded-lg bg-white ring-1 ring-slate-100">
        <img
          src={placement.previewImageUrl}
          alt={`${placement.title} position preview`}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
    {isSelected ? (
      <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
        <Check size={16} strokeWidth={3} />
      </span>
    ) : null}
    <h3 className="mt-4 text-base font-black leading-tight text-slate-950">
      {placement.title}
    </h3>
    <p className="mt-5 text-xs font-medium text-slate-500">Starting From</p>
    <p className="mt-1 text-lg font-black leading-none text-slate-950">
      {formatCurrency(startingPrice)}
    </p>
    <p className="mt-4 text-xs font-medium text-slate-500">
      Dimensions: {placement.dimensions}
    </p>
  </button>
);

const FileUpload = ({ file, label, onChange }) => {
  const previewUrl = getObjectUrl(file);

  return (
    <label className="flex min-h-[132px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center hover:border-blue-300 hover:bg-blue-50/40">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={`${label} preview`}
          className="mb-3 h-16 w-28 rounded-xl object-cover ring-1 ring-slate-200"
        />
      ) : (
        <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
          <ImageIcon size={21} />
        </span>
      )}
      <span className="text-sm font-bold text-slate-950">
        Drag & drop your {label} here
      </span>
      <span className="mt-1 text-xs font-medium text-slate-500">
        or click to browse files
      </span>
      <span className="mt-3 rounded-lg bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-500">
        JPG - PNG - WEBP - Max 5MB
      </span>
      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
    </label>
  );
};

const SummaryPanel = ({ placement, durationDays, price, isIncludedWithPlan }) => {
  const vat = Number((Number(price || 0) * 0.05).toFixed(3));
  const total = Number((Number(price || 0) + vat).toFixed(3));

  return (
    <aside className="hidden w-[250px] shrink-0 border-l border-slate-100 bg-white px-5 py-4 lg:block">
      <h3 className="text-sm font-black text-slate-950">Order Summary</h3>
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-medium text-slate-400">
        Dealer advertisement
      </div>
      {isIncludedWithPlan ? (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-700">
          Included with dealer plan
        </div>
      ) : null}
      <div className="mt-5 space-y-3 text-xs">
        <div className="flex justify-between gap-4">
          <span className="text-slate-500">Placement</span>
          <span className="text-right font-bold text-slate-950">{placement.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Duration</span>
          <span className="font-bold text-slate-950">
            {isIncludedWithPlan ? "Until plan expiry" : `${durationDays} Days`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Ad Fee</span>
          <span className="font-bold text-slate-950">{formatCurrency(price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">VAT (5%)</span>
          <span className="text-slate-400">{formatCurrency(vat)}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
        <span className="font-bold text-blue-600">Total</span>
        <span className="text-lg font-black text-blue-600">{formatCurrency(total)}</span>
      </div>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Estimated Reach</p>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Daily impressions</span>
          <span className="font-bold text-slate-950">~9,800 / day</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-slate-500">Avg. CTR</span>
          <span className="font-bold text-blue-600">3.6%</span>
        </div>
      </div>
    </aside>
  );
};

function CreateAdModal({ draft, onClose, onCreated, planAdBenefits = {} }) {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    _id: draft?._id || "",
    name: draft?.name || "",
    category: draft?.category || "",
    redirectTo: draft?.redirectTo || "",
    durationDays: draft?.durationDays || 30,
    paymentMethod: "card",
    creatives: { desktop: null, tablet: null, mobile: null },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState(null);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [step, setStep] = useState(Math.min(draft?.currentStep || 1, wizardSteps.length));

  useEffect(() => {
    let active = true;

    Promise.allSettled([advertisementsApi.getPlans(), advertisementsApi.getWallet()])
      .then(([plansResult, walletResult]) => {
        if (!active) return;
        if (plansResult.status === "rejected") throw plansResult.reason;

        const data = plansResult.value || [];
        const activePlans = (data || []).filter((plan) => plan.status === "ACTIVE");
        setPlans(activePlans);
        if (walletResult.status === "fulfilled") {
          setWallet(walletResult.value || null);
        }
        if (!form.category && activePlans[0]) {
          setForm((current) => ({
            ...current,
            category: activePlans[0].category,
            durationDays: getMostPopularDuration(activePlans[0].pricingTiers),
          }));
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.response?.data?.message || "Unable to load advertisement plans");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPlan = plans.find((plan) => plan.category === form.category);
  const selectedPlacement = getPlacementMeta(form.category);
  const price = getTierPrice(selectedPlan, form.durationDays);
  const selectedPlanBenefit = planAdBenefits[form.category];
  const isIncludedWithPlan = Number(selectedPlanBenefit?.remaining || 0) > 0;
  const effectivePrice = isIncludedWithPlan ? 0 : price;
  const vat = Number((effectivePrice * 0.05).toFixed(3));
  const total = Number((effectivePrice + vat).toFixed(3));
  const progress = Math.round((step / wizardSteps.length) * 100);
  const walletBalance = Number(wallet?.balance || 0);
  const walletAmountUsed = useWalletBalance && !isIncludedWithPlan ? Math.min(walletBalance, total) : 0;
  const onlineAmountDue = Math.max(0, total - walletAmountUsed);

  const setCreative = (device, file) => {
    setForm((current) => ({
      ...current,
      creatives: { ...current.creatives, [device]: file },
    }));
  };

  const selectPlacement = (category) => {
    const plan = plans.find((item) => item.category === category);
    const benefitStatus = getBenefitStatus(planAdBenefits, category);

    if (benefitStatus.isAvailable) {
      setUseWalletBalance(false);
    }

    setForm((current) => ({
      ...current,
      category,
      durationDays: benefitStatus.isAvailable
        ? 30
        : getMostPopularDuration(plan?.pricingTiers),
    }));
  };

  const validate = () => {
    if (!form.category) return "Choose advertisement placement.";
    if (!form.name.trim()) return "Advertisement name is required.";
    if (!form.redirectTo.trim()) return "Redirect URL is required.";
    if (!isIncludedWithPlan && !price) return "Pricing is not configured for this duration.";
    const missing = devices.find((device) => !form.creatives[device.key] && !draft?.creatives?.[device.key]?.url);
    if (missing) return `${missing.label} creative is required.`;
    return "";
  };

  const handleSave = async (isDraft) => {
    const validationError = isDraft ? "" : validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = {
        ...form,
        paymentMethod: isIncludedWithPlan
          ? "card"
          : useWalletBalance
          ? "wallet"
          : form.paymentMethod,
        useWalletBalance: isIncludedWithPlan ? false : useWalletBalance,
        useDealerPlanBenefit: isIncludedWithPlan,
        currentStep: isDraft ? step : wizardSteps.length,
      };
      const result = isDraft
        ? await advertisementsApi.saveDraft(payload)
        : form._id
          ? await advertisementsApi.submitDraft(form._id, payload)
          : await advertisementsApi.create(payload);

      if (result?.payment?.redirectUrl) {
        window.location.assign(result.payment.redirectUrl);
        return;
      }

      onCreated(result?.advertisement || result);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to save advertisement",
      );
    } finally {
      setSaving(false);
    }
  };

  const goNext = async () => {
    setError("");

    if (step === wizardSteps.length) {
      onClose?.();
      return;
    }

    if (step === 1 && !form.category) {
      setError("Choose advertisement placement.");
      return;
    }

    if (step === 2) {
      const missing = devices.find(
        (device) => !form.creatives[device.key] && !draft?.creatives?.[device.key]?.url,
      );
      if (missing) {
        setError(`${missing.label} creative is required.`);
        return;
      }
    }

    if (step === 3) {
      if (!form.name.trim()) {
        setError("Advertisement name is required.");
        return;
      }
      if (!form.redirectTo.trim()) {
        setError("Redirect URL is required.");
        return;
      }

      if (isIncludedWithPlan) {
        setStep(5);
        return;
      }
    }

    if (step === 4 && !isIncludedWithPlan && !price) {
      setError("Pricing is not configured for this duration.");
      return;
    }

    if ((step === 5 && isIncludedWithPlan) || step === 6) {
      await handleSave(false);
      return;
    }

    setStep((current) => Math.min(current + 1, wizardSteps.length));
  };

  const goPrevious = () => {
    setError("");
    setStep((current) => {
      if (current === 5 && isIncludedWithPlan) return 3;
      return Math.max(current - 1, 1);
    });
  };

  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex min-h-[520px] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      );
    }

    if (step === 1) {
      return (
        <div>
          <h2 className="text-xl font-black text-slate-950">
            Choose Advertisement Placement
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Select where your advertisement will appear on GulfInCart.
          </p>
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {placementMeta.map((placement) => {
              const plan = plans.find((item) => item.category === placement.category);
              const startingPrice = getTierPrice(plan, 7);
              const active = form.category === placement.category;
              const benefitStatus = getBenefitStatus(planAdBenefits, placement.category);

              return (
                <button
                  key={placement.category}
                  type="button"
                  onClick={() => selectPlacement(placement.category)}
                  className={`rounded-2xl border p-4 text-left shadow-sm transition ${
                    active
                      ? "border-blue-600 bg-blue-50/50 ring-1 ring-blue-600"
                      : "border-slate-200 bg-white hover:border-blue-200"
                  }`}
                >
                  <PlacementSketch placement={placement} />
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-black text-slate-950">
                      {placement.title}
                    </h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${placement.labelClass}`}>
                      {placement.label}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${benefitStatus.className}`}>
                      {benefitStatus.label}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    {placement.description}
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400">Starting from</p>
                      <p className="text-lg font-black text-blue-600">
                        {benefitStatus.isAvailable ? "Included" : formatCurrency(startingPrice)}
                        {benefitStatus.isAvailable ? null : (
                          <span className="text-sm font-medium text-slate-500"> / 7 days</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400">Dimensions</p>
                      <p className="font-bold text-slate-700">{placement.dimensions}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div>
          <h2 className="text-xl font-black text-slate-950">Upload Your Creative</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Upload the banner image that will be displayed in your chosen placement.
          </p>
          <div className="mt-5 grid gap-4 xl:grid-cols-3">
            {devices.map((device) => (
              <FileUpload
                key={device.key}
                label={`${device.label} creative`}
                file={form.creatives[device.key]}
                onChange={(file) => setCreative(device.key, file)}
              />
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              ["Use high-resolution vehicle photos", "Minimum 150 DPI for crisp display"],
              ["Include the asking price clearly", "Buyers decide faster when price is visible"],
              ["Add a clear call-to-action", "\"View Listing\" or \"Contact Seller\" works well"],
              ["Keep text minimal and bold", "Large readable text performs significantly better"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-950">{title}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div>
          <h2 className="text-xl font-black text-slate-950">Advertisement Settings</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Configure the details for your advertisement campaign.
          </p>
          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-950">
                Advertisement Name <span className="text-red-500">*</span>
              </span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="e.g. Land Cruiser - Premium Spotlight"
                className="mt-3 h-14 w-full rounded-2xl border border-slate-200 px-5 text-base font-medium text-slate-950 outline-none focus:border-blue-400"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-950">Redirect to</span>
              <input
                value={form.redirectTo}
                onChange={(event) => setForm((current) => ({ ...current, redirectTo: event.target.value }))}
                placeholder="https://example.com/company-profile"
                className="mt-3 h-14 w-full rounded-2xl border border-slate-200 px-5 text-base font-medium text-slate-950 outline-none focus:border-blue-400"
              />
            </label>
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div>
          <h2 className="text-xl font-black text-slate-950">
            Choose Advertisement Duration
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Longer durations offer better value and sustained visibility.
          </p>
          <div className="mt-5 space-y-3">
            {durationOptions.map((days) => {
              const optionPrice = getTierPrice(selectedPlan, days);
              const active = Number(form.durationDays) === days;
              const popular = getMostPopularDuration(selectedPlan?.pricingTiers) === days;

              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, durationDays: days }))}
                  className={`relative flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left ${
                    active ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-slate-200 bg-white"
                  }`}
                >
                  {popular ? (
                    <span className="absolute -top-3 left-7 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white">
                      Most Popular
                    </span>
                  ) : null}
                  <span className="flex items-center gap-5">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      active ? "border-blue-600 bg-blue-600" : "border-slate-200"
                    }`}>
                      {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                    </span>
                    <span>
                      <span className={`block text-lg font-black ${active ? "text-blue-600" : "text-slate-950"}`}>
                        {days} Days
                      </span>
                      <span className="mt-1 block text-sm font-medium text-slate-500">
                        {durationCopy[days]}
                      </span>
                    </span>
                  </span>
                  <span className={`text-xl font-black ${active ? "text-blue-600" : "text-slate-950"}`}>
                    {isIncludedWithPlan ? "Included" : formatCurrency(optionPrice)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-9">
            <h3 className="text-base font-black text-slate-950">
              Compare Advertisement Placements
            </h3>
            <p className="mt-3 text-sm font-medium text-slate-500">
              Quickly compare different advertisement spaces. Selecting a placement will instantly update the pricing options above.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {placementMeta.map((placement) => {
                const plan = plans.find((item) => item.category === placement.category);

                return (
                  <PlacementComparisonCard
                    key={placement.category}
                    placement={placement}
                    isSelected={form.category === placement.category}
                    startingPrice={getTierPrice(plan, 7)}
                    onSelect={() => selectPlacement(placement.category)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div>
          <h2 className="text-xl font-black text-slate-950">Review Your Advertisement</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Review all details and see exactly how your ad will appear on GulfInCart.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              ["Placement", selectedPlacement.title],
              ["Duration", isIncludedWithPlan ? "Until plan expiry" : `${form.durationDays} Days`],
              ["Total", formatCurrency(total)],
              ...(isIncludedWithPlan ? [["Plan Benefit", `${selectedPlanBenefit.remaining} remaining`]] : []),
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                <p className={`mt-2 font-black ${label === "Total" ? "text-blue-600" : "text-slate-950"}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-base font-black text-slate-950">Live Placement Preview</h3>
            <div className="mt-4">
              <PlacementSketch placement={selectedPlacement} />
            </div>
            <p className="mt-2 text-center text-xs font-medium text-slate-400">
              Showing {selectedPlacement.title} preview - {selectedPlacement.dimensions}
            </p>
          </div>
        </div>
      );
    }

    if (step === 6) {
      return (
        <div>
          <h2 className="text-xl font-black text-slate-950">Payment Summary</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Review your order and submit your advertisement for admin review.
          </p>
          <div className="mt-5 rounded-2xl border border-slate-200 p-6">
            <div className="space-y-4 text-sm">
              {[
                ["Advertisement", form.name || selectedPlacement.title],
                ["Placement", selectedPlacement.title],
                ["Duration", isIncludedWithPlan ? "Until plan expiry" : `${form.durationDays} Days`],
                ["Ad Fee", isIncludedWithPlan ? "Included with dealer plan" : formatCurrency(effectivePrice)],
                ["VAT (5%)", formatCurrency(vat)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-bold text-slate-950">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-blue-50 p-5">
              <span className="font-bold text-blue-600">Total</span>
              <span className="text-2xl font-black text-blue-600">{formatCurrency(total)}</span>
            </div>
            {isIncludedWithPlan ? (
              <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                This advertisement will use 1 included {selectedPlacement.title} slot from your dealer plan.
              </div>
            ) : (
            <label className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-white px-4 py-3">
              <span>
                <span className="block text-sm font-bold text-slate-900">Use wallet balance</span>
                <span className="mt-0.5 block text-xs font-medium text-slate-500">
                  Available {formatCurrency(walletBalance)}
                </span>
              </span>
              <input
                type="checkbox"
                checked={useWalletBalance}
                disabled={walletBalance <= 0}
                onChange={(event) => setUseWalletBalance(event.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600"
              />
            </label>
            )}
            {useWalletBalance && !isIncludedWithPlan ? (
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Wallet used</span>
                  <span className="font-bold text-blue-600">- {formatCurrency(walletAmountUsed)}</span>
                </div>
                <div className="mt-2 flex justify-between text-slate-600">
                  <span>Pay remaining</span>
                  <span className="font-bold text-slate-950">{formatCurrency(onlineAmountDue)}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Shield size={30} />
        </span>
        <h2 className="mt-5 text-2xl font-black text-slate-950">Advertisement Submitted</h2>
        <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
          Your advertisement has been submitted for admin review. You can track its status from Advertising Manager.
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-3 py-3 sm:px-4">
      <div className="flex h-[92vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[20px] bg-white text-[13px] shadow-2xl sm:h-[90vh]">
        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 lg:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Megaphone size={18} />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-950">
                {draft ? "Continue Advertisement" : "Create Advertisement"}
              </h2>
              <p className="text-xs font-medium text-slate-500">
                Step {step} of {wizardSteps.length} - {wizardSteps[step - 1]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-3 sm:flex">
              <span className="h-1.5 w-28 rounded-full bg-slate-100">
                <span
                  className="block h-full rounded-full bg-blue-600"
                  style={{ width: `${progress}%` }}
                />
              </span>
              <span className="text-xs font-bold text-slate-500">{progress}%</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
              aria-label="Close advertisement wizard"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <WizardProgress step={step} />

        {error ? (
          <div className="border-b border-red-100 bg-red-50 px-8 py-2 text-sm font-semibold text-red-600">
            {error}
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1">
          <main className="min-w-0 flex-1 overflow-y-auto px-4 py-3 lg:px-5">
            {renderStep()}
          </main>
          {step < wizardSteps.length ? (
            <SummaryPanel
              placement={selectedPlacement}
              durationDays={form.durationDays}
              price={effectivePrice}
              isIncludedWithPlan={isIncludedWithPlan}
            />
          ) : null}
        </div>

        <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 lg:px-5">
          <button
            type="button"
            onClick={goPrevious}
            disabled={step === 1 || saving}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-5 text-xs font-bold text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving || step === wizardSteps.length}
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 px-5 text-xs font-bold text-slate-500 disabled:opacity-40 md:inline-flex"
          >
            <FileText size={16} />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={saving || loading}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-60"
          >
            {saving
              ? "Submitting..."
              : step === 5 && isIncludedWithPlan
              ? "Submit for Review"
              : step === 6
              ? "Submit for Review"
              : step === wizardSteps.length
              ? "Go to My Ads"
              : "Next"}
            <ArrowRight size={17} />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default function AdvertisementsPage() {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalViews: 0,
    totalSpent: 0,
  });
  const [ads, setAds] = useState([]);
  const [planAdBenefits, setPlanAdBenefits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [modalDraft, setModalDraft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [endAdId, setEndAdId] = useState("");
  const [isEndingAd, setIsEndingAd] = useState(false);

  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await advertisementsApi.getSummary();
      setStats(data.stats || {});
      setAds(data.ads || []);
      setPlanAdBenefits(data.planAdBenefits || {});
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load advertisements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvertisements();
  }, []);

  const filteredAds = useMemo(
    () =>
      ads.filter((ad) => {
        const matchesStatus = status === "ALL" || ad.status === status;
        const haystack = [ad.name, ad.advertisementId, ad.categoryLabel, categories[ad.category]]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesStatus && haystack.includes(query.toLowerCase());
      }),
    [ads, query, status],
  );

  const handleEnd = async () => {
    if (!endAdId) return;

    try {
      setIsEndingAd(true);
      const updated = await advertisementsApi.endAd(endAdId);
      const ad = updated.ad || updated;
      setAds((prev) => prev.map((item) => (item._id === ad._id ? ad : item)));
      setEndAdId("");
    } finally {
      setIsEndingAd(false);
    }
  };

  const handleCreated = (ad) => {
    setShowModal(false);
    setModalDraft(null);
    setAds((items) => {
      const exists = items.some((item) => item._id === ad._id);
      return exists
        ? items.map((item) => (item._id === ad._id ? ad : item))
        : [ad, ...items];
    });
    loadAdvertisements();
  };

  if (loading) {
    return <p className="text-sm text-slate-400">Loading advertisements...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Advertising Manager</h1>
          <p className="mt-1 text-sm text-slate-500">Create and track dealer ad campaigns.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setModalDraft(null);
            setShowModal(true);
          }}
          className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Ad
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <StatCard icon={Megaphone} value={stats.activeCampaigns || 0} label="Active Campaigns" iconBg="bg-blue-100 text-blue-600" />
        <StatCard icon={FileText} value={stats.pendingCampaigns || 0} label="Pending Review" iconBg="bg-amber-100 text-amber-600" />
        <StatCard icon={Eye} value={(stats.totalViews || 0).toLocaleString()} label="Total Views" iconBg="bg-violet-100 text-violet-600" />
        <StatCard icon={Wallet} value={formatCurrency(stats.totalSpent || 0)} label="Total Spent" iconBg="bg-emerald-100 text-emerald-600" />
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-lg font-bold text-slate-950">My Ads</h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search ads"
                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-10 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 outline-none"
            >
              {["ALL", "DRAFT", "PENDING", "ACTIVE", "REJECTED", "INACTIVE"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredAds.map((ad) => (
            <div key={ad._id} className="py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (ad.status === "DRAFT") {
                      setModalDraft(ad);
                      setShowModal(true);
                    }
                  }}
                  className="min-w-0 text-left"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    {ad.status === "DRAFT" ? (
                      <span className="text-base font-bold text-slate-950">{getTitle(ad)}</span>
                    ) : (
                      <Link
                        to={`/advertisements/${ad._id}`}
                        className="text-base font-bold text-slate-950 hover:text-blue-600"
                      >
                        {getTitle(ad)}
                      </Link>
                    )}
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${getStatusClass(ad.status)}`}>
                      {ad.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    {categories[ad.category] || ad.categoryLabel || "Advertisement"} - {ad.durationDays || 0} days
                  </p>
                  {ad.rejectionReason ? (
                    <p className="mt-2 text-sm font-semibold text-red-600">{ad.rejectionReason}</p>
                  ) : null}
                </button>

                <div className="flex shrink-0 items-center gap-2">
                  {ad.status === "DRAFT" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setModalDraft(ad);
                        setShowModal(true);
                      }}
                      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white"
                    >
                      Continue
                    </button>
                  ) : (
                    <Link
                      to={`/advertisements/${ad._id}`}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600"
                    >
                      Details
                    </Link>
                  )}
                  {["ACTIVE", "PENDING"].includes(ad.status) ? (
                    <button
                      type="button"
                      onClick={() => setEndAdId(ad._id)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:text-red-600"
                    >
                      End
                    </button>
                  ) : null}
                </div>
              </div>

              {ad.status !== "DRAFT" ? (
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>Views: {(ad.viewCount || 0).toLocaleString()}</span>
                  <span>Starts: {formatDate(ad.startsAt || ad.createdAt)}</span>
                  <span>Ends: {formatDate(ad.endsAt)}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(ad.totalAmount || ad.price)}</span>
                </div>
              ) : null}
            </div>
          ))}

          {filteredAds.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              No advertisements found
            </p>
          ) : null}
        </div>
      </div>

      {showModal ? (
        <CreateAdModal
          draft={modalDraft}
          onClose={() => {
            setShowModal(false);
            setModalDraft(null);
          }}
          onCreated={handleCreated}
          planAdBenefits={planAdBenefits}
        />
      ) : null}

      <ConfirmModal
        isOpen={Boolean(endAdId)}
        title="End ad campaign"
        message="End this ad campaign? It will stop showing in active placements."
        confirmText="End Campaign"
        isLoading={isEndingAd}
        onClose={() => {
          if (!isEndingAd) setEndAdId("");
        }}
        onConfirm={handleEnd}
      />
    </div>
  );
}
