import { useEffect, useState } from "react";
import ColorSwatchField from "./ColorSwatchField";
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
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear + 1 - i);

const baseInputClass =
  "h-10 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const dynamicFacetFields = new Set([
  "bodyType",
  "vehicleType",
  "equipmentType",
  "bikeCategory",
  "bikeType",
]);

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
          setFacetOptions((data || []).map((option) => option.label));
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
      return (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={`${baseInputClass} ${errorClass} h-auto resize-none py-2.5`}
        />
      );

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

    case "select":
      {
        const selectOptions =
          shouldLoadFacetOptions && categoryId && facetOptions.length
            ? facetOptions
            : field.options || [];

        return (
          <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={`${baseInputClass} ${errorClass}`}>
            <option value="">Select {field.label.toLowerCase()}</option>
            {selectOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
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
