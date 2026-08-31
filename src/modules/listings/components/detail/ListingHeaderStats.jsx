import { Check, Star } from "lucide-react";
import { getServiceCountryCurrencyByName } from "../../config/gulfLocations.config";

const statusConfig = {
  DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  PENDING_REVIEW: { label: "Pending Review", className: "bg-amber-100 text-amber-700" },
  PUBLISHED: { label: "Active", className: "bg-emerald-100 text-emerald-700" },
  REJECTED: { label: "Rejected", className: "bg-red-100 text-red-700" },
  EXPIRED: { label: "Expired", className: "bg-slate-200 text-slate-500" },
};

const formatDaysUsedVsTotal = (listing) => {
  const durationLabel = listing?.planLimitsSnapshot?.listingDurationSnapshot;
  const totalDays = durationLabel ? parseInt(durationLabel, 10) : null;

  const startDate = listing?.publishedAt || listing?.submittedAt || listing?.createdAt;

  if (!totalDays || !startDate) {
    return { totalDays: null, daysUsed: 0, percent: 0 };
  }

  const daysUsed = Math.max(
    0,
    Math.ceil((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
  );

  const percent = Math.min(100, Math.round((daysUsed / totalDays) * 100));

  return { totalDays, daysUsed: Math.min(daysUsed, totalDays), percent };
};

const ListingHeaderStats = ({ listing }) => {
  const status = statusConfig[listing?.status] || statusConfig.DRAFT;
  const vehicleInfo = listing?.vehicleInfo || {};
  const pricing = listing?.pricing || {};
  const selectedCurrency =
    pricing.currency ||
    getServiceCountryCurrencyByName(listing?.location?.country);
  const { totalDays, daysUsed, percent } = formatDaysUsedVsTotal(listing);

  const listingAgeDays = listing?.createdAt
    ? Math.max(
        0,
        Math.floor((Date.now() - new Date(listing.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}>
          <Check size={12} />
          {status.label}
        </span>

        {listing?.addOns?.some((addOn) => /featured/i.test(addOn.planNameSnapshot)) && (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700">
            <Star size={12} />
            Featured
          </span>
        )}
      </div>

      <h1 className="mt-2 text-2xl font-bold text-slate-950">
        {vehicleInfo.title || "Untitled Listing"}
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        {vehicleInfo.manufacturingYear} · {vehicleInfo.mileage?.toLocaleString() || 0} km ·{" "}
        {vehicleInfo.fuelType || "—"} {listing?.specs?.isGccSpecs ? "· GCC Specs" : ""}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs text-slate-400">Listing Price</p>
          <p className="text-2xl font-bold text-blue-600">
            {selectedCurrency} {Number(pricing.price || 0).toLocaleString()}
          </p>
        </div>

        {totalDays && (
          <div className="min-w-[180px] flex-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Listing Duration</span>
              <span>{daysUsed}/{totalDays} days</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xl font-bold text-blue-600">{listing?.viewCount?.toLocaleString() || 0}</p>
          <p className="text-xs text-slate-400">Views / Impressions</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xl font-bold text-red-500">{listing?.interactionsCount || 0}</p>
          <p className="text-xs text-slate-400">Clicks / Interactions</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xl font-bold text-emerald-600">{listing?.leadsCount || 0}</p>
          <p className="text-xs text-slate-400">Inquiries / Form Filled</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-center">
          <p className="text-xl font-bold text-amber-600">{listingAgeDays} Days</p>
          <p className="text-xs text-slate-400">Listing Age</p>
        </div>
      </div>
    </div>
  );
};

export default ListingHeaderStats;
