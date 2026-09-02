import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  Camera,
  Car,
  Pencil,
  Users,
  X,
} from "lucide-react";

import BusinessInfoCard from "../components/BusinessInfoCard";
import VerificationDocumentsCard from "../components/VerificationDocumentsCard";
import WorkingHoursCard from "../components/WorkingHoursCard";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { profileApi } from "../api/profileApi";
import { GULF_COUNTRIES } from "../../listings/config/gulfLocations.config";

const EMPTY_FORM = {
  businessName: "",
  ownerName: "",
  phone: "",
  email: "",
  category: "",
  businessType: "",
  vehicleCategories: [],
  vehicleBrands: [],
  vehicleBrandsText: "",
  description: "",
  whatsapp: "",
  website: "",
  instagram: "",
  twitter: "",
  facebook: "",
  address: "",
  country: "",
  state: "",
  city: "",
  mapsLink: "",
};

const BUSINESS_CATEGORY_OPTIONS = [
  "Showroom",
  "Dealership",
  "Rental Company",
  "Garage",
  "Accessory Dealer",
  "Spare Parts Dealer",
  "Service Provider",
  "Commercial Vehicle Dealer",
  "Heavy Equipment Dealer",
  "Insurance",
];

const VEHICLE_CATEGORY_OPTIONS = [
  "Cars",
  "Motorcycles",
  "Commercial Vehicles",
  "Heavy Equipment",
  "Buggies",
  "Caravans",
];

const BUSINESS_TYPE_OPTIONS = [
  "Individual Dealer",
  "Multi-Brand Dealer",
  "Authorized Dealer",
];

const fieldClass =
  "mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400";

const textareaClass =
  "mt-2 min-h-24 w-full resize-none rounded-lg border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500";

const buildFormValues = (profile = {}) => ({
  businessName: profile.businessName || "",
  ownerName: profile.ownerName || "",
  phone: profile.phone || "",
  email: profile.email || "",
  category: profile.category || "",
  businessType: profile.businessType || "",
  vehicleCategories: Array.isArray(profile.vehicleCategories)
    ? profile.vehicleCategories
    : [],
  vehicleBrands: Array.isArray(profile.vehicleBrands)
    ? profile.vehicleBrands
    : [],
  vehicleBrandsText: Array.isArray(profile.vehicleBrands)
    ? profile.vehicleBrands.join(", ")
    : "",
  description: profile.description || "",
  whatsapp: profile.whatsapp || "",
  website: profile.website || "",
  instagram: profile.instagram || "",
  twitter: profile.twitter || "",
  facebook: profile.facebook || "",
  address: profile.address || profile.location || "",
  country: profile.country || "",
  state: profile.state || "",
  city: profile.city || "",
  mapsLink: profile.mapsLink || "",
});

const validateFile = (file) => {
  if (!file) return "Choose a file first.";

  if (!file.type?.startsWith("image/")) {
    return "Please select an image file.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "File must be 5 MB or smaller.";
  }

  return "";
};

/* -------------------------------------------------------
   FORM FIELD
------------------------------------------------------- */

function Field({ children, label, locked = false, required = false }) {
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
        {label}

        {required ? <span className="text-red-500">*</span> : null}

        {locked ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] uppercase text-emerald-700">
            Locked
          </span>
        ) : null}
      </span>

      {children}
    </label>
  );
}

function CheckboxGroup({ value = [], onChange, options }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  };

  return (
    <div className="mt-2 grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => toggle(option)}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

/* -------------------------------------------------------
   PROFILE FORM
------------------------------------------------------- */

function ProfileForm({ initialValues, locks = {}, submitLabel, onSaved }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    ...initialValues,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const updateValue = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const stateOptions = useMemo(
    () =>
      GULF_COUNTRIES.find((country) => country.name === form.country)
        ?.governorates || [],
    [form.country],
  );

  const handleCountryChange = (event) => {
    const nextCountry = event.target.value;

    setForm((current) => ({
      ...current,
      country: nextCountry,
      state: "",
      city: "",
    }));
  };

  const handleStateChange = (event) => {
    const nextState = event.target.value;

    setForm((current) => ({
      ...current,
      state: nextState,
      city: nextState,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      await profileApi.updateProfile(form);
      await onSaved();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't save your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2"
    >
      <Field label="Business Name" required locked={locks.businessName}>
        <input
          className={fieldClass}
          disabled={locks.businessName}
          required
          value={form.businessName}
          onChange={update("businessName")}
        />
      </Field>

      <Field label="Owner Name" required>
        <input
          className={fieldClass}
          required
          value={form.ownerName}
          onChange={update("ownerName")}
        />
      </Field>

      <Field label="Mobile Number" required locked={locks.phone}>
        <input
          className={fieldClass}
          disabled={locks.phone}
          required
          value={form.phone}
          onChange={update("phone")}
        />
      </Field>

      <Field label="Business Email" required>
        <input
          className={fieldClass}
          required
          type="email"
          value={form.email}
          onChange={update("email")}
        />
      </Field>

      <Field label="Business Category">
        <select
          className={fieldClass}
          value={form.category}
          onChange={update("category")}
        >
          <option value="">Select Business Category</option>
          {BUSINESS_CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </Field>

      <Field label="Business Type">
        <select
          className={fieldClass}
          value={form.businessType}
          onChange={update("businessType")}
        >
          <option value="">Select Business Type</option>
          {BUSINESS_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </Field>

      <div className="sm:col-span-2">
        <Field label="Vehicle Category">
          <CheckboxGroup
            value={form.vehicleCategories}
            onChange={(value) => updateValue("vehicleCategories", value)}
            options={VEHICLE_CATEGORY_OPTIONS}
          />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Field label="Vehicle Brands">
          <input
            className={fieldClass}
            value={form.vehicleBrandsText}
            onChange={(event) => {
              const value = event.target.value;
              setForm((current) => ({
                ...current,
                vehicleBrandsText: value,
                vehicleBrands: value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean),
              }));
            }}
            placeholder="e.g. Toyota, Nissan, BMW"
          />
        </Field>
      </div>

      <Field label="WhatsApp">
        <input
          className={fieldClass}
          value={form.whatsapp}
          onChange={update("whatsapp")}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Description">
          <textarea
            className={textareaClass}
            maxLength={500}
            value={form.description}
            onChange={update("description")}
          />
        </Field>
      </div>

      <Field label="Website">
        <input
          className={fieldClass}
          type="url"
          value={form.website}
          onChange={update("website")}
        />
      </Field>

      <Field label="Google Maps Link">
        <input
          className={fieldClass}
          type="url"
          value={form.mapsLink}
          onChange={update("mapsLink")}
        />
      </Field>

      <Field label="Address">
        <input
          className={fieldClass}
          value={form.address}
          onChange={update("address")}
        />
      </Field>

      <Field label="Country">
        <select
          className={fieldClass}
          value={form.country}
          onChange={handleCountryChange}
        >
          <option value="">Select country</option>
          {GULF_COUNTRIES.map((country) => (
            <option key={country.iso2} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="State / Governorate">
        <select
          className={fieldClass}
          value={form.state}
          onChange={handleStateChange}
          disabled={!form.country}
        >
          <option value="">Select State / Governorate</option>
          {stateOptions.map((state) => (
            <option key={state.name} value={state.name}>
              {state.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="City / Area">
        <input
          className={fieldClass}
          value={form.city}
          onChange={update("city")}
          placeholder="City / area"
        />
      </Field>

      <Field label="Instagram">
        <input
          className={fieldClass}
          value={form.instagram}
          onChange={update("instagram")}
        />
      </Field>

      <Field label="X / Twitter">
        <input
          className={fieldClass}
          value={form.twitter}
          onChange={update("twitter")}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field label="Facebook">
          <input
            className={fieldClass}
            value={form.facebook}
            onChange={update("facebook")}
          />
        </Field>
      </div>

      {error ? (
        <p className="sm:col-span-2 text-sm font-semibold text-red-500">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={saving}
        className="mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:col-span-2"
      >
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

/* -------------------------------------------------------
   EDIT PROFILE MODAL
------------------------------------------------------- */

function EditProfileModal({ profile, onClose, onSaved }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Edit Business Profile</h2>

            <p className="mt-1 text-sm text-slate-500">
              Approved dealers cannot change business name, mobile
              number, or Trade License Certificate.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        <ProfileForm
          initialValues={buildFormValues(profile)}
          locks={profile.locks || {}}
          submitLabel="Save Changes"
          onSaved={async () => {
            await onSaved();
            onClose();
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   PROFILE PAGE
------------------------------------------------------- */

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploading, setUploading] = useState("");
  const [error, setError] = useState("");

  /* -------------------------------------------------------
     LOAD PROFILE
  ------------------------------------------------------- */

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dealer profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* -------------------------------------------------------
     UPLOAD LOGO / COVER / DOCUMENT
  ------------------------------------------------------- */

  const handleUpload = async (type, file) => {
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(type);
    setError("");

    try {
      if (type === "logo") {
        await profileApi.updateLogo(file);
      }

      if (type === "cover") {
        await profileApi.updateCoverBanner(file);
      }

      if (type === "document") {
        await profileApi.uploadDocument(file, "Trade License Certificate");
      }

      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setUploading("");
    }
  };

  /* -------------------------------------------------------
     WORKING HOURS
  ------------------------------------------------------- */

  const handleSaveWorkingHours = async (hours) => {
    try {
      await profileApi.updateProfile({ hours });
      await load();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save working hours."
      );
    }
  };

  /* -------------------------------------------------------
     BUSINESS INITIALS
  ------------------------------------------------------- */

  const initials = useMemo(() => {
    const name = String(profile?.businessName || "G");

    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [profile?.businessName]);

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    );
  }

  /* -------------------------------------------------------
     ERROR
  ------------------------------------------------------- */

  if (error && !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-600">
        {error}
      </div>
    );
  }

  /* -------------------------------------------------------
     PROFILE UI
  ------------------------------------------------------- */

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: "Dealer Profile" }]} />

      {/* ---------------------------------------------------
          PAGE HEADER
      --------------------------------------------------- */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dealer Profile
          </h1>

          <p className="text-sm text-slate-500">
            Manage your business information and verification
          </p>
        </div>

        {profile.isVerified ? (
          <span className="flex w-fit items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <BadgeCheck size={18} className="text-emerald-600" />
            Verified Dealer
          </span>
        ) : null}
      </div>

      {/* ERROR */}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      {/* ===================================================
          PROFILE HERO
      =================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* COVER BANNER */}

        <div className="relative h-40 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 sm:h-52">
          {profile.coverBannerUrl ? (
            <img
              key={profile.coverBannerUrl}
              src={profile.coverBannerUrl}
              alt={`${profile.businessName || "Dealer"} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700" />
          )}

          {/* COVER CAMERA */}

          <label
            title="Update cover banner"
            className={`absolute right-5 top-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30 ${
              uploading === "cover" ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {uploading === "cover" ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Camera size={21} />
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading === "cover"}
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  handleUpload("cover", file);
                }

                event.target.value = "";
              }}
            />
          </label>
        </div>

        {/* HERO CONTENT — stacked: logo above name, name/tagline/stats below, left-aligned */}

        <div className="relative px-5 pb-6 pt-0 sm:px-10 sm:pb-8">
          {/* EDIT PROFILE — pinned top-right of the content area */}

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="absolute right-5 top-20 flex w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 sm:right-10 sm:top-16"
          >
            <Pencil size={17} strokeWidth={2} />
            Edit Profile
          </button>

          {/* LOGO */}

          <div className="relative -mt-16 h-28 w-28 sm:-mt-20 sm:h-32 sm:w-32 rounded-3xl bg-white p-1.5 shadow-lg">
            <div className="flex h-full w-full items-center justify-center rounded-3xl bg-blue-600 p-2">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
                {profile.logoUrl ? (
                  <img
                    key={profile.logoUrl}
                    src={profile.logoUrl}
                    alt={`${profile.businessName || "Dealer"} logo`}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-black text-slate-500">
                    {initials || <Building2 size={30} strokeWidth={1.8} />}
                  </div>
                )}
              </div>
            </div>

            {/* LOGO CAMERA — small, subtle badge */}

            <label
              title="Update business logo"
              className={`absolute -right-1.5 -top-1.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-2 ring-white transition hover:bg-blue-700 ${
                uploading === "logo" ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {uploading === "logo" ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Camera size={13} />
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading === "logo"}
                onChange={(event) => {
                  const file = event.target.files?.[0];

                  if (file) {
                    handleUpload("logo", file);
                  }

                  event.target.value = "";
                }}
              />
            </label>
          </div>

          {/* BUSINESS DETAILS — below the logo, left-aligned */}

          <div className="mt-4 min-w-0 max-w-[70%]">
            <h2 className="truncate text-2xl font-bold text-slate-900 sm:text-3xl">
              {profile.businessName || "Business Name"}
            </h2>

            <p className="mt-2 text-base text-slate-500">
              {profile.tier || "Dealer"}

              {profile.memberSince ? (
                <> · Member since {profile.memberSince}</>
              ) : null}
            </p>

            {profile.subscription?.daysTotal ? (
              <p className="mt-2 text-sm font-semibold text-blue-700">
                {profile.subscription.daysRemaining}/{profile.subscription.daysTotal} days
                {profile.subscription.offerReason
                  ? ` · ${profile.subscription.offerReason}`
                  : ""}
              </p>
            ) : null}

            {/* LISTINGS + LEADS */}

            <div className="mt-4 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Car size={18} className="text-blue-600" />

                <span className="font-medium">
                  {Number(profile.listingsCount || 0).toLocaleString(
                    "en-GB"
                  )}{" "}
                  Listings
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users size={18} className="text-emerald-500" />

                <span className="font-medium">
                  {Number(profile.leadsCount || 0).toLocaleString("en-GB")}{" "}
                  Leads
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          BUSINESS INFORMATION + RIGHT SIDE
      =================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <BusinessInfoCard profile={profile} />

        <div className="flex flex-col gap-5">
          <VerificationDocumentsCard
            documents={profile.documents || []}
            locked={profile.locks?.tradeLicenseCertificate}
            onUpload={(file) => handleUpload("document", file)}
          />

          <WorkingHoursCard
            hours={profile.workingHours || {}}
            onSave={handleSaveWorkingHours}
          />
        </div>
      </div>

      {/* ===================================================
          EDIT MODAL
      =================================================== */}

      {isEditOpen ? (
        <EditProfileModal
          profile={profile}
          onClose={() => setIsEditOpen(false)}
          onSaved={load}
        />
      ) : null}
    </div>
  );
}
