import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import LeadResponseActions from "../../../leads/components/LeadResponseActions";
import { leadsApi } from "../../../leads/api/leadsApi";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value)
  );
};

const getInitials = (name = "") =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

const CustomerInquiries = ({ listingId, onCountLoaded }) => {
  const [leads, setLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        const result = await leadsApi.getAll({ listingId, limit: 20 });

        if (isMounted) {
          setLeads(result.leads || []);
          setTotalCount(result.totalCount || 0);
          onCountLoaded?.(result.totalCount || 0);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error.response?.data?.message || "Unable to load inquiries");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLeads();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5eaf1] bg-white">
      <div className="flex min-h-12 items-center justify-between gap-2 border-b border-[#edf1f6] px-5 py-3">
        <h3 className="text-[13px] font-black text-[#202a3b]">Customer Inquiries</h3>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-[#2454ef]">{totalCount} Total</span>
      </div>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-slate-400" />
        </div>
      )}

      {loadError && (
        <p className="text-sm text-red-600">{loadError}</p>
      )}

      {!isLoading && !loadError && leads.length === 0 && (
        <p className="py-4 text-center text-sm text-slate-400">No inquiries yet for this listing</p>
      )}

      {!isLoading && leads.length > 0 && (
        <div className="overflow-x-auto px-5 py-5">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="bg-[#f7f9fc] text-[#8290a5]">
              <tr>
                <th className="rounded-l-[8px] px-3 py-3 font-black">Customer</th>
                <th className="px-3 py-3 font-black">Date</th>
                <th className="px-3 py-3 font-black">Message</th>
                <th className="px-3 py-3 font-black">Email</th>
                <th className="px-3 py-3 font-black">Mobile Number</th>
                <th className="rounded-r-[8px] px-3 py-3 font-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f4f8]">
              {leads.map((lead) => (
                <tr key={lead._id || lead.id}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-black text-blue-700">
                        {getInitials(lead.customerName || lead.name)}
                      </span>
                      <span className="font-black text-[#202a3b]">
                        {lead.customerName || lead.name || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-semibold text-[#7c8aa0]">{formatDate(lead.createdAt)}</td>
                  <td className="max-w-[220px] truncate px-3 py-3 font-semibold text-[#7c8aa0]">{lead.message || "—"}</td>
                  <td className="px-3 py-3 font-semibold text-[#7c8aa0]">{lead.email || "—"}</td>
                  <td className="px-3 py-3 font-semibold text-[#7c8aa0]">
                    {lead.mobileNumber || lead.customerPhone || lead.phone || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <LeadResponseActions lead={lead} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerInquiries;
