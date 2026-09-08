export const GULF_COUNTRIES = [
  {
    name: "Bahrain",
    iso2: "BH",
    governorates: [
      { name: "Capital Governorate", cities: ["Manama", "Juffair", "Adliya", "Hoora", "Gudaibiya", "Seef", "Sanabis", "Khamis", "Salmaniya", "Zinj", "Bilad Al Qadeem", "Sitra", "Nabih Saleh"] },
      { name: "Muharraq Governorate", cities: ["Muharraq", "Hidd", "Arad", "Busaiteen", "Galali", "Amwaj Islands", "Diyar Al Muharraq", "Dilmunia"] },
      { name: "Northern Governorate", cities: ["Hamad Town", "Budaiya", "Saar", "Janabiya", "Barbar", "Diraz", "Bani Jamra", "Jannusan", "Karbabad", "Shakhura", "Abu Saiba", "Maqaba", "Dumistan", "Karzakan", "Malkiya"] },
      { name: "Southern Governorate", cities: ["Riffa", "Isa Town", "A'ali", "Zallaq", "Awali", "Askar", "Jaw", "Safra"] },
    ],
  },
  {
    name: "Saudi Arabia",
    iso2: "SA",
    governorates: [
      { name: "Riyadh", cities: ["Riyadh", "Al Kharj", "Diriyah", "Dawadmi", "Al Majma'ah", "Al Quway'iyah", "Wadi Al Dawasir", "Al Aflaj", "Al Zulfi", "Shaqra", "Hotat Bani Tamim", "Afif", "Al Ghat", "Thadiq", "Huraymila", "Rumah", "Al Muzahimiyah", "Al Hariq", "Al Sulayyil"] },
      { name: "Makkah", cities: ["Makkah", "Jeddah", "Taif", "Rabigh", "Al Qunfudhah", "Al Lith", "Khulais", "Ranyah", "Turbah", "Al Jumum", "Al Khurmah", "Bahrah"] },
      { name: "Madinah", cities: ["Madinah", "Yanbu", "Al Ula", "Badr", "Khaybar", "Mahd Al Dhahab", "Al Hanakiyah"] },
      { name: "Eastern Province", cities: ["Dammam", "Khobar", "Dhahran", "Al Ahsa", "Hofuf", "Mubarraz", "Jubail", "Qatif", "Ras Tanura", "Abqaiq", "Khafji", "Nairyah", "Qaryat Al Ulya"] },
      { name: "Al Qassim", cities: ["Buraydah", "Unaizah", "Ar Rass", "Al Bukayriyah", "Al Badayea", "Al Mithnab", "Riyadh Al Khabra", "Uyun Al Jawa"] },
      { name: "Asir", cities: ["Abha", "Khamis Mushait", "Bisha", "Muhayil Asir", "Ahad Rafidah", "Sarat Abidah", "Al Namas", "Tanomah", "Dhahran Al Janub", "Tathlith"] },
      { name: "Tabuk", cities: ["Tabuk", "Duba", "Umluj", "Al Wajh", "Tayma", "Haql"] },
      { name: "Ha'il", cities: ["Ha'il", "Baqaa", "Al Ghazalah", "Ash Shinan", "Al Hait"] },
      { name: "Northern Borders", cities: ["Arar", "Rafha", "Turaif", "Al Uwayqilah"] },
      { name: "Jazan", cities: ["Jazan", "Sabya", "Abu Arish", "Samtah", "Baish", "Farasan", "Al Darb", "Al Aridhah"] },
      { name: "Najran", cities: ["Najran", "Sharurah", "Hubuna", "Badr Al Janub", "Yadamah"] },
      { name: "Al Bahah", cities: ["Al Bahah", "Baljurashi", "Al Mandaq", "Al Makhwah", "Qilwah"] },
      { name: "Al Jouf", cities: ["Sakaka", "Qurayyat", "Dumat Al Jandal", "Tabarjal"] },
    ],
  },
  {
    name: "United Arab Emirates",
    iso2: "AE",
    governorates: [
      { name: "Abu Dhabi", cities: ["Abu Dhabi", "Al Ain", "Madinat Zayed", "Ghayathi", "Al Dhannah", "Liwa", "Al Mirfa", "Sila", "Dalma"] },
      { name: "Dubai", cities: ["Dubai", "Jebel Ali", "Hatta", "Al Awir", "Al Khawaneej", "Lahbab", "Al Lisaili"] },
      { name: "Sharjah", cities: ["Sharjah", "Khor Fakkan", "Kalba", "Al Dhaid", "Dibba Al Hisn", "Al Madam", "Mleiha", "Al Bataeh"] },
      { name: "Ajman", cities: ["Ajman", "Masfout", "Al Manama"] },
      { name: "Umm Al Quwain", cities: ["Umm Al Quwain", "Falaj Al Mualla"] },
      { name: "Ras Al Khaimah", cities: ["Ras Al Khaimah", "Al Rams", "Al Jazirah Al Hamra", "Sha'am", "Ghalilah", "Khatt"] },
      { name: "Fujairah", cities: ["Fujairah", "Dibba Al Fujairah", "Al Badiyah", "Masafi", "Mirbah", "Qidfa", "Dadna"] },
    ],
  },
  {
    name: "Kuwait",
    iso2: "KW",
    governorates: [
      { name: "Al Asimah", cities: ["Kuwait City", "Dasman", "Sharq", "Mirqab", "Dasma", "Qadsiya", "Kaifan", "Shuwaikh", "Doha", "Sulaibikhat", "Jaber Al Ahmad"] },
      { name: "Hawalli", cities: ["Hawalli", "Salmiya", "Jabriya", "Bayan", "Mishref", "Rumaithiya", "Salwa", "Shaab", "Mubarak Al Abdullah"] },
      { name: "Farwaniya", cities: ["Farwaniya", "Khaitan", "Jleeb Al Shuyoukh", "Ardiya", "Andalus", "Riggae", "Ishbiliya", "Abdullah Al Mubarak", "Sabah Al Nasser"] },
      { name: "Ahmadi", cities: ["Ahmadi", "Fahaheel", "Mangaf", "Mahboula", "Abu Halifa", "Hadiya", "Riqqa", "Sabah Al Ahmad", "Wafra", "Khiran"] },
      { name: "Jahra", cities: ["Jahra", "Sulaibiya", "Saad Al Abdullah", "Qasr", "Naseem", "Taima", "Abdali"] },
      { name: "Mubarak Al Kabeer", cities: ["Mubarak Al Kabeer", "Sabah Al Salem", "Abu Al Hasaniya", "Abu Futaira", "Funaitees", "Messila", "Qurain", "Qusour"] },
    ],
  },
  {
    name: "Oman",
    iso2: "OM",
    governorates: [
      { name: "Muscat", cities: ["Muscat", "Muttrah", "Bawshar", "Seeb", "Al Amerat", "Qurayyat"] },
      { name: "Dhofar", cities: ["Salalah", "Taqah", "Mirbat", "Thumrait", "Sadah", "Rakhyut", "Dhalkut", "Al Mazyunah", "Muqshin", "Shalim"] },
      { name: "Musandam", cities: ["Khasab", "Bukha", "Dibba", "Madha"] },
      { name: "Al Buraimi", cities: ["Al Buraimi", "Mahdah", "Al Sunaynah"] },
      { name: "Al Dakhiliyah", cities: ["Nizwa", "Bahla", "Adam", "Al Hamra", "Bid Bid", "Izki", "Manah", "Samail"] },
      { name: "North Al Batinah", cities: ["Sohar", "Shinas", "Liwa", "Saham", "Al Khaburah", "Al Suwaiq"] },
      { name: "South Al Batinah", cities: ["Rustaq", "Al Awabi", "Nakhal", "Wadi Al Maawil", "Barka", "Al Musannah"] },
      { name: "North Al Sharqiyah", cities: ["Ibra", "Al Mudhaibi", "Bidiyah", "Al Qabil", "Wadi Bani Khalid", "Dima Wa Al Tayeen"] },
      { name: "South Al Sharqiyah", cities: ["Sur", "Jalan Bani Bu Ali", "Jalan Bani Bu Hassan", "Al Kamil Wa Al Wafi", "Masirah"] },
      { name: "Al Dhahirah", cities: ["Ibri", "Yanqul", "Dhank"] },
      { name: "Al Wusta", cities: ["Haima", "Duqm", "Mahout", "Al Jazir"] },
    ],
  },
  {
    name: "Qatar",
    iso2: "QA",
    governorates: [
      { name: "Doha", cities: ["Doha", "Al Bidda", "Old Airport", "Al Sadd", "Al Hilal", "Najma", "Umm Ghuwailina", "Madinat Khalifa"] },
      { name: "Al Rayyan", cities: ["Al Rayyan", "Abu Hamour", "Ain Khaled", "Al Aziziya", "Muaither", "Bani Hajer", "Abu Samra", "Al Wajbah"] },
      { name: "Al Wakrah", cities: ["Al Wakrah", "Al Wukair", "Mesaieed", "Birkat Al Awamer"] },
      { name: "Al Khor", cities: ["Al Khor", "Ras Laffan", "Al Thakhira"] },
      { name: "Al Daayen", cities: ["Lusail", "Umm Qarn", "Al Kheesa", "Rawdat Al Hamama"] },
      { name: "Umm Salal", cities: ["Umm Salal Ali", "Umm Salal Mohammed", "Umm Al Amad"] },
      { name: "Al Shamal", cities: ["Madinat Al Shamal", "Ruwais", "Abu Dhalouf", "Ain Sinan"] },
      { name: "Al Shahaniya", cities: ["Al Shahaniya", "Dukhan", "Umm Bab", "Al Jumailiyah"] },
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
  Manama: ["Adliya", "Juffair", "Seef", "Hoora"],
  Riffa: ["East Riffa", "West Riffa", "Riffa Views"],
  Dubai: ["Deira", "Jumeirah", "Al Barsha", "Business Bay"],
  "Abu Dhabi": ["Al Reem Island", "Khalifa City", "Al Mushrif"],
  Riyadh: ["Al Olaya", "Al Malaz", "Diplomatic Quarter"],
  Doha: ["West Bay", "Al Sadd", "The Pearl"],
  "Kuwait City": ["Sharq", "Dasman", "Salmiya"],
};
