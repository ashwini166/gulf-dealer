import { useMemo, useState } from "react";
import { ChevronDown, Star } from "lucide-react";
import { isPremiumPlan } from "../utils/planHelpers";

export default function ComparePlansTable({ plans = [] }) {
  const [open, setOpen] = useState(true);

  const rows = useMemo(() => {
    return [
      { label: "Listing Duration", key: "listingDuration" },
      { label: "Active Listings", key: "activeListingCount" },
      { label: "Homepage Banners", key: "homepageBanner" },
      { label: "Listing Banners", key: "listingBanner" },
      { label: "Large Ads Space", key: "largeAdsSpace" },
      { label: "Small Ads Space", key: "smallAdsSpace" },
      { label: "Maximum Photos", key: "maxPhotos" },
      { label: "Maximum Videos", key: "maxVideos" },
      { label: "Vehicle Video", key: "hasVehicleVideo" },
      { label: "Visibility", key: "visibility" },
      { label: "Featured Listing", key: "hasFeaturedListing" },
      { label: "Auto Refresh", key: "hasAutomaticListingRefresh" },
      { label: "WhatsApp Enquiries", key: "hasWhatsappPhoneEnquiries" },
      { label: "Admin Approval", key: "requiresAdminApproval" },
    ];
  }, []);

  if (!plans.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 bg-slate-50 px-6 py-4 text-left text-base font-semibold text-slate-900"
      >
        Compare Plans
        <ChevronDown
          size={16}
          className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="overflow-x-auto border-t border-slate-200">
          <table className="w-full min-w-[900px] table-fixed border-collapse text-sm">
            <thead>
              <tr className="divide-x divide-slate-200 bg-slate-50">
                <th className="px-6 py-3.5 text-left font-semibold text-slate-500">
                  Feature
                </th>

                {plans.map((plan) => {
                  const featured = isPremiumPlan(plan);
                  return (
                    <th
                      key={plan._id}
                      className={`px-6 py-3.5 text-center font-semibold ${
                        featured ? "text-blue-600" : "text-slate-500"
                      }`}
                    >
                      <span className="inline-flex items-center justify-center gap-1.5">
                        {plan.planName}
                        {featured ? (
                          <Star size={14} className="fill-amber-400 text-amber-400" />
                        ) : null}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.key}
                  className={`divide-x divide-slate-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                  }`}
                >
                  <td className="px-6 py-3.5 font-semibold text-slate-800">
                    {row.label}
                  </td>

                  {plans.map((plan) => {
                    const value = plan[row.key];

                    return (
                      <td key={plan._id} className="px-6 py-3.5 text-center text-slate-700">
                        {typeof value === "boolean" ? (
                          value ? (
                            <span className="text-base font-bold leading-none text-emerald-500">
                              ✓
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )
                        ) : value !== null &&
                          value !== undefined &&
                          value !== "" ? (
                          value
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
