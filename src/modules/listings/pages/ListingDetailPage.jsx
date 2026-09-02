import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceCountryCurrencyByName } from "../config/gulfLocations.config";
import { Check, Loader2, Star, Trash2 } from "lucide-react";

import {
  getListingDetailApi,
  getMyWalletApi,
  getPaymentStatusApi,
  purchaseListingPlanApi,
  resubmitListingApi,
} from "../api/listingDetailApi";
import { listingsApi } from "../api/listingsApi";
import { useToast } from "../../../context/ToastContext";
import {
  closePreparedPaymentWindow,
  openPaymentWindow,
  preparePaymentWindow,
} from "../../payment/paymentPopup";

import { carFormConfig } from "../config/categoryForms/carForm.config";
import { commercialFormConfig } from "../config/categoryForms/commercialForm.config";
import { heavyEquipmentFormConfig } from "../config/categoryForms/heavyEquipmentForm.config";
import { motorbikeFormConfig } from "../config/categoryForms/motorbikeForm.config";
import { buggyFormConfig } from "../config/categoryForms/buggyForm.config";
import { caravanFormConfig } from "../config/categoryForms/caravanForm.config";
import { specialNumberFormConfig } from "../config/categoryForms/specialNumberForm.config";
import PlateSummary from "../components/detail/PlateSummary";

import EditableFieldSection from "../components/detail/EditableFieldSection";
import FeaturesDisplay from "../components/detail/FeaturesDisplay";
import CustomerInquiries from "../components/detail/CustomerInquiries";
import SellerInfoCard from "../components/detail/SellerInfoCard";
import { submitSingleBulkListingApi } from "../api/bulkListingApi";
import heroImage from "../../../assets/hero.png";

const configByFormType = {
  CAR: carFormConfig,
  COMMERCIAL: commercialFormConfig,
  HEAVY_EQUIPMENT: heavyEquipmentFormConfig,
  MOTORBIKE: motorbikeFormConfig,
  BUGGY: buggyFormConfig,
  CARAVAN: caravanFormConfig,
  SPECIAL_NUMBER: specialNumberFormConfig,
};

const statusConfig = {
  DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  PENDING_REVIEW: { label: "Pending", className: "bg-amber-100 text-amber-700" },
  PUBLISHED: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700" },
  EXPIRED: { label: "Expired", className: "bg-slate-200 text-slate-500" },
};

const EDITABLE_STATUSES = ["DRAFT", "PENDING_REVIEW", "REJECTED"];

const formatLocation = (location = {}) =>
  [location.city, location.governorate, location.country].filter(Boolean).join(", ");

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const formatPlanAmount = (value) => `BHD ${Number(value || 0).toFixed(2)}`;
const getResubmitAmount = (listing) =>
  listing?.resubmissionPaymentRequired
    ? Number(
        listing?.planLimitsSnapshot?.finalPriceSnapshot ??
          listing?.planLimitsSnapshot?.priceSnapshot ??
          0
      )
    : 0;

const formatDaysUsedVsTotal = (listing, now) => {
  const durationLabel = listing?.planLimitsSnapshot?.listingDurationSnapshot;
  const totalDays = durationLabel ? parseInt(durationLabel, 10) : 75;
  const startDate = listing?.publishedAt || listing?.submittedAt || listing?.createdAt;

  if (!startDate || !now) {
    return { totalDays, daysUsed: 0, percent: 0 };
  }

  const daysUsed = Math.max(
    0,
    Math.ceil((now - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    totalDays,
    daysUsed: Math.min(daysUsed, totalDays),
    percent: Math.min(100, Math.round((daysUsed / totalDays) * 100)),
  };
};

const ListingOverviewCard = ({
  listing,
  leadsCount,
  onToggleSold,
  isTogglingSold,
  onDelete,
  onSubmitForReview,
  isSubmitting,
  onResubmit,
  isResubmitting,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [now, setNow] = useState(null);
  const media = listing?.media || {};
  const thumbs = [
    ...(media.featuredImage?.url ? [{ type: "image", url: media.featuredImage.url }] : []),
    ...(media.images || []).map((image) => ({ type: "image", url: image.url })),
    ...(media.video?.url ? [{ type: "video", url: media.video.url }] : []),
  ];
  const activeMedia = thumbs[activeIndex] || thumbs[0];
  const vehicleInfo = listing?.vehicleInfo || {};
  const specs = listing?.specs || {};
  const pricing = listing?.pricing || {};
  const selectedCurrency =
    pricing.currency ||
    getServiceCountryCurrencyByName(listing?.location?.country);
  const status = statusConfig[listing?.status] || statusConfig.DRAFT;
  const isSold = Boolean(listing?.isSold) || listing?.status === "SOLD";
  const isFeatured = listing?.addOns?.some((addOn) => /featured/i.test(addOn.planNameSnapshot));
  const { daysUsed, totalDays, percent } = formatDaysUsedVsTotal(listing, now);
  const listingAgeDays =
    listing?.createdAt && now
      ? Math.max(0, Math.floor((now - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

  useEffect(() => {
    const timerId = window.setTimeout(() => setNow(Date.now()), 0);

    return () => window.clearTimeout(timerId);
  }, []);

  return (
    <section className="overflow-hidden rounded-[12px] border border-[#e5eaf1] bg-white">
      <div className="relative h-[196px] overflow-hidden bg-slate-200">
        {activeMedia?.type === "video" ? (
          <video src={activeMedia.url} controls className="h-full w-full object-cover" />
        ) : (
          <img
            src={activeMedia?.url || heroImage}
            alt={vehicleInfo.title || "Vehicle"}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <span className="absolute right-5 top-4 rounded-[8px] bg-slate-950/70 px-3 py-1 text-xs font-black text-white">
          {listing?.listingNumber || listing?.referenceNumber || "GIC-2026-00042"}
        </span>

        <div className="absolute bottom-7 left-5">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex h-6 items-center rounded-full px-3 text-xs font-black ${isSold ? "bg-slate-100 text-slate-700" : status.className}`}>
              {isSold ? "Sold" : status.label}
            </span>
            {isFeatured ? (
              <span className="inline-flex h-6 items-center gap-1 rounded-full bg-[#2454ef] px-3 text-xs font-black text-white">
                <Star size={12} fill="currentColor" />
                Featured
              </span>
            ) : null}
          </div>
          <h1 className="text-[18px] font-black leading-6 text-white">
            {vehicleInfo.title || "Untitled Listing"}
          </h1>
          <p className="mt-1 text-xs font-semibold text-white/75">
            {vehicleInfo.manufacturingYear || "2022"} • {(vehicleInfo.mileage || 0).toLocaleString()} km •{" "}
            {vehicleInfo.fuelType || specs.fuelType || "Petrol"} • GCC Specs
          </p>
        </div>

        <div className="absolute bottom-5 right-5 flex items-center gap-1.5">
          {thumbs.slice(0, 4).map((thumb, index) => (
            <button
              key={`${thumb.url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-10 w-14 overflow-hidden rounded-[5px] border-2 ${
                activeIndex === index ? "border-white" : "border-white/30"
              }`}
            >
              {thumb.type === "video" ? (
                <span className="flex h-full w-full items-center justify-center bg-slate-950 text-[10px] font-black text-white">
                  VID
                </span>
              ) : (
                <img src={thumb.url} alt="" className="h-full w-full object-cover" />
              )}
            </button>
          ))}
          {thumbs.length > 4 ? (
            <span className="flex h-10 w-12 items-center justify-center rounded-[5px] bg-slate-950/70 text-xs font-black text-white">
              +{thumbs.length - 4}
            </span>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 px-5 py-4 sm:grid-cols-[180px_1fr]">
        <div>
          <p className="text-xs font-semibold text-[#8897ad]">Listing Price</p>
          <p className="mt-1 text-[22px] font-black leading-none text-[#2454ef]">
            {selectedCurrency} {Number(pricing.price || 0).toLocaleString()}
          </p>
        </div>

        <div className="max-w-[250px]">
          <div className="flex items-center justify-between text-[11px] font-black text-[#202a3b]">
            <span className="font-semibold text-[#8897ad]">Listing Duration</span>
            <span>{isSold ? "Sold" : `${daysUsed}/${totalDays} days`}</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9eef8]">
            <div className="h-full rounded-full bg-[#2454ef]" style={{ width: `${isSold ? 100 : percent}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 sm:col-span-2">
          {isSold ? (
            <span className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#dfe5ee] bg-slate-50 px-4 text-xs font-black text-slate-700">
              <Check size={13} />
              Sold
            </span>
          ) : (
            <button
              type="button"
              onClick={onToggleSold}
              disabled={isTogglingSold}
              className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-[#dfe5ee] bg-white px-4 text-xs font-black text-[#202a3b] disabled:opacity-60"
            >
              {isTogglingSold ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Mark as Sold
            </button>
          )}

          {listing.status === "DRAFT" ? (
            <button
              type="button"
              onClick={onSubmitForReview}
              disabled={isSubmitting}
              className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#2454ef] px-4 text-xs font-black text-white disabled:opacity-60"
            >
              {isSubmitting && <Loader2 size={13} className="animate-spin" />}
              Submit for Review
            </button>
          ) : null}

          {listing.status === "REJECTED" ? (
            <button
              type="button"
              onClick={onResubmit}
              disabled={isResubmitting}
              className="inline-flex h-9 items-center gap-2 rounded-[8px] bg-[#2454ef] px-4 text-xs font-black text-white disabled:opacity-60"
            >
              {isResubmitting && <Loader2 size={13} className="animate-spin" />}
              Resubmit for Review
            </button>
          ) : null}

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex h-9 items-center gap-2 rounded-[8px] border border-red-100 bg-white px-4 text-xs font-black text-red-500"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-[#edf1f6] min-[620px]:grid-cols-4">
        {[
          { label: "Views / Impressions", value: listing?.viewCount?.toLocaleString() || "0", tone: "text-[#2454ef]" },
          { label: "Clicks / Interactions", value: listing?.interactionsCount || listing?.clickCount || 0, tone: "text-red-500" },
          { label: "Inquiries / Form Filled", value: leadsCount ?? 0, tone: "text-emerald-600" },
          { label: "Listing Age", value: isSold ? "Sold" : `${listingAgeDays} Days`, tone: "text-amber-600" },
        ].map((item) => (
          <div key={item.label} className="border-r border-[#edf1f6] px-4 py-3 text-center last:border-r-0">
            <p className={`text-lg font-black leading-6 ${item.tone}`}>{item.value}</p>
            <p className="text-xs font-semibold text-[#9aa8bd]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ResubmitReviewModal = ({ listing, onClose, onComplete }) => {
  const { showToast } = useToast();
  const [wallet, setWallet] = useState(null);
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totalAmount = getResubmitAmount(listing);
  const walletBalance = Number(wallet?.balance || 0);
  const walletAmountUsed = useWalletBalance ? Math.min(walletBalance, totalAmount) : 0;
  const onlineAmountDue = Math.max(0, totalAmount - walletAmountUsed);
  const planSnapshot = listing?.planLimitsSnapshot || {};

  useEffect(() => {
    if (totalAmount <= 0) return undefined;

    let active = true;
    setIsWalletLoading(true);

    getMyWalletApi()
      .then((walletData) => {
        if (active) setWallet(walletData || null);
      })
      .catch(() => {
        if (active) setWallet(null);
      })
      .finally(() => {
        if (active) setIsWalletLoading(false);
      });

    return () => {
      active = false;
    };
  }, [totalAmount]);

  const waitForPaymentCompletion = async (paymentId) => {
    if (!paymentId) return null;

    for (let attempt = 0; attempt < 45; attempt += 1) {
      const payment = await getPaymentStatusApi(paymentId);

      if (["CAPTURED", "FAILED", "CANCELLED", "EXPIRED"].includes(payment.status)) {
        return payment;
      }

      await wait(2000);
    }

    return null;
  };

  const completePaymentIfNeeded = async () => {
    if (totalAmount <= 0) return;

    const planId = String(planSnapshot.planId || "");
    if (!planId) {
      throw new Error("Listing plan information is missing. Please contact support.");
    }

    setMessage("Processing listing payment...");
    const paymentWindow = preparePaymentWindow();

    try {
      const result = await purchaseListingPlanApi(planId, {
        listingId: listing._id,
        useWalletBalance,
      });

      if (result?.payment?.redirectUrl) {
        openPaymentWindow(result.payment.redirectUrl, paymentWindow);
        const completedPayment = await waitForPaymentCompletion(result.payment.id);

        if (completedPayment?.status !== "CAPTURED") {
          throw new Error(
            completedPayment?.failureReason || "Payment was not completed. Please try again."
          );
        }
      }
    } finally {
      closePreparedPaymentWindow(paymentWindow);
    }
  };

  const handleConfirm = async () => {
    try {
      setError("");
      setIsSubmitting(true);
      await completePaymentIfNeeded();
      setMessage("Resubmitting listing for admin review...");
      const updatedListing = await resubmitListingApi(listing._id);
      showToast("Listing resubmitted for admin review", "success");
      onComplete(updatedListing);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to resubmit this listing"
      );
    } finally {
      setIsSubmitting(false);
      setMessage("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-950">Resubmit for Review</h3>
        <p className="mt-2 text-sm text-slate-500">
          Complete the payment step, then this listing will go back to admin review.
        </p>

        <div className="mt-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Plan</span>
            <span className="text-right font-bold text-slate-900">
              {planSnapshot.planNameSnapshot || "Listing plan"}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Amount due</span>
            <span className="font-bold text-slate-900">{formatPlanAmount(totalAmount)}</span>
          </div>

          {totalAmount > 0 ? (
            <label className="flex cursor-pointer items-start gap-3 border-t border-slate-200 pt-3">
              <input
                type="checkbox"
                checked={useWalletBalance}
                onChange={(event) => setUseWalletBalance(event.target.checked)}
                disabled={isWalletLoading || walletBalance <= 0 || isSubmitting}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className="min-w-0 flex-1 font-medium text-slate-600">
                <span className="block font-bold text-slate-900">Use wallet balance</span>
                {isWalletLoading
                  ? "Checking wallet balance..."
                  : walletBalance > 0
                    ? `Available ${formatPlanAmount(walletBalance)}. ${
                        useWalletBalance
                          ? `Wallet will cover ${formatPlanAmount(walletAmountUsed)}${
                              onlineAmountDue > 0
                                ? ` and ${formatPlanAmount(onlineAmountDue)} remains for Tap payment.`
                                : "."
                            }`
                          : "Select this to apply wallet credit to this payment."
                      }`
                    : "No wallet balance available for this payment."}
              </span>
            </label>
          ) : (
            <p className="border-t border-slate-200 pt-3 font-semibold text-emerald-700">
              No payment is due for this resubmission.
            </p>
          )}
        </div>

        {message ? (
          <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
            {onlineAmountDue > 0 ? "Pay & Resubmit" : "Resubmit"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ListingDetailPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [leadsCount, setLeadsCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSoldConfirm, setShowSoldConfirm] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingSold, setIsTogglingSold] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);

  const fetchListing = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const data = await getListingDetailApi(listingId);
      setListing(data);
    } catch (error) {
      setLoadError(error.response?.data?.message || "Unable to load this listing");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const handleSectionSaved = (updatedListing) => {
    setListing(updatedListing);
  };

  const handleConfirmSold = async () => {
    setIsTogglingSold(true);

    try {
      await listingsApi.toggleSold(listingId);
      showToast("Listing marked as sold", "success");
      await fetchListing();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to update listing", "error");
    } finally {
      setIsTogglingSold(false);
      setShowSoldConfirm(false);
    }
  };

  const handleSubmitForReview = async () => {
    setIsSubmitting(true);

    try {
      await submitSingleBulkListingApi(listingId);
      showToast("Vehicle submitted for admin review", "success");
      await fetchListing();
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to submit for review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      await listingsApi.deleteVehicle(listingId);
      showToast("Listing deleted", "success");
      navigate("/vehicles");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to delete listing", "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 size={26} className="animate-spin text-slate-400" />
      </div>
    );
  }

  if (loadError || !listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError || "Listing not found"}
        </div>
      </div>
    );
  }

  const formType = listing.category?.vehicleFormType || "CAR";
  const config = configByFormType[formType] || carFormConfig;
  const categoryId = listing.category?._id || listing.category;

  const canEdit = EDITABLE_STATUSES.includes(listing.status) && !listing.isSold;
  const vehicleInfo = listing.vehicleInfo || {};
  const specs = listing.specs || {};
  const features = listing.features || {};
  const displayVehicleInfo = {
    ...vehicleInfo,
    category: listing.category?.name || listing.category?.label || config.label,
    condition: vehicleInfo.condition || listing.condition || "Used — Excellent",
    price: `${selectedCurrency} ${Number(listing.pricing?.price || 0).toLocaleString()}`,
    priceNegotiable: listing.pricing?.isNegotiable ?? listing.pricing?.priceNegotiable,
    location: formatLocation(listing.location),
  };

  const handleResubmitComplete = (updatedListing) => {
    setListing(updatedListing);
    setShowResubmitModal(false);
    setIsResubmitting(false);
  };
  const displayVehicleInfoFields = [
    { name: "title", label: "Listing Title", type: "text" },
    { name: "bodyType", label: "Body Type", type: "text" },
    { name: "catalogModel", label: "Model", type: "modelSelect" },
    { name: "manufacturingYear", label: "Manufacturing Year", type: "text" },
    { name: "price", label: "Price", type: "text" },
    { name: "availability", label: "Availability", type: "text" },
    { name: "sellerName", label: "Seller Name", type: "text" },
    { name: "mobileNumber", label: "Mobile Number", type: "text" },
    { name: "whatsappNumber", label: "WhatsApp Number", type: "text" },
    { name: "contactEmail", label: "Contact Email", type: "text" },
    { name: "category", label: "Category", type: "text" },
    { name: "brand", label: "Brand", type: "brandSelect" },
    { name: "variantTrim", label: "Variant", type: "text" },
    { name: "condition", label: "Condition", type: "text" },
    { name: "priceNegotiable", label: "Price Negotiable", type: "yesNoSelect" },
    { name: "location", label: "Location", type: "text" },
  ];

  return (
    <div className="mx-auto max-w-[910px] space-y-[16px] py-4">
      <div className="pb-2">
        <h1 className="text-[22px] font-black leading-7 text-[#111827]">My Listings</h1>
        <button
          type="button"
          onClick={() => navigate("/vehicles")}
          className="mt-1 text-[13px] font-semibold text-[#7d8aa0] hover:text-[#2454ef]"
        >
          View all Listings &gt; {vehicleInfo.title || "Listing Detail"}
        </button>
      </div>

      <ListingOverviewCard
        listing={listing}
        leadsCount={leadsCount}
        isSubmitting={isSubmitting}
        isResubmitting={isResubmitting}
        isTogglingSold={isTogglingSold}
        onDelete={() => setShowDeleteConfirm(true)}
        onSubmitForReview={handleSubmitForReview}
        onResubmit={() => {
          setIsResubmitting(true);
          setShowResubmitModal(true);
        }}
        onToggleSold={() => setShowSoldConfirm(true)}
      />

      <div className="space-y-[16px]">
        <EditableFieldSection
          title={formType === "SPECIAL_NUMBER" ? "Plate Info" : "Vehicle Information"}
          step={4}
          fields={config.vehicleInfoFields.filter((field) => field.name !== "description")}
          displayFields={displayVehicleInfoFields}
          displaySourceData={displayVehicleInfo}
          sourceData={vehicleInfo}
          categoryId={categoryId}
          listingId={listingId}
          canEdit={canEdit}
          onSaved={handleSectionSaved}
        />
        {formType === "SPECIAL_NUMBER" && <PlateSummary vehicleInfo={vehicleInfo} />}

        {config.specsFields.length > 0 && (
          <EditableFieldSection
            title={config.engineSectionTitle || `${config.label} Specifications`}
            step={5}
            fields={config.specsFields}
            displayFields={[
              { name: "mileage", label: "Mileage", type: "number" },
              { name: "transmission", label: "Transmission", type: "text" },
              { name: "engineCapacity", label: "Engine Capacity", type: "text" },
              { name: "doors", label: "Doors", type: "text" },
              { name: "exteriorColor", label: "Exterior Color", type: "text" },
              { name: "steeringSide", label: "Steering Side", type: "text" },
              { name: "fuelType", label: "Fuel Type", type: "text" },
              { name: "driveType", label: "Drive Type", type: "text" },
              { name: "horsepower", label: "Horsepower", type: "number" },
              { name: "seats", label: "Seats", type: "text" },
              { name: "interiorColor", label: "Interior Color", type: "text" },
              { name: "vehicleClass", label: "Vehicle Class", type: "text" },
            ]}
            displaySourceData={{ ...vehicleInfo, ...specs }}
            sourceData={specs}
            categoryId={categoryId}
            listingId={listingId}
            canEdit={canEdit}
            onSaved={handleSectionSaved}
          />
        )}

        <EditableFieldSection
          title="Description"
          step={4}
          fields={config.vehicleInfoFields.filter((field) => field.name === "description")}
          sourceData={vehicleInfo}
          categoryId={categoryId}
          listingId={listingId}
          canEdit={canEdit}
          onSaved={handleSectionSaved}
          gridLayout="sm:grid-cols-1"
        />

        <FeaturesDisplay config={config} features={features} />

        <CustomerInquiries listingId={listingId} onCountLoaded={setLeadsCount} />

        <SellerInfoCard listing={listing} />
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900">Delete this listing?</h3>
            <p className="mt-2 text-sm text-slate-500">
              This listing will be permanently deleted. This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSoldConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-semibold text-slate-900">Mark this listing as sold?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Once marked as sold, this vehicle will show as sold everywhere and listing duration will no longer be shown.
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSoldConfirm(false)}
                disabled={isTogglingSold}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSold}
                disabled={isTogglingSold}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {isTogglingSold ? "Updating..." : "Mark as Sold"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResubmitModal ? (
        <ResubmitReviewModal
          listing={listing}
          onClose={() => {
            setShowResubmitModal(false);
            setIsResubmitting(false);
          }}
          onComplete={handleResubmitComplete}
        />
      ) : null}
    </div>
  );
};

export default ListingDetailPage;
