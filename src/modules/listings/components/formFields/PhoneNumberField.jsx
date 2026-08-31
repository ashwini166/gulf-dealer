import { ChevronDown, Globe2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PHONE_COUNTRIES = [
  { iso2: "BH", name: "Bahrain", dial: "+973" },
  { iso2: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso2: "AE", name: "United Arab Emirates", dial: "+971" },
  { iso2: "KW", name: "Kuwait", dial: "+965" },
  { iso2: "QA", name: "Qatar", dial: "+974" },
  { iso2: "OM", name: "Oman", dial: "+968" },
  { iso2: "IN", name: "India", dial: "+91" },
  { iso2: "PK", name: "Pakistan", dial: "+92" },
  { iso2: "BD", name: "Bangladesh", dial: "+880" },
  { iso2: "NP", name: "Nepal", dial: "+977" },
  { iso2: "PH", name: "Philippines", dial: "+63" },
  { iso2: "EG", name: "Egypt", dial: "+20" },
  { iso2: "JO", name: "Jordan", dial: "+962" },
  { iso2: "LB", name: "Lebanon", dial: "+961" },
  { iso2: "TR", name: "Turkey", dial: "+90" },
  { iso2: "GB", name: "United Kingdom", dial: "+44" },
  { iso2: "US", name: "United States", dial: "+1" },
  { iso2: "CA", name: "Canada", dial: "+1" },
  { iso2: "AU", name: "Australia", dial: "+61" },
  { iso2: "CUSTOM", name: "Custom country code", dial: "+" },
];

const normalizeDialCode = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 4);
  return digits ? `+${digits}` : "+";
};

const splitPhoneValue = (value) => {
  const rawValue = String(value || "").trim();
  const match = rawValue.match(/^(\+\d{1,4})\s*(.*)$/);
  const fallback = PHONE_COUNTRIES[0];

  if (!match) {
    return {
      countryIso: fallback.iso2,
      dialCode: fallback.dial,
      phone: rawValue.replace(/\D/g, "").slice(0, 15),
    };
  }

  const [, dialCode, phone] = match;
  const country = PHONE_COUNTRIES.find((item) => item.dial === dialCode) || PHONE_COUNTRIES[PHONE_COUNTRIES.length - 1];

  return {
    countryIso: country.iso2,
    dialCode,
    phone: phone.replace(/\D/g, "").slice(0, 15),
  };
};

const FlagMark = ({ country }) => {
  if (country.iso2 === "CUSTOM") {
    return (
      <span className="flex h-4 w-6 items-center justify-center rounded-sm bg-slate-100 ring-1 ring-slate-200">
        <Globe2 size={12} className="text-slate-500" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="h-4 w-6 shrink-0 rounded-sm bg-cover bg-center ring-1 ring-slate-200"
      style={{ backgroundImage: `url(https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png)` }}
    />
  );
};

const PhoneNumberField = ({
  value,
  onChange,
  error,
  placeholder = "7767754397",
  disabled = false,
  helperText = "",
}) => {
  const parsed = splitPhoneValue(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIso, setSelectedIso] = useState(parsed.countryIso);
  const wrapperRef = useRef(null);
  const selectedDialMatches = PHONE_COUNTRIES.some(
    (country) => country.iso2 === selectedIso && country.dial === parsed.dialCode
  );
  const effectiveSelectedIso = selectedDialMatches ? selectedIso : parsed.countryIso;
  const selectedCountry =
    PHONE_COUNTRIES.find((country) => country.iso2 === effectiveSelectedIso && country.dial === parsed.dialCode) ||
    PHONE_COUNTRIES.find((country) => country.dial === parsed.dialCode) ||
    PHONE_COUNTRIES[PHONE_COUNTRIES.length - 1];

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  const updateValue = (dialCode, phone) => {
    onChange(`${normalizeDialCode(dialCode)} ${String(phone || "").replace(/\D/g, "").slice(0, 15)}`.trim());
  };

  return (
    <div className="space-y-1.5">
      <div
        ref={wrapperRef}
        className={`relative flex h-10 overflow-visible rounded-lg border bg-white transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 ${
          disabled ? "bg-slate-100" : ""
        } ${error ? "border-red-400 ring-2 ring-red-400 ring-offset-1" : "border-slate-300"}`}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen((previous) => !previous)}
          className="flex w-[118px] shrink-0 items-center justify-between gap-2 border-r border-slate-200 bg-slate-50 px-2.5 text-left text-xs font-semibold text-slate-800 outline-none transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:w-[142px]"
        >
          <span className="flex min-w-0 items-center gap-2">
            <FlagMark country={selectedCountry} />
            <span className="shrink-0">{parsed.dialCode}</span>
          </span>
          <ChevronDown size={14} className="shrink-0 text-slate-400" />
        </button>

        <input
          type="tel"
          inputMode="numeric"
          value={parsed.phone}
          disabled={disabled}
          onChange={(event) => updateValue(parsed.dialCode, event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-r-lg px-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600"
        />

        {isOpen && !disabled && (
          <div className="absolute left-0 top-full z-50 mt-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <div className="max-h-64 overflow-y-auto py-1">
              {PHONE_COUNTRIES.map((country) => (
                <button
                  key={`${country.iso2}-${country.dial}`}
                  type="button"
                  onClick={() => {
                    setSelectedIso(country.iso2);
                    updateValue(country.dial, parsed.phone);
                    setIsOpen(country.iso2 === "CUSTOM");
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition hover:bg-blue-50 hover:text-blue-600 ${
                    country.iso2 === selectedCountry.iso2 && country.dial === selectedCountry.dial
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700"
                  }`}
                >
                  <FlagMark country={country} />
                  <span className="w-12 shrink-0 font-bold">{country.dial}</span>
                  <span className="min-w-0 flex-1 truncate">{country.name}</span>
                </button>
              ))}
            </div>
            {selectedCountry.iso2 === "CUSTOM" && (
              <div className="border-t border-slate-100 p-2">
                <input
                  type="tel"
                  value={parsed.dialCode}
                  onChange={(event) => updateValue(event.target.value, parsed.phone)}
                  placeholder="+999"
                  className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            )}
          </div>
        )}
      </div>
      {helperText && <p className="text-xs font-medium text-slate-500">{helperText}</p>}
    </div>
  );
};

export default PhoneNumberField;
