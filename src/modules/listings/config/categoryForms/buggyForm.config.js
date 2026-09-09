export const BUGGY_COLOR_SWATCHES = [
  "#ffffff", "#0f172a", "#64748b", "#94a3b8", "#1e3a8a",
  "#2563eb", "#0891b2", "#dc2626", "#7c2d12", "#16a34a",
  "#166534", "#ca8a04", "#facc15", "#ea580c", "#7c3aed",
];

const BUGGY_INTERIOR_COLOR_OPTIONS = [
  "Beige", "Black", "Blue", "Brown", "Burgundy", "Cream", "Grey",
  "Orange", "Red", "Tan", "White",
];

export const buggyFormConfig = {
  key: "BUGGY",
  label: "Buggies",

  vehicleInfoFields: [
    { name: "title", label: "Listing Title", type: "text", required: true, span: 2, placeholder: "e.g. 2023 Polaris RZR Pro XP Sand Buggy" },
    { name: "sellerName", label: "Seller Name", type: "text", required: true, placeholder: "e.g. Ahmed Al Rashid" },
    { name: "brand", label: "Brand", type: "brandSelect", required: true },
    { name: "catalogModel", label: "Model", type: "modelSelect", required: true },
    { name: "variantTrim", label: "Variant / Trim", type: "variantSelect" },
    { name: "manufacturingYear", label: "Manufacturing Year", type: "yearSelect", required: true },
    { name: "bodyType", label: "Vehicle Type", type: "select", required: true },
    { name: "mileage", label: "Odometer", type: "number", required: true, placeholder: "e.g. 3200" },
    { name: "mileageMetric", label: "Mileage Metric", type: "toggle2", options: [
      { value: "KM", label: "KM" },
      { value: "ENGINE_HOURS", label: "Engine Hours" },
    ] },
    { name: "exteriorColor", label: "Exterior Color", type: "colorSwatch", required: true, swatches: BUGGY_COLOR_SWATCHES, span: 2 },
    { name: "interiorColor", label: "Interior Color", type: "colorSwatch", swatches: BUGGY_INTERIOR_COLOR_OPTIONS },
    { name: "vinNumber", label: "VIN / Chassis Number", type: "vin", span: 2 },
    { name: "registrationCountry", label: "Registration Country", type: "countrySelect", required: true },
    { name: "registrationExpiry", label: "Registration Expiry", type: "date" },
    { name: "mobileNumber", label: "Mobile Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappNumber", label: "WhatsApp Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappAvailable", label: "WhatsApp available on mobile number", type: "toggleSwitch", fullWidth: true, description: "Turn on to use the same mobile number for WhatsApp." },
    { name: "contactEmail", label: "Contact Email Address", type: "email", required: true, placeholder: "e.g. seller@example.com" },
    { name: "description", label: "Description", type: "textarea", required: true, span: 2, placeholder: "Describe the buggy's condition, usage history, and standout features..." },
  ],

  engineSectionTitle: "Technical Specifications",
  specsFields: [
    { name: "engineCapacity", label: "Engine Capacity (CC)", type: "text", placeholder: "e.g. 925" },
    { name: "engineType", label: "Engine Type", type: "select", options: ["2-Stroke", "4-Stroke", "Electric"] },
    { name: "horsepower", label: "Horsepower (HP)", type: "number", placeholder: "e.g. 181" },
    { name: "topSpeed", label: "Top Speed (km/h)", type: "text", placeholder: "e.g. 120" },
    { name: "transmission", label: "Transmission", type: "select", required: true, options: ["Automatic", "CVT", "Manual", "Semi-Automatic"] },
    { name: "driveType", label: "Drive Type", type: "select", options: ["2WD", "4WD", "AWD", "Selectable 2WD / 4WD"] },
    { name: "fuelType", label: "Fuel Type", type: "select", required: true, options: ["Diesel", "Electric", "Hybrid", "Petrol"] },
    { name: "fuelTankCapacity", label: "Fuel Tank Capacity", type: "text", placeholder: "e.g. 40 L" },
    { name: "groundClearance", label: "Ground Clearance", type: "text", placeholder: "e.g. 355 mm" },
    { name: "weight", label: "Weight (kg)", type: "number", placeholder: "e.g. 725" },
    { name: "seatingCapacity", label: "Seating Capacity", type: "select", required: true, options: ["1 Seater", "2 Seater", "3 Seater", "4 Seater", "5 Seater", "6 Seater"] },
    { name: "insuranceValid", label: "Insurance Covered", type: "toggleSwitch", fullWidth: true },
  ],

  featureGroups: [
    { key: "features", label: "Features", options: ["12V Power Outlet", "Adjustable Steering Wheel", "Alloy Wheels", "Bluetooth", "Cargo Bed", "Cup Holders", "Digital Display", "Differential Lock", "Door Nets", "Electric Power Steering (EPS)", "Foldable Windshield", "Front Winch", "GPS Navigation", "Half Doors", "Hard Roof", "Hard Doors", "Heated Seats", "LED Headlights", "Mud Guards", "Passenger Grab Handles", "Rear Cargo Rack", "Rear View Mirror", "Reverse Camera", "Roof Rack", "Roll Cage", "Seat Belts", "Skid Plates", "Soft Doors", "Soft Roof", "Sound System", "Spare Wheel", "Speed Limiter", "Sport Mode", "Storage Box", "Tow Hitch", "USB Charging Port", "Windshield"] },
  ],

  hasAreaField: true,
};
