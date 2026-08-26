export const GULF_COUNTRIES = [
  {
    name: "Bahrain",
    iso2: "BH",
    governorates: [
      { name: "Muharraq Governorate", cities: ["Muharraq Governorate"] },
      { name: "Capital Governorate", cities: ["Capital Governorate"] },
      { name: "Northern Governorate", cities: ["Northern Governorate"] },
      { name: "Southern Governorate", cities: ["Southern Governorate"] },
    ],
  },
  {
    name: "Saudi Arabia",
    iso2: "SA",
    governorates: [
      { name: "Riyadh", cities: ["Riyadh"] },
      { name: "Makkah", cities: ["Makkah"] },
      { name: "Madinah", cities: ["Madinah"] },
      { name: "Eastern Province", cities: ["Eastern Province"] },
      { name: "Al Qassim Region", cities: ["Al Qassim Region"] },
      { name: "Asir", cities: ["Asir"] },
      { name: "Tabuk", cities: ["Tabuk"] },
      { name: "Hail", cities: ["Hail"] },
      { name: "Jazan", cities: ["Jazan"] },
      { name: "Najran", cities: ["Najran"] },
      { name: "Al-Baha", cities: ["Al-Baha"] },
      { name: "Al-Jawf", cities: ["Al-Jawf"] },
      { name: "Northern Borders", cities: ["Northern Borders"] },
    ],
  },
  {
    name: "Kuwait",
    iso2: "KW",
    governorates: [
      { name: "Al Asimah", cities: ["Al Asimah"] },
      { name: "Hawalli", cities: ["Hawalli"] },
      { name: "Farwaniya", cities: ["Farwaniya"] },
      { name: "Ahmadi", cities: ["Ahmadi"] },
      { name: "Jahra", cities: ["Jahra"] },
      { name: "Mubarak Al-Kabeer", cities: ["Mubarak Al-Kabeer"] },
    ],
  },
  {
    name: "United Arab Emirates",
    iso2: "AE",
    governorates: [
      { name: "Abu Dhabi", cities: ["Abu Dhabi"] },
      { name: "Dubai", cities: ["Dubai"] },
      { name: "Sharjah", cities: ["Sharjah"] },
      { name: "Ajman", cities: ["Ajman"] },
      { name: "Umm Al Quwain", cities: ["Umm Al Quwain"] },
      { name: "Ras Al Khaimah", cities: ["Ras Al Khaimah"] },
      { name: "Fujairah", cities: ["Fujairah"] },
    ],
  },
  {
    name: "Oman",
    iso2: "OM",
    governorates: [
      { name: "Muscat", cities: ["Muscat"] },
      { name: "Dhofar", cities: ["Dhofar"] },
      { name: "Musandam", cities: ["Musandam"] },
      { name: "Al Buraimi", cities: ["Al Buraimi"] },
      { name: "Al Dakhiliyah", cities: ["Al Dakhiliyah"] },
      { name: "Al Dhahirah", cities: ["Al Dhahirah"] },
      { name: "North Al Batinah", cities: ["North Al Batinah"] },
      { name: "South Al Batinah", cities: ["South Al Batinah"] },
      { name: "North Al Sharqiyah", cities: ["North Al Sharqiyah"] },
      { name: "South Al Sharqiyah", cities: ["South Al Sharqiyah"] },
      { name: "Al Wusta", cities: ["Al Wusta"] },
    ],
  },
  {
    name: "Qatar",
    iso2: "QA",
    governorates: [
      { name: "Doha", cities: ["Doha"] },
      { name: "Al Rayyan", cities: ["Al Rayyan"] },
      { name: "Al Wakrah", cities: ["Al Wakrah"] },
      { name: "Al Khor", cities: ["Al Khor"] },
      { name: "Al Daayen", cities: ["Al Daayen"] },
      { name: "Umm Salal", cities: ["Umm Salal"] },
      { name: "Al Shamal", cities: ["Al Shamal"] },
      { name: "Al Shahaniya", cities: ["Al Shahaniya"] },
    ],
  },
];

export const GULF_COUNTRY_NAMES = GULF_COUNTRIES.map((country) => country.name);

export const getServiceCityNamesByCountry = (countryName) =>
  GULF_COUNTRIES.find((country) => country.name === countryName)?.governorates.map(
    (city) => city.name
  ) || [];

export const getNormalizedLocationCountry = (countryName) => {
  if (countryName === "UAE") return "United Arab Emirates";

  return GULF_COUNTRIES.find((country) => country.name === countryName)?.name || countryName || "";
};

export const getNormalizedLocationCity = (countryName, cityName, governorateName) => {
  const normalizedCountry = getNormalizedLocationCountry(countryName);
  const cityNames = getServiceCityNamesByCountry(normalizedCountry);

  if (cityNames.includes(cityName)) return cityName;
  if (cityNames.includes(governorateName)) return governorateName;

  return cityName || governorateName || "";
};

export const AREAS_BY_CITY = {
  Dubai: ["Deira", "Jumeirah", "Al Barsha", "Business Bay"],
  "Abu Dhabi": ["Al Reem Island", "Khalifa City", "Al Mushrif"],
  Riyadh: ["Al Olaya", "Al Malaz", "Diplomatic Quarter"],
  "Al Qassim Region": ["Al Qassim Region"],
  Doha: ["West Bay", "Al Sadd", "The Pearl"],
  "Kuwait City": ["Sharq", "Dasman", "Salmiya"],
};
