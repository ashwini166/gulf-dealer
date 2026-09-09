const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const COUNTRY_CURRENCY_MAP = {
  Bahrain: "BHD",
  "Saudi Arabia": "SAR",
  Kuwait: "KWD",
  "United Arab Emirates": "AED",
  UAE: "AED",
  Oman: "OMR",
  Qatar: "QAR",
};

const formatAmount = (value, currency) =>
  value !== null && value !== undefined ? `${currency} ${Number(value || 0).toFixed(2)}` : "-";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : DATE_FORMATTER.format(date);
};

const isExpired = (date) => {
  if (!date) return false;
  const expiryDate = new Date(date);
  return !Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() < Date.now();
};

const getLifecycleStatus = (listing, expiryDate) => {
  if (listing?.status === "EXPIRED" || isExpired(expiryDate)) return "Expired";
  if (listing?.status === "PUBLISHED") return "Active";
  if (listing?.status === "PENDING_REVIEW") return "Pending";
  if (listing?.status === "REJECTED") return "Rejected";
  if (listing?.status === "DRAFT") return "Draft";
  return "-";
};

const getAddOnDates = (listing, addOns) => {
  const hasBump = addOns.some((addOn) => /BUMP_TO_TOP/i.test(addOn.promotionTypeSnapshot || "") || /bump/i.test(addOn.planNameSnapshot || ""));
  const hasFeatured = addOns.some((addOn) => /FEATURED|HOMEPAGE/i.test(addOn.promotionTypeSnapshot || "") || /featured/i.test(addOn.planNameSnapshot || ""));
  const promotion = hasBump
    ? listing?.promotions?.bumpToTop || listing?.bumpToTop
    : hasFeatured
      ? listing?.promotions?.featured
      : null;

  return {
    startDate: promotion?.activatedAt || listing?.publishedAt || listing?.submittedAt || listing?.createdAt,
    expiryDate: promotion?.expiresAt || listing?.expiresAt,
  };
};

const PlanAddOnsSection = ({ listing }) => {
  const planSnapshot = listing?.planLimitsSnapshot || {};
  const addOns = Array.isArray(listing?.addOns) ? listing.addOns : [];
  const currency =
    listing?.pricing?.currency ||
    COUNTRY_CURRENCY_MAP[String(listing?.location?.country || "").trim()] ||
    "BHD";
  const planPrice = Number(
    planSnapshot.finalPriceSnapshot ?? planSnapshot.priceSnapshot ?? 0
  );
  const addOnsTotal = addOns.reduce(
    (sum, addOn) => sum + Number(addOn.priceSnapshot || 0),
    0
  );
  const planStartDate = listing?.publishedAt || listing?.submittedAt || listing?.createdAt;
  const planExpiryDate = listing?.expiresAt;
  const addOnDates = getAddOnDates(listing, addOns);

  const rows = [
    { label: "Selected Plan", value: planSnapshot.planNameSnapshot || "-" },
    { label: "Plan Price", value: formatAmount(planPrice, currency) },
    { label: "Listing Duration", value: planSnapshot.listingDurationSnapshot || "-" },
    {
      label: "Selected Add-on",
      value: addOns.length ? addOns.map((addOn) => addOn.planNameSnapshot).filter(Boolean).join(", ") : "None",
    },
    { label: "Add-on Price", value: addOns.length ? formatAmount(addOnsTotal, currency) : formatAmount(0, currency) },
    { label: "Total Paid", value: formatAmount(planPrice + addOnsTotal, currency) },
    { label: "Plan Status", value: getLifecycleStatus(listing, planExpiryDate) },
    { label: "Plan Start Date", value: formatDate(planStartDate) },
    { label: "Plan Expiry Date", value: formatDate(planExpiryDate) },
    { label: "Add-on Status", value: addOns.length ? getLifecycleStatus(listing, addOnDates.expiryDate) : "None" },
    { label: "Add-on Start Date", value: addOns.length ? formatDate(addOnDates.startDate) : "-" },
    { label: "Add-on Expiry Date", value: addOns.length ? formatDate(addOnDates.expiryDate) : "-" },
  ];

  return (
    <section className="rounded-[12px] border border-[#e5eaf1] bg-white p-5">
      <h2 className="text-[16px] font-black text-[#111827]">Plan & Add-ons</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase text-slate-400">{row.label}</p>
            <p className="mt-1 break-words text-sm font-bold text-slate-800">{row.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PlanAddOnsSection;
