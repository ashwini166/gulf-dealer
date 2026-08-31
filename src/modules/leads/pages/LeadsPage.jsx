import { useEffect, useState } from "react";
import {
  ChevronRight,
  Download,
  Home,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import LeadResponseActions from "../components/LeadResponseActions";
import { leadsApi } from "../api/leadsApi";

function initials(name = "") {
  const value = name.trim();
  if (!value) return "NA";

  return value
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase ${
        status === "new"
          ? "bg-emerald-50 text-emerald-600"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {status || "new"}
    </span>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [newTodayCount, setNewTodayCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await leadsApi.getAll({
          limit: 100,
          search: search.trim() || undefined,
        });

        if (!isActive) return;

        setLeads(data.leads || []);
        setTotalCount(data.totalCount ?? data.leads?.length ?? 0);
        setNewTodayCount(data.newTodayCount ?? 0);
      } catch (err) {
        console.error("Failed to load leads:", err);
        if (isActive) {
          setError(err.response?.data?.message || "Unable to load leads");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    loadLeads();

    return () => {
      isActive = false;
    };
  }, [search]);

  const handleExport = async () => {
    setExporting(true);

    try {
      const blob = await leadsApi.exportCrm();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "leads-export.csv";
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)]">
      <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-slate-400">
        <Home size={16} />
        <ChevronRight size={16} />
        <span className="text-blue-600">Lead Management</span>
      </div>

      <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-slate-900">
            Lead Management
          </h1>
          <p className="mt-2 text-base font-medium text-slate-500">
            {totalCount.toLocaleString("en-US")} total leads -{" "}
            {newTodayCount.toLocaleString("en-US")} new today
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:w-[320px]">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customer, vehicle, phone..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex h-12 items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
          >
            {exporting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {exporting ? "Exporting..." : "Export CRM"}
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div>
          <table className="w-full table-fixed text-left text-xs xl:text-sm">
            <thead className="bg-slate-50/90 text-slate-500">
              <tr>
                <th className="w-[20%] px-4 py-4 font-bold">Customer</th>
                <th className="w-[20%] px-4 py-4 font-bold">Enquiry</th>
                <th className="w-[22%] px-4 py-4 font-bold">Message</th>
                <th className="w-[18%] px-4 py-4 font-bold">Contact</th>
                <th className="w-[20%] px-4 py-4 font-bold">Actions</th>
              </tr>
            </thead>

            {!loading && leads.length > 0 ? (
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead._id} className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white shadow-sm shadow-blue-600/20">
                          {initials(lead.customerName)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">
                            {lead.customerName || "Unknown Customer"}
                          </p>
                          <p className="mt-0.5 truncate font-medium text-slate-400">
                            {lead.customerPhone || lead.mobileNumber || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="break-words px-4 py-4 align-top font-medium text-slate-600">
                      <p>{lead.vehicleTitle || "-"}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <StatusBadge status={lead.status} />
                        {lead.inquiryType === "seller_profile" ? (
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black uppercase text-blue-600">
                            Seller Profile
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="break-words px-4 py-4 align-top font-medium text-slate-400">
                      {lead.message || "Is it available?"}
                    </td>
                    <td className="break-words px-4 py-4 align-top">
                      <p className="font-medium text-slate-600">
                        {lead.mobileNumber || lead.customerPhone || "-"}
                      </p>
                      <p className="mt-1 break-all text-xs font-medium text-slate-400">
                        {lead.email || "-"}
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <LeadResponseActions lead={lead} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : null}
          </table>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sm font-semibold text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            Loading leads...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        ) : null}

        {!loading && !error && leads.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Users size={24} />
            </div>
            <p className="mt-4 text-sm font-bold text-slate-700">No leads yet</p>
            <p className="mt-1 text-sm font-medium text-slate-400">
              New enquiries from buyers will appear here.
            </p>
          </div>
        ) : null}
      </section>

      {leads.length > 0 ? (
        <div className="mt-4 flex justify-end text-xs font-semibold text-slate-400">
          Showing {leads.length.toLocaleString("en-US")} of{" "}
          {totalCount.toLocaleString("en-US")} leads
        </div>
      ) : null}
    </div>
  );
}
