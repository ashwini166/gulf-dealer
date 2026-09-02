export const CARAVAN_COLOR_SWATCHES = [
  "#ffffff", "#0f172a", "#64748b", "#94a3b8", "#1e3a8a",
  "#2563eb", "#0891b2", "#dc2626", "#7c2d12", "#16a34a",
  "#166534", "#ca8a04", "#facc15", "#ea580c", "#7c3aed",
];

const CARAVAN_INTERIOR_COLOR_OPTIONS = [
  "Beige", "Black", "Blue", "Brown", "Charcoal", "Cream", "Dark Brown",
  "Dark Grey", "Grey", "Ivory", "Light Brown", "Light Grey", "Oak",
  "Off White", "Tan", "Walnut", "White", "Wood Finish",
];

export const caravanFormConfig = {
  key: "CARAVAN",
  label: "Caravan",

  vehicleInfoFields: [
    { name: "title", label: "Listing Title", type: "text", required: true, span: 2, placeholder: "e.g. 2022 Bailey Phoenix 640 Touring Caravan" },
    { name: "sellerName", label: "Seller Name", type: "text", required: true, placeholder: "e.g. Ahmed Al Rashid" },
    { name: "brand", label: "Brand", type: "brandSelect", required: true },
    { name: "catalogModel", label: "Model", type: "modelSelect", required: true },
    { name: "variantTrim", label: "Variant / Trim", type: "variantSelect" },
    { name: "manufacturingYear", label: "Manufacturing Year", type: "yearSelect", required: true },
    { name: "bodyType", label: "Caravan Type", type: "select", required: true },
    { name: "exteriorColor", label: "Exterior Colour", type: "colorSwatch", required: true, swatches: CARAVAN_COLOR_SWATCHES, span: 2 },
    { name: "interiorColor", label: "Interior Colour", type: "colorSwatch", swatches: CARAVAN_INTERIOR_COLOR_OPTIONS },
    { name: "vinNumber", label: "VIN / Chassis Number", type: "vin", span: 2 },
    { name: "registrationCountry", label: "Registration Country", type: "countrySelect", required: true },
    { name: "registrationExpiry", label: "Registration Expiry", type: "date" },
    { name: "mobileNumber", label: "Mobile Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappNumber", label: "WhatsApp Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappAvailable", label: "WhatsApp available on mobile number", type: "toggleSwitch", fullWidth: true, description: "Turn on to use the same mobile number for WhatsApp." },
    { name: "contactEmail", label: "Contact Email Address", type: "email", required: true, placeholder: "e.g. seller@example.com" },
    { name: "description", label: "Description", type: "textarea", required: true, span: 2, placeholder: "Describe the caravan's condition, layout, and standout features..." },
  ],

  engineSectionTitle: "Technical Specifications",
  specsFields: [
    { name: "sleepingCapacity", label: "Sleeping Capacity", type: "select", required: true, options: ["1 Berth", "2 Berth", "3 Berth", "4 Berth", "5 Berth", "6 Berth", "7 Berth", "8 Berth", "9 Berth", "10+ Berth"] },
    { name: "seatingCapacity", label: "Seating Capacity", type: "select", options: ["2 Seater", "3 Seater", "4 Seater", "5 Seater", "6 Seater", "7 Seater", "8 Seater", "9 Seater", "10+ Seater"] },
    { name: "length", label: "Length", type: "text", placeholder: "Feet / Meters" },
    { name: "width", label: "Width", type: "text", placeholder: "Feet / Meters" },
    { name: "height", label: "Height", type: "text", placeholder: "Feet / Meters" },
    { name: "grossWeight", label: "Gross Weight", type: "number", placeholder: "Kilograms" },
    { name: "freshWaterTank", label: "Fresh Water Tank", type: "number", placeholder: "Litres" },
    { name: "greyWaterTank", label: "Grey Water Tank", type: "number", placeholder: "Litres" },
    { name: "blackWaterTank", label: "Black Water Tank", type: "number", placeholder: "Litres" },
    { name: "numberOfAxles", label: "Number of Axles", type: "select", options: ["1", "2", "3"] },
    { name: "slideOuts", label: "Slide-Outs", type: "select", options: ["0", "1", "2", "3", "4"] },
  ],

  featureGroups: [
    {
      key: "features",
      label: "Features",
      options: ["Air Conditioner", "Awning", "Bathroom", "Battery Charger", "Bluetooth Audio", "Cassette Toilet", "Central Locking", "Dining Table", "Double Bed", "Electric Brakes", "Electric Stabilizer", "External BBQ Point", "External Shower", "External Storage", "Fire Extinguisher", "Fly Screens", "Fresh Water Tank", "Gas Cooker", "Gas Oven", "Generator Ready", "Grey Water Tank", "Heating System", "Hot Water System", "Kitchen Sink", "LED Interior Lights", "Microwave", "Mosquito Screens", "Outdoor Lighting", "Power Awning", "Refrigerator", "Roof Hatch", "Satellite Ready", "Shower", "Solar Panels", "Spare Wheel", "Stabilizer Legs", "Stereo System", "TV", "TV Antenna", "USB Charging Ports", "Wardrobe", "Waste Water Tank", "Water Heater", "Wi-Fi Ready", "Window Blinds"],
    },
  ],

  hasSecondaryGallery: true,
  secondaryGalleryLabel: "Interior Tour Images",
  hasAreaField: true,
};
