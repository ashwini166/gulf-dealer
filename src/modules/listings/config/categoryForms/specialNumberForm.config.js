export const specialNumberFormConfig = {
  key: "SPECIAL_NUMBER",
  label: "Special Number",

  // No Sale/Rent/Condition toggle needed — Step 2 handles
  // Sale/Auction directly for this category, and the admin form
  // reads these two flags to skip condition entirely.
  hasCondition: false,
  defaultListingType: "SALE",

  vehicleInfoFields: [
    { name: "title", label: "Listing Title", type: "text", required: true, span: 2, placeholder: "e.g. VIP Plate 5-Digit Bahrain Classic" },
    { name: "sellerName", label: "Seller Name", type: "text", required: true, placeholder: "e.g. Ahmed Al Rashid" },
    { name: "registrationCountry", label: "Registration Country", type: "countrySelect", required: true },
    { name: "plateNumber", label: "Plate Number", type: "text", required: true, placeholder: "e.g. 99999" },
    { name: "plateType", label: "Plate Type", type: "select", required: true, options: ["Standard Plate", "Private Plate", "Commercial Plate", "Motorcycle Plate", "Classic / Vintage Plate", "Government Plate", "Diplomatic Plate", "Taxi Plate", "Trailer Plate", "Temporary Plate"] },
    { name: "plateCategory", label: "Plate Category", type: "select", required: true, options: ["Regular", "Premium", "VIP", "Exclusive", "Special Edition"] },
    { name: "platePrefix", label: "Plate Prefix / Code", type: "text", placeholder: "e.g. A, B, AA" },
    { name: "numberPattern", label: "Number Pattern", type: "select", required: true, options: ["Sequential", "Repeated Digits", "Mirror Number", "Palindrome", "Lucky Number", "Round Number", "Ascending", "Descending", "Mixed Pattern", "Custom Pattern"] },
    { name: "numberOfDigits", label: "Number of Digits", type: "select", required: true, options: ["1 Digit", "2 Digits", "3 Digits", "4 Digits", "5 Digits", "6 Digits", "7 Digits", "8 Digits", "9+ Digits"] },
    { name: "mobileNumber", label: "Mobile Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappNumber", label: "WhatsApp Number", type: "phone", required: true, placeholder: "7767754397" },
    { name: "whatsappAvailable", label: "WhatsApp available on mobile number", type: "toggleSwitch", fullWidth: true, description: "Turn on to use the same mobile number for WhatsApp." },
    { name: "contactEmail", label: "Email Address", type: "email", required: true, placeholder: "seller@example.com" },
    { name: "description", label: "Description", type: "textarea", required: true, span: 2, placeholder: "Provide an accurate highlight of this premium plate combination..." },
  ],

  // Special Number has no engine/mechanical specs at all — this
  // stays empty on purpose so Step 5 / the admin "Specifications"
  // section renders nothing, which is correct for this category.
  specsFields: [],

  featureGroups: [
    { key: "features", label: "Features", options: ["Easy to Remember", "Exclusive Number", "Highly Sought After", "Mirror Number", "Premium Number", "Rare Number", "Repeated Digits", "Reserved Number", "Sequential Number", "Single Digit", "Special Number", "Unique Number", "VIP Number"] },
  ],

  hasAreaField: true,
};
