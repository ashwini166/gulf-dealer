import { Award } from "lucide-react";

export default function CurrentPlanBanner({ plan }) {
  if (!plan) return null;

  const isPendingActivation = plan.status === "PENDING_ACTIVATION" || !plan.startDate || !plan.endDate;
  const adSlots = [
    { label: "Homepage", value: plan.homepageBanner ?? plan.plan?.homepageBanner },
    { label: "Listing banner", value: plan.listingBanner ?? plan.plan?.listingBanner },
    { label: "Large ads", value: plan.largeAdsSpace ?? plan.plan?.largeAdsSpace },
    { label: "Small ads", value: plan.smallAdsSpace ?? plan.plan?.smallAdsSpace },
  ].filter((item) => item.value !== null && item.value !== undefined);

  if (isPendingActivation) {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-amber-100">
            <Award size={16} />
            Current Plan
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            {plan.plan?.planName || plan.planNameSnapshot}
          </h2>

          <p className="text-sm text-amber-100">
            Starts after admin approval · BHD {plan.amount}
          </p>

          {plan.launchOfferFreeMonths > 0 && (
            <p className="mt-1 text-sm text-amber-100">
              {plan.offerReason ||
                `Launch offer eligible: ${plan.launchOfferFreeMonths} free months`}
            </p>
          )}

          {adSlots.length > 0 && (
            <p className="mt-1 text-sm text-amber-100">
              Ads included: {adSlots.map((slot) => `${slot.value} ${slot.label}`).join(" · ")}
            </p>
          )}
        </div>

        <div className="w-full text-right sm:w-56">
          <p className="text-xs text-amber-100">Status</p>
          <p className="text-xl font-bold">Pending Approval</p>
        </div>
      </div>
    );
  }

  const endDate = new Date(plan.endDate);
  const totalDays = Number(plan.daysTotal || plan.durationDaysSnapshot || 0);
  const remainingDays = Number(plan.daysRemaining ?? totalDays);
  const usedDays = Number(plan.daysUsed ?? Math.max(totalDays - remainingDays, 0));

  // Progress bar shows remaining percentage
  const progress = totalDays > 0 ? Math.round((remainingDays / totalDays) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
      {/* Left */}
      <div>
        <p className="flex items-center gap-2 text-sm font-medium text-amber-100">
          <Award size={16} />
          Current Plan
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {plan.plan?.planName || plan.planNameSnapshot}
        </h2>

        <p className="text-sm text-amber-100">
          Expires on{" "}
          {endDate.toLocaleDateString("en-GB")} · BHD {plan.amount}
        </p>

        <p className="mt-1 text-sm text-amber-100">
          Status: {plan.status}
        </p>

        {plan.launchOfferApplied && (
          <p className="mt-1 text-sm text-amber-100">
            {plan.offerReason ||
              `Launch offer applied: ${plan.launchOfferFreeMonths} free months`}
          </p>
        )}

        {adSlots.length > 0 && (
          <p className="mt-1 text-sm text-amber-100">
            Ads included: {adSlots.map((slot) => `${slot.value} ${slot.label}`).join(" · ")}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="w-full sm:w-56">
        <p className="text-right text-xs text-amber-100">
          {plan.daysLabel || `${remainingDays} Days Remaining`}
        </p>

        <p className="text-right text-xl font-bold">
          {remainingDays}/{totalDays}
        </p>

        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/30">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-2 text-right text-xs text-amber-100">
          {usedDays} days used
        </p>
      </div>
    </div>
  );
}
