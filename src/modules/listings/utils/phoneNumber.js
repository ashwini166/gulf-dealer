export const normalizePhoneContact = (value) => {
  const rawValue = String(value || "").trim();
  const match = rawValue.match(/^(\+\d{1,4})\s*(\d{0,15})$/);

  if (!match) return rawValue;

  return `${match[1]} ${match[2]}`.trim();
};

const PHONE_LENGTH_RULES = {
  "+973": { exact: 8 },
  "+966": { exact: 9 },
  "+971": { exact: 9 },
  "+965": { exact: 8 },
  "+974": { exact: 8 },
  "+968": { exact: 8 },
  "+91": { exact: 10 },
  "+92": { exact: 10 },
  "+880": { exact: 10 },
  "+977": { exact: 10 },
  "+63": { exact: 10 },
  "+20": { exact: 10 },
  "+962": { exact: 9 },
  "+961": { min: 7, max: 8 },
  "+90": { exact: 10 },
  "+44": { exact: 10 },
  "+1": { exact: 10 },
  "+61": { exact: 9 },
};

export const validatePhoneContact = (value, label = "Phone number") => {
  const rawValue = normalizePhoneContact(value);
  const match = rawValue.match(/^(\+\d{1,4})\s+(\d+)$/);

  if (!rawValue) return `${label} is required`;
  if (!match) {
    return `${label} must include a country code and 6 to 15 digits`;
  }

  const [, dialCode, phone] = match;
  const rule = PHONE_LENGTH_RULES[dialCode];

  if (!rule && (phone.length < 6 || phone.length > 15)) {
    return `${label} must include 6 to 15 digits for ${dialCode}`;
  }

  if (rule?.exact && phone.length !== rule.exact) {
    return `${label} must be ${rule.exact} digits for ${dialCode}`;
  }

  if (rule?.min && (phone.length < rule.min || phone.length > rule.max)) {
    return `${label} must be ${rule.min} to ${rule.max} digits for ${dialCode}`;
  }

  return "";
};
