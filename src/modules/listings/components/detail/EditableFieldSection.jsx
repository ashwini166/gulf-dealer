import { useRef, useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";

import DynamicField from "../formFields/DynamicField";
import { saveListingStepApi } from "../../api/listingDetailApi";
import { useToast } from "../../../../context/ToastContext";

const formatDisplayValue = (field, rawValue) => {
  if (rawValue === undefined || rawValue === null || rawValue === "") return "—";

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

  const buildInitialForm = () => {
    const initial = {};
    fields.forEach((field) => {
      if (field.type === "brandSelect") {
        initial[field.name] = sourceData?.[field.name]?._id || sourceData?.[field.name] || "";
      } else if (field.type === "modelSelect") {
        initial[field.name] = sourceData?.[field.name]?._id || sourceData?.[field.name] || "";
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
      if (field.required && !form[field.name]) {
        nextErrors[field.name] = `${field.label} is required`;
      }
    });

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

    const payload = { ...form };

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
      const message = error.response?.data?.message || error.message || "Unable to save changes";
      showToast(message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5eaf1] bg-white">
      <div className="flex min-h-12 items-center justify-between border-b border-[#edf1f6] px-5 py-3">
        <h3 className="text-[13px] font-black text-[#202a3b]">{title}</h3>

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
