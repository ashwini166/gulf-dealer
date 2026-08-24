import { isPremiumPlan } from "../utils/planHelpers";

export default function PlanCard({ plan, isCurrent, onSelect }) {
  const tier = plan.pricingTiers?.[0];
  const price = plan.finalPrice ?? tier?.finalPrice ?? tier?.price ?? 0;
  const isPremium = isPremiumPlan(plan);

  return (
    <div
      className={`flex flex-col rounded-2xl p-6 ${
        isPremium ? "bg-slate-950 text-white" : "border border-slate-200 bg-white"
      }`}
    >
      {/* Plan Name */}
      <span
        className={`mb-4 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          isPremium ? "bg-amber-500 text-white" : "border border-slate-300"
        }`}
      >
        {plan.planName}
      </span>

      {/* Price */}
      <p
        className={`text-3xl font-bold ${
          isPremium ? "text-amber-400" : "text-blue-600"
        }`}
      >
        BHD {Number(price || 0).toFixed(3)}
      </p>
      <p
        className={`mt-1 text-xs ${
          isPremium ? "text-slate-300" : "text-slate-500"
        }`}
      >
        {plan.vatEnabled ? "VAT-inclusive" : "VAT-exclusive"}
      </p>

      {/* Duration */}
      <p className={`mt-1 text-sm ${isPremium ? "text-slate-300" : "text-slate-500"}`}>
        {tier?.durationDays} Days
      </p>

      {plan.launchOfferEnabled && Number(plan.launchOfferFreeMonths || 0) > 0 && (
        <p
          className={`mt-2 text-sm font-semibold ${
            isPremium ? "text-amber-300" : "text-amber-600"
          }`}
        >
          + {plan.launchOfferFreeMonths} free months on first purchase
        </p>
      )}

      {/* Features */}
      <ul className="mt-5 flex-1 space-y-2 text-sm">
        <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
          • {plan.activeListingCount ?? 0} Active Listings
        </li>

        {plan.homepageBanner !== null && plan.homepageBanner !== undefined && (
          <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • {plan.homepageBanner} Homepage Banner{Number(plan.homepageBanner) === 1 ? "" : "s"}
          </li>
        )}

        {plan.listingBanner !== null && plan.listingBanner !== undefined && (
          <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • {plan.listingBanner} Listing Banner{Number(plan.listingBanner) === 1 ? "" : "s"}
          </li>
        )}

        {plan.largeAdsSpace !== null && plan.largeAdsSpace !== undefined && (
          <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • {plan.largeAdsSpace} Large Ads Space
          </li>
        )}

        {plan.smallAdsSpace !== null && plan.smallAdsSpace !== undefined && (
          <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • {plan.smallAdsSpace} Small Ads Space
          </li>
        )}

        <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
          • {plan.maxPhotos ?? 0} Photos
        </li>

        <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
          • {plan.maxVideos ?? 0} Videos
        </li>

        <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
          • Visibility: {plan.visibility}
        </li>

        {plan.hasFeaturedListing && (
          <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • Featured Listing
          </li>
        )}

        {plan.hasAutomaticListingRefresh && (
          <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • Auto Refresh
          </li>
        )}

        {plan.hasVehicleVideo && (
          <li className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • Vehicle Video
          </li>
        )}

        {plan.features?.map((feature) => (
          <li key={feature} className={isPremium ? "text-slate-300" : "text-slate-600"}>
            • {feature}
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={() => onSelect(plan)}
        disabled={isCurrent}
        className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold ${
          isCurrent
            ? "cursor-not-allowed bg-slate-100 text-slate-400"
            : isPremium
            ? "bg-white text-slate-950 hover:bg-slate-100"
            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
        }`}
      >
        {isCurrent ? "Current Plan" : isPremium ? "Upgrade Plan" : "Choose Plan"}
      </button>
    </div>
  );
}
