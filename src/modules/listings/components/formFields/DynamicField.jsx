import { useEffect, useState } from "react";
import ColorSwatchField from "./ColorSwatchField";
import PhoneNumberField from "./PhoneNumberField";
import ToggleGroupField from "./ToggleGroupField";
import ToggleSwitchField from "../ToggleSwitchField";
import {
  getBrandOptionsApi,
  getCatalogModelOptionsApi,
  getFacetOptionOptionsApi,
  getVariantOptionsApi,
} from "../../api/catalogApi";
import { GULF_COUNTRY_NAMES } from "../../config/gulfLocations.config";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

const baseInputClass =
  "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const dynamicFacetFields = new Set([
  "bodyType",
  "equipmentType",
  "bikeCategory",
  "bikeType",
]);
const getTextareaLimit = (field) =>
  field.maxLength || (field.name === "description" ? 2000 : undefined);
const getCounterClass = (currentLength, maxLength) => {
  if (!maxLength) return "text-slate-400";
  if (currentLength >= maxLength) return "text-red-600";
  if (currentLength >= maxLength * 0.9) return "text-amber-600";
  return "text-slate-400";
};

const DynamicField = ({ field, value, onChange, error, form, categoryId }) => {
  const errorClass = error ? "border-red-400 ring-2 ring-red-400 ring-offset-1" : "border-slate-300";

  const [brandOptions, setBrandOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const [variantOptions, setVariantOptions] = useState([]);
  const [facetOptions, setFacetOptions] = useState([]);

  const shouldLoadFacetOptions =
    field.type === "select" && dynamicFacetFields.has(field.name);

  useEffect(() => {
    if (field.type !== "brandSelect" || !categoryId) return;
    getBrandOptionsApi({ category: categoryId, status: "ACTIVE" })
      .then((data) => setBrandOptions(data || []))
      .catch(() => setBrandOptions([]));
  }, [field.type, categoryId]);

  useEffect(() => {
    if (field.type !== "modelSelect" || !categoryId || !form?.brand) {
      return;
    }
    getCatalogModelOptionsApi({ category: categoryId, brand: form.brand, status: "ACTIVE" })
      .then((data) => setModelOptions(data || []))
      .catch(() => setModelOptions([]));
  }, [field.type, categoryId, form?.brand]);

  useEffect(() => {
    if (field.type !== "variantSelect" || !categoryId || !form?.brand || !form?.catalogModel) {
      return;
    }

    let isMounted = true;

    getVariantOptionsApi({
      category: categoryId,
      brand: form.brand,
      catalogModel: form.catalogModel,
      status: "ACTIVE",
    })
      .then((data) => {
        if (isMounted) setVariantOptions(data || []);
      })
      .catch(() => {
        if (isMounted) setVariantOptions([]);
      });

    return () => {
      isMounted = false;
    };
  }, [field.type, categoryId, form?.brand, form?.catalogModel]);

  useEffect(() => {
    if (!shouldLoadFacetOptions || !categoryId) {
      return;
    }

    let isMounted = true;

    getFacetOptionOptionsApi({
      category: categoryId,
      facetKey: "type",
      status: "ACTIVE",
    })
      .then((data) => {
        if (isMounted) {
          setFacetOptions(data || []);
        }
      })
      .catch(() => {
        if (isMounted) setFacetOptions([]);
      });

    return () => {
      isMounted = false;
    };
  }, [shouldLoadFacetOptions, categoryId]);

  switch (field.type) {
    case "text":
    case "number":
      return (
        <input
          type={field.type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={`${baseInputClass} ${errorClass}`}
        />
      );

    case "vin":
      return (
        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          maxLength={17}
          placeholder="Enter 17-digit VIN"
          className={`${baseInputClass} ${errorClass} font-mono uppercase`}
        />
      );

    case "date":
      return (
        <input
          type="date"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className={`${baseInputClass} ${errorClass}`}
        />
      );

    case "textarea":
      {
        const maxLength = getTextareaLimit(field);
        const currentLength = String(value ?? "").length;

      return (
        <div>
          <textarea
            value={value ?? ""}
            onChange={(e) =>
              onChange(maxLength ? e.target.value.slice(0, maxLength) : e.target.value)
            }
            maxLength={maxLength}
            placeholder={field.placeholder}
            rows={4}
            className={`${baseInputClass} ${errorClass} h-auto resize-none py-2.5`}
          />
          {maxLength ? (
            <div className={`mt-1 text-right text-xs font-medium ${getCounterClass(currentLength, maxLength)}`}>
              {currentLength}/{maxLength} characters
            </div>
          ) : null}
        </div>
      );
      }

      case "url":
      return (
        <input
          type="url"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "https://maps.google.com/..."}
          className={`${baseInputClass} ${errorClass}`}
        />
      );

    case "email":
      return (
        <input
          type="email"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || "email@example.com"}
          className={`${baseInputClass} ${errorClass}`}
        />
      );

    case "phone":
      {
        const isSyncedWhatsapp = field.name === "whatsappNumber" && Boolean(form?.whatsappAvailable);

      return (
        <PhoneNumberField
          value={value}
          onChange={onChange}
          error={error}
          placeholder={field.placeholder}
          disabled={isSyncedWhatsapp}
          helperText={isSyncedWhatsapp ? "Using the same mobile number for WhatsApp." : field.description}
        />
      );
      }

    case "select":
      {
        const selectOptions =
          shouldLoadFacetOptions && categoryId
            ? facetOptions
            : field.options || [];

        return (
          <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${baseInputClass} ${errorClass}`}>
            <option value="">Select {field.label.toLowerCase()}</option>
            {selectOptions.map((option, idx) => {
              const isObject = typeof option === "object" && option !== null;
              const optVal = isObject ? option.value : option;
              const optLabel = isObject ? option.label : option;
              const uniqueKey = isObject ? option.value || option.label || idx : `${option}-${idx}`;

              return (
                <option key={uniqueKey} value={optVal}>
                  {optLabel}
                </option>
              );
            })}
          </select>
        );
      }

    case "yearSelect":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${baseInputClass} ${errorClass}`}>
          <option value="">Select year</option>
          {yearOptions.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      );

    case "countrySelect":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${baseInputClass} ${errorClass}`}>
          <option value="">Select country</option>
          {GULF_COUNTRY_NAMES.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      );

    case "brandSelect":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} disabled={!categoryId} className={`${baseInputClass} ${errorClass} disabled:bg-slate-100`}>
          <option value="">Select brand</option>
          {brandOptions.map((brand) => (
            <option key={brand._id} value={brand._id}>{brand.name}</option>
          ))}
        </select>
      );

    case "modelSelect":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} disabled={!form?.brand} className={`${baseInputClass} ${errorClass} disabled:bg-slate-100`}>
          <option value="">Select model</option>
          {(categoryId && form?.brand ? modelOptions : []).map((model) => (
            <option key={model._id} value={model._id}>{model.name}</option>
          ))}
        </select>
      );

    case "variantSelect":
      return (
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={!form?.catalogModel}
          className={`${baseInputClass} ${errorClass} disabled:bg-slate-100`}
        >
          <option value="">Select variant</option>
          {(categoryId && form?.brand && form?.catalogModel ? variantOptions : []).map((variant) => (
            <option key={variant._id} value={variant.name}>
              {variant.name}
            </option>
          ))}
        </select>
      );

    case "yesNoSelect":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${baseInputClass} ${errorClass}`}>
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );

    case "toggle2":
    case "toggle3":
      return <ToggleGroupField value={value} onChange={onChange} options={field.options} error={error} />;

    case "colorSwatch":
      return <ColorSwatchField value={value} onChange={onChange} swatches={field.swatches} error={error} />;

    case "toggleSwitch":
      return (
        <ToggleSwitchField
          checked={Boolean(value)}
          onChange={onChange}
          label={field.label}
          description={field.description}
        />
      );

    default:
      return null;
  }
};

export default DynamicField;
