import { Building2, Car, Globe, Mail, MapPin, Phone, Tag, User } from "lucide-react";

function Row({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-3 py-3">
      <Icon size={18} className="mt-0.5 text-slate-400" />

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="break-words font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export default function BusinessInfoCard({ profile }) {
  const vehicleCategories = Array.isArray(profile.vehicleCategories)
    ? profile.vehicleCategories.join(", ")
    : "";
  const vehicleBrands = Array.isArray(profile.vehicleBrands)
    ? profile.vehicleBrands.join(", ")
    : "";

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
      <h3 className="mb-2 text-lg font-bold">Business Information</h3>

      <div className="divide-y divide-slate-100">
        <Row
          icon={Building2}
          label="Business Name"
          value={profile.businessName}
        />

        <Row
          icon={User}
          label="Owner Name"
          value={profile.ownerName}
        />

        <Row
          icon={Tag}
          label="Business Category"
          value={profile.category}
        />

        <Row
          icon={Building2}
          label="Business Type"
          value={profile.businessType}
        />

        <Row
          icon={Car}
          label="Vehicle Categories"
          value={vehicleCategories}
        />

        <Row
          icon={Car}
          label="Vehicle Brands"
          value={vehicleBrands}
        />

        <Row
          icon={Phone}
          label="Phone"
          value={profile.phone}
        />

        <Row
          icon={Mail}
          label="Email"
          value={profile.email}
        />

        <Row
          icon={MapPin}
          label="Location"
          value={profile.location || profile.address}
        />

        <Row
          icon={Globe}
          label="Website"
          value={profile.website}
        />
      </div>
    </div>
  );
}
