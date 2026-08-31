export const LISTING_TABS = [
  {
    key: "all",
    label: "All",
    status: undefined,
  },
  {
    key: "active",
    label: "Active",
    status: "PUBLISHED",
  },
  {
    key: "pending",
    label: "Pending",
    status: "PENDING_REVIEW",
  },
  {
    key: "rejected",
    label: "Rejected",
    status: "REJECTED",
  },
  {
    key: "sold",
    label: "Sold",
    status: "SOLD",
  },
];

export const formatPrice = (price, currency = "BHD") =>
  `${currency} ${Number(price || 0).toLocaleString()}`;

export const getDaysColorClass = (daysRemaining) => {
  if (daysRemaining === undefined || daysRemaining === null) return "text-slate-600";
  return daysRemaining < 10 ? "text-red-600" : "text-green-600";
};
