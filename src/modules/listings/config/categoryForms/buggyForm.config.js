export const BUGGY_COLOR_SWATCHES = [
  "#ffffff", "#0f172a", "#64748b", "#94a3b8", "#1e3a8a",
  "#2563eb", "#0891b2", "#dc2626", "#7c2d12", "#16a34a",
  "#166534", "#ca8a04", "#facc15", "#ea580c", "#7c3aed",
];

const BUGGY_TYPES = [
  "All-Terrain Vehicle (ATV)",
  "Amphibious Buggy",
  "Beach Buggy",
  "Dune Buggy",
  "Go-Kart",
  "Golf Buggy",
  "Off-Road Buggy",
  "Recreational Buggy",
  "Side-by-Side (SxS)",
  "Sport UTV",
  "Utility Task Vehicle (UTV)",
  "Youth ATV",
];

export const buggyFormConfig = {
  key: "BUGGY",
  label: "Buggy",

  vehicleInfoFields: [
    { name: "title", label: "Listing Title", type: "text", required: true, span: 2, placeholder: "e.g. 2023 Polaris RZR Pro XP Sand Buggy" },
    { name: "brand", label: "Brand", type: "brandSelect", required: true },
    { name: "catalogModel", label: "Model", type: "modelSelect", required: true },
    { name: "variantTrim", label: "Variant / Trim", type: "variantSelect" },
    { name: "manufacturingYear", label: "Manufacturing Year", type: "yearSelect", required: true },
    { name: "bodyType", label: "Body Type", type: "select", options: BUGGY_TYPES },
    { name: "mileage", label: "Mileage", type: "number", placeholder: "e.g. 3200" },
    { name: "mileageMetric", label: "Mileage Metric", type: "toggle2", options: [
      { value: "KM", label: "KM" },
      { value: "ENGINE_HOURS", label: "Engine Hours" },
    ] },
    { name: "exteriorColor", label: "Exterior Color", type: "colorSwatch", swatches: BUGGY_COLOR_SWATCHES, span: 2 },
    { name: "vinNumber", label: "VIN / Chassis Number", type: "vin", span: 2 },
    { name: "googleMapLink", label: "Google Map Location Link", type: "url", span: 2 },
    { name: "contactEmail", label: "Contact Email Address", type: "email" },
    { name: "description", label: "Description", type: "textarea", span: 2, placeholder: "Describe the buggy's condition, usage history, and standout features..." },
  ],

  engineSectionTitle: "Technical Specifications",
  specsFields: [
    { name: "engineCapacity", label: "Engine Capacity (CC)", type: "text" },
    { name: "engineType", label: "Engine Type", type: "select", options: ["2-Stroke", "4-Stroke", "Electric"] },
    { name: "horsepower", label: "Horsepower (HP)", type: "number" },
    { name: "topSpeed", label: "Top Speed (km/h)", type: "text" },
    { name: "transmission", label: "Transmission", type: "select", options: ["Automatic", "Manual", "CVT"] },
    { name: "driveType", label: "Drive Type", type: "select", options: ["2WD", "4WD", "AWD"] },
    { name: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "Electric"] },
    { name: "fuelTankCapacity", label: "Fuel Tank Capacity", type: "text" },
    { name: "groundClearance", label: "Ground Clearance", type: "text" },
    { name: "weight", label: "Weight (kg)", type: "number" },
    { name: "seatingCapacity", label: "Seating Capacity", type: "select", options: ["1", "2", "3", "4"] },
  ],

  featureGroups: [
    { key: "safety", label: "Safety Features", options: ["Roll Cage", "Seat Belts", "Fire Extinguisher", "Racing Harness", "Helmet Storage", "Anti-Roll Bar"] },
    { key: "comfort", label: "Comfort Features", options: ["Bucket Seats", "Adjustable Seats", "Cup Holders", "Storage Compartment", "Bluetooth Speaker"] },
    { key: "performance", label: "Performance Features", options: ["Turbo Charged", "Nitrous System", "Adjustable Suspension", "Sport Exhaust", "Off-Road Tires"] },
    { key: "exterior", label: "Exterior Features", options: ["LED Light Bar", "Winch", "Roof Rack", "Mud Flaps", "Skid Plates", "Custom Decals"] },
  ],

  hasAreaField: true,
};
