export const CARAVAN_COLOR_SWATCHES = [
  "#ffffff", "#0f172a", "#64748b", "#94a3b8", "#1e3a8a",
  "#2563eb", "#0891b2", "#dc2626", "#7c2d12", "#16a34a",
  "#166534", "#ca8a04", "#facc15", "#ea580c", "#7c3aed",
];

const CARAVAN_TYPES = [
  "Camper Trailer",
  "Expandable Caravan",
  "Fifth Wheel",
  "Off-Road Caravan",
  "Pop-Top Caravan",
  "Teardrop Trailer",
  "Toy Hauler",
  "Travel Trailer",
];

export const caravanFormConfig = {
  key: "CARAVAN",
  label: "Caravan",

  vehicleInfoFields: [
    { name: "title", label: "Listing Title", type: "text", required: true, span: 2, placeholder: "e.g. 2022 Bailey Phoenix 640 Touring Caravan" },
    { name: "brand", label: "Brand", type: "brandSelect", required: true },
    { name: "catalogModel", label: "Model", type: "modelSelect", required: true },
    { name: "variantTrim", label: "Variant / Trim", type: "variantSelect" },
    { name: "manufacturingYear", label: "Manufacturing Year", type: "yearSelect", required: true },
    { name: "bodyType", label: "Caravan Type", type: "select", options: CARAVAN_TYPES },
    { name: "mileage", label: "Mileage", type: "number", placeholder: "e.g. 15000" },
    { name: "exteriorColor", label: "Exterior Color", type: "colorSwatch", swatches: CARAVAN_COLOR_SWATCHES, span: 2 },
    { name: "vinNumber", label: "VIN / Chassis Number", type: "vin", span: 2 },
    { name: "googleMapLink", label: "Google Map Location Link", type: "url", span: 2 },
    { name: "contactEmail", label: "Contact Email Address", type: "email" },
    { name: "description", label: "Description", type: "textarea", span: 2, placeholder: "Describe the caravan's condition, layout, and standout features..." },
  ],

  engineSectionTitle: "Technical Specifications",
  specsFields: [
    { name: "length", label: "Length (m)", type: "text" },
    { name: "width", label: "Width (m)", type: "text" },
    { name: "height", label: "Height (m)", type: "text" },
    { name: "weight", label: "Unladen Weight (kg)", type: "number" },
    { name: "sleepingCapacity", label: "Sleeping Capacity", type: "select", options: ["1", "2", "3", "4", "5", "6", "7", "8+"] },
    { name: "berths", label: "Number of Berths", type: "select", options: ["1", "2", "3", "4", "5", "6"] },
    { name: "axleType", label: "Axle Type", type: "select", options: ["Single Axle", "Twin Axle", "Tandem Axle"] },
    { name: "towWeight", label: "Tow Weight (kg)", type: "number" },
  ],

  featureGroups: [
    {
      key: "interior",
      label: "Interior Features",
      options: ["Fixed Bed", "Bunk Beds", "Dinette Conversion", "Wardrobe Storage", "Carpet Flooring", "LED Interior Lighting"],
    },
    {
      key: "kitchen",
      label: "Kitchen Features",
      options: ["Gas Hob", "Oven", "Microwave", "Fridge/Freezer", "Sink", "Water Heater"],
    },
    {
      key: "bathroom",
      label: "Bathroom Features",
      options: ["Toilet", "Shower", "Wash Basin", "Water Tank"],
    },
    {
      key: "comfort",
      label: "Comfort & Climate",
      options: ["Solar Panel", "Air Conditioning", "Heating System", "Awning", "TV / Entertainment System"],
    },
    {
      key: "exterior",
      label: "Exterior Features",
      options: ["Bike Rack", "Roof Rack", "Towbar Included", "Spare Wheel", "Outdoor Storage Locker"],
    },
    {
      key: "safety",
      label: "Safety Features",
      options: ["Smoke Alarm", "Gas Detector", "Fire Extinguisher", "Breakaway Cable", "Wheel Clamp"],
    },
  ],

  hasSecondaryGallery: true,
  secondaryGalleryLabel: "Interior Tour Images",
  hasAreaField: true,
};
