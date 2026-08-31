import { Mail, Phone } from "lucide-react";

const getLeadPhone = (lead = {}) =>
  String(lead.customerPhone || lead.mobileNumber || lead.phone || "")
    .replace(/[^\d+]/g, "")
    .trim();

const getLeadEmail = (lead = {}) =>
  String(lead.email || lead.customerEmail || "").trim();

const buildReplyMessage = (lead = {}) =>
  encodeURIComponent(
    `Hi ${lead.customerName || lead.name || ""}, I am responding to your GulfInCart enquiry${
      lead.vehicleTitle ? ` for ${lead.vehicleTitle}` : ""
    }.`,
  );

const actionClass =
  "group relative inline-flex h-9 w-9 items-center justify-center rounded-full transition";

const Tooltip = ({ children }) => (
  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[11px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
    {children}
  </span>
);

const WhatsAppIcon = ({ size = 17 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16.04 3C9.45 3 4.08 8.34 4.08 14.9c0 2.1.55 4.15 1.6 5.95L4 27l6.32-1.65a12 12 0 0 0 5.72 1.45c6.6 0 11.96-5.34 11.96-11.9S22.63 3 16.04 3Zm0 21.78c-1.8 0-3.56-.48-5.1-1.4l-.36-.21-3.75.98 1-3.64-.24-.38a9.75 9.75 0 0 1-1.49-5.23c0-5.45 4.46-9.88 9.94-9.88 5.47 0 9.93 4.43 9.93 9.88s-4.46 9.88-9.93 9.88Zm5.45-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.46-2.41-1.48a9.04 9.04 0 0 1-1.67-2.07c-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.62.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
  </svg>
);

export default function LeadResponseActions({ lead }) {
  const phone = getLeadPhone(lead);
  const whatsappPhone = phone.replace(/^\+/, "");
  const email = getLeadEmail(lead);

  if (!phone && !email) {
    return <span className="text-xs font-semibold text-slate-400">No contact</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {whatsappPhone ? (
        <a
          href={`https://wa.me/${whatsappPhone}?text=${buildReplyMessage(lead)}`}
          target="_blank"
          rel="noreferrer"
          className={`${actionClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
          aria-label="Reply on WhatsApp"
          title="WhatsApp"
        >
          <WhatsAppIcon />
          <Tooltip>WhatsApp</Tooltip>
        </a>
      ) : null}
      {phone ? (
        <a
          href={`tel:${phone}`}
          className={`${actionClass} bg-blue-50 text-blue-700 hover:bg-blue-100`}
          aria-label="Call lead"
          title="Call"
        >
          <Phone size={16} />
          <Tooltip>Call</Tooltip>
        </a>
      ) : null}
      {email ? (
        <a
          href={`mailto:${email}?subject=${encodeURIComponent("GulfInCart enquiry reply")}`}
          className={`${actionClass} bg-slate-100 text-slate-700 hover:bg-slate-200`}
          aria-label="Email lead"
          title="Email"
        >
          <Mail size={16} />
          <Tooltip>Email</Tooltip>
        </a>
      ) : null}
    </div>
  );
}
