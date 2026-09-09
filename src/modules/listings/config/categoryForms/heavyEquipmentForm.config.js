export const HEAVY_EQUIPMENT_COLOR_SWATCHES = [
  "#ffffff", "#0f172a", "#64748b", "#94a3b8", "#1e3a8a",
  "#2563eb", "#0891b2", "#dc2626", "#7c2d12", "#16a34a",
  "#166534", "#ca8a04", "#facc15", "#ea580c", "#7c3aed",
];

export const heavyEquipmentFormConfig = {
  key: "HEAVY_EQUIPMENT",
  label: "Heavy Equipment",

  vehicleInfoFields: [
    { name: "title", label: "Equipment Title", type: "text", required: true, span: 2, placeholder: "e.g. Caterpillar 320D Excavator, Bahrain" },
    { name: "brand", label: "Brand", type: "brandSelect", required: true },
    { name: "catalogModel", label: "Model", type: "modelSelect", required: true },
    { name: "variantTrim", label: "Variant / Trim", type: "variantSelect" },
    { name: "equipmentType", label: "Equipment Type", type: "select", required: true },
    { name: "manufacturingYear", label: "Year", type: "yearSelect", required: true },
    { name: "sellerName", label: "Seller Name", type: "text", required: true, placeholder: "e.g. Gulf Heavy Equipment" },
    { name: "operatingHours", label: "Operating Hours", type: "number", required: true, placeholder: "e.g. 4500" },
    { name: "exteriorColor", label: "Exterior Color", type: "colorSwatch", swatches: HEAVY_EQUIPMENT_COLOR_SWATCHES, span: 2 },
    { name: "vinNumber", label: "VIN / Chassis Number", type: "vin", span: 2 },
    { name: "registrationCountry", label: "Registration Country", type: "countrySelect", required: true },
    { name: "mobileNumber", label: "Mobile Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappNumber", label: "WhatsApp Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappAvailable", label: "WhatsApp available on mobile number", type: "toggleSwitch", fullWidth: true, description: "Turn on to use the same mobile number for WhatsApp." },
    { name: "contactEmail", label: "Contact Email Address", type: "email", required: true, placeholder: "e.g. seller@example.com" },
    { name: "description", label: "Description", type: "textarea", required: true, span: 2, placeholder: "Describe the equipment's condition, usage history, and standout features (max 2000 characters)..." },
  ],

  engineSectionTitle: "Engine & Performance",
  engineSectionDescription: "Add technical details specific to the equipment type.",
  specsFields: [
    { name: "engineCapacity", label: "Engine Capacity (CC)", type: "number", placeholder: "e.g. 6600" },
    { name: "enginePowerHp", label: "Engine Power (HP)", type: "number", placeholder: "e.g. 148" },
    { name: "fuelType", label: "Fuel Type", type: "select", required: true, options: ["Diesel", "Electric", "Hybrid", "Petrol"] },
    { name: "transmission", label: "Transmission", type: "select", options: ["Manual", "Automatic", "Hydrostatic", "Powershift"] },
    { name: "driveType", label: "Drive Type", type: "select", options: ["2WD", "4WD", "Tracked", "Wheeled"] },
    { name: "emissionStandard", label: "Emission Standard", type: "select", options: ["Tier 3", "Tier 4", "Tier 5", "Stage V"] },
    { name: "operatingWeight", label: "Operating Weight (kg)", type: "number", placeholder: "e.g. 20300" },
    { name: "payloadCapacity", label: "Payload Capacity (kg)", type: "number", placeholder: "e.g. 1500" },
    { name: "bucketCapacity", label: "Bucket Capacity (m³)", type: "number", placeholder: "e.g. 1.2" },
    { name: "liftCapacity", label: "Lift Capacity (kg)", type: "number", placeholder: "e.g. 3000" },
    { name: "boomLength", label: "Boom Length (m)", type: "number", placeholder: "e.g. 5.7" },
    { name: "maxReach", label: "Reach (m)", type: "number", placeholder: "e.g. 9.5" },
    { name: "maxDiggingDepth", label: "Maximum Digging Depth (m)", type: "number", placeholder: "e.g. 6.5" },
    { name: "maxLiftingHeight", label: "Maximum Lifting Height (m)", type: "number", placeholder: "e.g. 4.2" },
    { name: "numberOfOwners", label: "Number of Owners", type: "select", options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"] },
    { name: "serviceHistory", label: "Service History", type: "select", options: ["Full", "Partial", "None"] },
    { name: "hasWarrantyAvailable", label: "Warranty Available", type: "toggleSwitch", fullWidth: true },
    { name: "insuranceValid", label: "Insurance Covered", type: "toggleSwitch", fullWidth: true },
  ],

  featureGroups: [
    { key: "features", label: "Features", options: ["360 Camera", "Air Conditioning", "Air Suspension Seat", "Auto Greasing System", "Automatic Transmission", "Auxiliary Hydraulics", "Backup Alarm", "Backup Camera", "Bluetooth", "Boom Suspension", "Cabin Heater", "Climate Control", "Cruise Control", "Digital Display", "Differential Lock", "Emergency Stop", "Engine Pre-Heater", "Fire Suppression System", "FOPS Certified Cabin", "GPS Tracking", "Grade Control System", "Hammer Piping", "Hydraulic Coupler", "Hydraulic Quick Hitch", "Joystick Controls", "Keyless Start", "LED Work Lights", "Load Moment Indicator (LMI)", "Load Monitoring System", "Noise Insulated Cabin", "Object Detection System", "Operator Presence System", "Power Steering", "Rear View Camera", "Reversing Camera", "ROPS Certified Cabin", "Rotating Beacon", "Seat Belt Indicator", "Suspension Seat", "Telematics", "Tilt Rotator Ready", "Touchscreen Display", "Travel Alarm", "Two-Speed Travel", "USB Charging Port", "Work Lights"] },
  ],
};
