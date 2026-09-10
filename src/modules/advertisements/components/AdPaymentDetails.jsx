import { Download } from "lucide-react";

function Field({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${highlight ? "text-emerald-600" : "text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}

export default function AdPaymentDetails({ ad, onDownloadInvoice }) {
  const taxLabel = `${ad.taxName || "VAT"} (${Number((ad.vatRate || 0) * 100)}%)`;

  return (
    <>
      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">Advertisement Plan</h3>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {ad.priority}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <div>
            <Field label="Plan Name" value={ad.planName} />
            <Field label="Start Date" value={ad.startDate} />
            <Field label="Priority" value={ad.priority} />
            <Field label="Payment Status" value={ad.paymentStatus} highlight />
          </div>
          <div>
            <Field label="Duration" value={ad.duration} />
            <Field label="End Date" value={ad.endDate} />
            <Field label="Auto Renewal" value={ad.autoRenewal ? "Enabled" : "Disabled"} />
            <Field label="Amount" value={`BHD ${ad.amount}`} />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold">Payment Details</h3>
          <button
            onClick={onDownloadInvoice}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold hover:bg-slate-50"
          >
            <Download size={14} />
            Download Invoice
          </button>
        </div>
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <div>
            <Field label="Advertisement ID" value={ad.adId} />
            <Field label="Plan Purchased" value={ad.planName} />
            <Field label="Payment Method" value={ad.paymentMethod} />
            <Field label="Invoice Status" value={ad.invoiceStatus} highlight />
          </div>
          <div>
            <Field label="Invoice Number" value={ad.invoiceNumber} />
            <Field label="Amount Paid" value={`BHD ${ad.amount}`} />
            <Field label="Transaction Date" value={ad.transactionDate} />
            <Field label={taxLabel} value={`${ad.currency || "BHD"} ${ad.vatAmount}`} />
          </div>
        </div>
      </div>
    </>
  );
}
