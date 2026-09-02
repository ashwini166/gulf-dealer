const categoryPatterns = [
  { pattern: /caravan|carvaan/i, subscriptionCategory: "HEAVY_EQUIPMENT" },
  { pattern: /heavy|equipment/i, subscriptionCategory: "HEAVY_EQUIPMENT" },
  { pattern: /commercial/i, subscriptionCategory: "COMMERCIAL_VEHICLES" },
  { pattern: /car|motercycle|motorcycle|special number|number plate|buggy|showroom|dealer/i, subscriptionCategory: "CARS_BIKES" },
];

export const mapCatalogCategoryToSubscriptionCategory = (categoryName = "") => {
  const match = categoryPatterns.find((item) => item.pattern.test(categoryName));
  return match?.subscriptionCategory || "CARS_BIKES";
};
