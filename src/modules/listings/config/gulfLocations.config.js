export const GULF_COUNTRIES = [
  {
    name: "Bahrain",
    iso2: "BH",
    governorates: [
      { name: "Capital Governorate", cities: ["Manama", "Juffair", "Adliya", "Hoora", "Seef"] },
      { name: "Muharraq Governorate", cities: ["Muharraq", "Amwaj", "Hidd", "Busaiteen"] },
      { name: "Northern Governorate", cities: ["Budaiya", "Saar", "Barbar", "Diraz", "Hamad Town"] },
      { name: "Southern Governorate", cities: ["Riffa", "Isa Town", "Zallaq", "Awali", "Askar"] },
    ],
  },
  {
    name: "Saudi Arabia",
    iso2: "SA",
    governorates: [
      { name: "Riyadh", cities: ["Riyadh"] },
      { name: "Makkah", cities: ["Jeddah", "Makkah", "Taif"] },
      { name: "Madinah", cities: ["Madinah"] },
      { name: "Eastern Province", cities: ["Dammam", "Khobar", "Dhahran", "Al Ahsa", "Jubail"] },
      { name: "Al-Qassim", cities: ["Buraydah"] },
      { name: "Asir", cities: ["Abha"] },
      { name: "Tabuk", cities: ["Tabuk"] },
      { name: "Hail", cities: ["Hail"] },
      { name: "Jazan", cities: ["Jazan"] },
      { name: "Najran", cities: ["Najran"] },
      { name: "Al-Baha", cities: ["Al-Baha"] },
      { name: "Al-Jawf", cities: ["Sakaka"] },
      { name: "Northern Borders", cities: ["Arar"] },
    ],
  },
  {
    name: "United Arab Emirates",
    iso2: "AE",
    governorates: [
      { name: "Abu Dhabi", cities: ["Abu Dhabi", "Al Ain", "Madinat Zayed"] },
      { name: "Dubai", cities: ["Dubai"] },
      { name: "Sharjah", cities: ["Sharjah"] },
      { name: "Ajman", cities: ["Ajman"] },
      { name: "Umm Al Quwain", cities: ["Umm Al Quwain"] },
      { name: "Ras Al Khaimah", cities: ["Ras Al Khaimah"] },
      { name: "Fujairah", cities: ["Fujairah"] },
    ],
  },
  {
    name: "Kuwait",
    iso2: "KW",
    governorates: [
      { name: "Al Asimah", cities: ["Kuwait City", "Sharq", "Mirqab"] },
      { name: "Hawalli", cities: ["Hawalli", "Salmiya", "Jabriya"] },
      { name: "Farwaniya", cities: ["Farwaniya", "Khaitan", "Jleeb Al-Shuyoukh"] },
      { name: "Ahmadi", cities: ["Ahmadi", "Fahaheel", "Mangaf"] },
      { name: "Jahra", cities: ["Jahra"] },
      { name: "Mubarak Al-Kabeer", cities: ["Mubarak Al-Kabeer"] },
    ],
  },
  {
    name: "Oman",
    iso2: "OM",
    governorates: [
      { name: "Muscat", cities: ["Muscat", "Muttrah", "Seeb"] },
      { name: "Dhofar", cities: ["Salalah"] },
      { name: "Musandam", cities: ["Khasab"] },
      { name: "Al Buraimi", cities: ["Al Buraimi"] },
      { name: "Al Dakhiliyah", cities: ["Nizwa", "Bahla"] },
      { name: "Al Dhahirah", cities: ["Ibri"] },
      { name: "North Al Batinah", cities: ["Sohar", "Shinas"] },
      { name: "South Al Batinah", cities: ["Rustaq", "Barka"] },
      { name: "North Al Sharqiyah", cities: ["Ibra"] },
      { name: "South Al Sharqiyah", cities: ["Sur"] },
      { name: "Al Wusta", cities: ["Duqm"] },
    ],
  },
  {
    name: "Qatar",
    iso2: "QA",
    governorates: [
      { name: "Doha", cities: ["Doha"] },
      { name: "Al Rayyan", cities: ["Al Rayyan", "Education City"] },
      { name: "Al Wakrah", cities: ["Al Wakrah", "Mesaieed"] },
      { name: "Al Khor", cities: ["Al Khor"] },
      { name: "Al Daayen", cities: ["Al Daayen"] },
      { name: "Umm Salal", cities: ["Umm Salal"] },
      { name: "Al Shamal", cities: ["Al Shamal"] },
      { name: "Al Shahaniya", cities: ["Al Shahaniya"] },
    ],
  },
];

export const GULF_COUNTRY_NAMES = GULF_COUNTRIES.map((country) => country.name);

const COUNTRY_CURRENCY_MAP = {
  Bahrain: "BHD",
  BH: "BHD",
  "Saudi Arabia": "SAR",
  SA: "SAR",
  Kuwait: "KWD",
  KW: "KWD",
  "United Arab Emirates": "AED",
  UAE: "AED",
  AE: "AED",
  Oman: "OMR",
  OM: "OMR",
  Qatar: "QAR",
  QA: "QAR",
};

export const getServiceCountryCurrencyByName = (countryName) =>
  COUNTRY_CURRENCY_MAP[String(countryName || "").trim()] || "BHD";

export const getServiceCityNamesByCountry = (countryName) =>
  GULF_COUNTRIES.find((country) => country.name === countryName)?.governorates.flatMap(
    (governorate) => governorate.cities
  ) || [];

export const getNormalizedLocationCountry = (countryName) => {
  if (countryName === "UAE") return "United Arab Emirates";

  return GULF_COUNTRIES.find((country) => country.name === countryName)?.name || countryName || "";
};

export const getNormalizedLocationState = (countryName, stateName, cityName) => {
  const country = GULF_COUNTRIES.find((item) => item.name === getNormalizedLocationCountry(countryName));
  if (!country) return stateName || "";

  if (country.governorates.some((item) => item.name === stateName)) return stateName;

  return country.governorates.find((item) => item.cities.includes(cityName))?.name || stateName || "";
};

export const getNormalizedLocationCity = (countryName, cityName, stateName) => {
  const country = GULF_COUNTRIES.find((item) => item.name === getNormalizedLocationCountry(countryName));
  if (!country) return cityName || stateName || "";

  const validCities = country.governorates.flatMap((item) => item.cities);
  if (validCities.includes(cityName)) return cityName;

  const state = country.governorates.find((item) => item.name === stateName);
  return state?.cities[0] || cityName || "";
};

export const AREAS_BY_CITY = {
  Dubai: ["Deira", "Jumeirah", "Al Barsha", "Business Bay"],
  "Abu Dhabi": ["Al Reem Island", "Khalifa City", "Al Mushrif"],
  Riyadh: ["Al Olaya", "Al Malaz", "Diplomatic Quarter"],
  Doha: ["West Bay", "Al Sadd", "The Pearl"],
  "Kuwait City": ["Sharq", "Dasman", "Salmiya"],
};
