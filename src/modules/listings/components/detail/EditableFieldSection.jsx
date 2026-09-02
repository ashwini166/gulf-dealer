import { useRef, useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";

import DynamicField from "../formFields/DynamicField";
import { saveListingStepApi } from "../../api/listingDetailApi";
import { useToast } from "../../../../context/ToastContext";

const formatDisplayValue = (field, rawValue) => {
  if (rawValue === undefined || rawValue === null || rawValue === "") return "—";

  if (field.type === "colorSwatch") {
    const value = String(rawValue);
    if (value.startsWith("#")) return value;
    return value
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  if (field.type === "toggleSwitch") return rawValue ? "Yes" : "No";
  if (field.type === "yesNoSelect") return rawValue === true || rawValue === "true" ? "Yes" : "No";
  if (field.type === "brandSelect" || field.type === "modelSelect") {
    return typeof rawValue === "object" ? rawValue.name : "—";
  }
  if (field.type === "date") {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
      new Date(rawValue)
    );
  }

  return String(rawValue);
};

const isBlank = (value) => value === undefined || value === null || String(value).trim() === "";

const toIdValue = (value) => {
  if (!value || typeof value !== "object") return value ?? "";
  return value._id || value.id || "";
};

const normalizeServerMessage = (message) => {
  const text = String(message || "").trim();
  if (!text) return "Unable to save changes";

  if (/vehicleInfo\.brand|brand.*ObjectId|Cast to ObjectId.*brand/i.test(text)) {
    return "Please select a valid brand from the list";
  }
  if (/vehicleInfo\.catalogModel|catalogModel.*ObjectId|Cast to ObjectId.*catalogModel/i.test(text)) {
    return "Please select a valid model from the list";
  }

  return text;
};

const EditableFieldSection = ({
  title,
  step,
  fields,
  displayFields,
  displaySourceData,
  sourceData,
  categoryId,
  listingId,
  canEdit,
  onSaved,
  gridLayout = "sm:grid-cols-2",
}) => {
  const { showToast } = useToast();
  const visibleFields = displayFields || fields;
  const visibleSourceData = displaySourceData || sourceData;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fieldRefs = useRef({});
  const missingRequiredCount = fields.filter(
    (field) => field.required && isBlank(sourceData?.[field.name])
  ).length;

  const buildInitialForm = () => {
    const initial = {};
    fields.forEach((field) => {
      if (field.type === "brandSelect") {
        initial[field.name] = toIdValue(sourceData?.[field.name]);
      } else if (field.type === "modelSelect") {
        initial[field.name] = toIdValue(sourceData?.[field.name]);
      } else if (field.type === "toggleSwitch") {
        initial[field.name] = sourceData?.[field.name] ?? false;
      } else if (field.type === "yesNoSelect") {
        const raw = sourceData?.[field.name];
        initial[field.name] = raw === null || raw === undefined ? "" : String(raw);
      } else {
        initial[field.name] = sourceData?.[field.name] ?? "";
      }
    });
    return initial;
  };

  const [form, setForm] = useState(buildInitialForm);

  const handleChange = (fieldName, value) => {
    setForm((previous) => {
      const next = { ...previous, [fieldName]: value };
      if (fieldName === "brand") next.catalogModel = "";
      return next;
    });
    setErrors((previous) => ({ ...previous, [fieldName]: "" }));
  };

  const scrollToFirstError = (nextErrors) => {
    const firstErrorField = fields.find((field) => nextErrors[field.name]);
    if (firstErrorField) {
      fieldRefs.current[firstErrorField.name]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const validate = () => {
    const nextErrors = {};

    fields.forEach((field) => {
      const value = form[field.name];

      if (field.required && isBlank(value)) {
        nextErrors[field.name] = `${field.label} is required`;
      } else if (field.type === "email" && !isBlank(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        nextErrors[field.name] = "Please enter a valid email address";
      } else if (field.type === "url" && !isBlank(value)) {
        try {
          const url = new URL(String(value));
          if (!["http:", "https:"].includes(url.protocol)) {
            nextErrors[field.name] = "Please enter a valid URL";
          }
        } catch {
          nextErrors[field.name] = "Please enter a valid URL";
        }
      } else if ((field.type === "number" || field.type === "yearSelect") && !isBlank(value) && Number.isNaN(Number(value))) {
        nextErrors[field.name] = `${field.label} must be a number`;
      } else if (field.type === "number" && Number(value) < 0) {
        nextErrors[field.name] = `${field.label} cannot be negative`;
      }
    });

    if (form.manufacturingYear && Number(form.manufacturingYear) > new Date().getFullYear() + 1) {
      nextErrors.manufacturingYear = "Manufacturing year cannot be in the future";
    }

    if (form.vinNumber && String(form.vinNumber).trim().length !== 17) {
      nextErrors.vinNumber = "VIN number must be exactly 17 characters";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleStartEdit = () => {
    setForm(buildInitialForm());
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const handleSave = async () => {
    if (!validate()) return;

    setIsSaving(true);

    const payload = { ...sourceData, ...form };

    ["brand", "catalogModel"].forEach((fieldName) => {
      if (payload[fieldName] !== undefined) {
        payload[fieldName] = toIdValue(payload[fieldName]);
      }
    });

    if (payload.manufacturingYear) payload.manufacturingYear = Number(payload.manufacturingYear);
    if (payload.mileage !== undefined && payload.mileage !== "") payload.mileage = Number(payload.mileage);
    if (payload.vinNumber) payload.vinNumber = String(payload.vinNumber).trim().toUpperCase();

    fields.forEach((field) => {
      if (field.type === "number" && payload[field.name] !== undefined && payload[field.name] !== "") {
        payload[field.name] = Number(payload[field.name]);
      }
      if (field.type === "yesNoSelect" && payload[field.name] !== "") {
        payload[field.name] = payload[field.name] === "true";
      }
    });

    try {
      const updatedListing = await saveListingStepApi(listingId, step, payload);
      showToast(`${title} updated successfully`, "success");
      setIsEditing(false);
      onSaved?.(updatedListing);
    } catch (error) {
      const message = normalizeServerMessage(error.response?.data?.message || error.message);
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5eaf1] bg-white">
      <div className="flex min-h-12 items-center justify-between border-b border-[#edf1f6] px-5 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h3 className="text-[13px] font-black text-[#202a3b]">{title}</h3>
          {!isEditing && canEdit && missingRequiredCount > 0 && (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
              {missingRequiredCount} required missing
            </span>
          )}
        </div>

        {canEdit && !isEditing && (
          <button
            type="button"
            onClick={handleStartEdit}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2454ef] hover:underline"
          >
            <Pencil size={13} />
            Edit
          </button>
        )}

        {isEditing && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
            >
              <X size={13} />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {isSaving && <Loader2 size={12} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      {!isEditing && visibleFields.length === 1 && visibleFields[0]?.type === "textarea" ? (
        <p className="px-5 py-5 text-[13px] font-semibold leading-6 text-[#657387]">
          {formatDisplayValue(visibleFields[0], visibleSourceData?.[visibleFields[0].name])}
        </p>
      ) : (
      <div className={`grid px-5 py-4 ${isEditing ? "gap-x-6 gap-y-4" : "gap-x-9 gap-y-0"} ${gridLayout}`}>
        {(isEditing ? fields : visibleFields).map((field) => {
          const isFullWidth = field.span === 2 || field.type === "textarea";

          return (
            <div
              key={field.name}
              ref={(el) => (fieldRefs.current[field.name] = el)}
              className={isFullWidth ? "sm:col-span-2" : ""}
            >
              {isEditing ? (
                <>
                  {field.type !== "toggleSwitch" && (
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      {field.label}
                      {field.required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                  )}
                  <div className={errors[field.name] ? "rounded-lg ring-2 ring-red-400 ring-offset-1" : ""}>
                    <DynamicField
                      field={field}
                      value={form[field.name]}
                      onChange={(value) => handleChange(field.name, value)}
                      error={errors[field.name]}
                      form={form}
                      categoryId={categoryId}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="mt-1 text-xs font-medium text-red-600">{errors[field.name]}</p>
                  )}
                </>
              ) : (
                <div className="flex min-h-9 items-center justify-between gap-5 border-b border-[#f1f4f8] py-1.5">
                  <span className="text-xs font-semibold text-[#8897ad]">{field.label}</span>
                  <span className="text-right text-xs font-black text-[#202a3b]">
                    {formatDisplayValue(field, visibleSourceData?.[field.name])}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default EditableFieldSection;
