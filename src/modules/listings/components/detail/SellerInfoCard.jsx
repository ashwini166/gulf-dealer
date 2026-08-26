const SellerInfoCard = ({ listing }) => {
  const location = listing?.location;

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5eaf1] bg-white">
      <div className="flex min-h-12 items-center border-b border-[#edf1f6] px-5 py-3">
        <h3 className="text-[13px] font-black text-[#202a3b]">Seller Information</h3>
      </div>

      <div className="grid gap-x-9 px-5 py-4 sm:grid-cols-2">
        <div className="flex min-h-9 items-center justify-between gap-5 border-b border-[#f1f4f8] py-1.5">
          <span className="text-xs font-semibold text-[#8897ad]">Seller Name</span>
          <span className="text-right text-xs font-black text-[#202a3b]">{listing?.owner?.fullName || "—"}</span>
        </div>
        <div className="flex min-h-9 items-center justify-between gap-5 border-b border-[#f1f4f8] py-1.5">
          <span className="text-xs font-semibold text-[#8897ad]">Dealer Name</span>
          <span className="text-right text-xs font-black text-[#202a3b]">
            {listing?.owner?.dealer?.businessName || listing?.dealer?.businessName || "—"}
          </span>
        </div>
        <div className="flex min-h-9 items-center justify-between gap-5 border-b border-[#f1f4f8] py-1.5">
          <span className="text-xs font-semibold text-[#8897ad]">Phone</span>
          <span className="text-right text-xs font-black text-[#202a3b]">
            {location?.showPhoneNumber ? `${listing?.owner?.countryCode || ""} ${listing?.owner?.phone || ""}` : "Hidden"}
          </span>
        </div>
        <div className="flex min-h-9 items-center justify-between gap-5 border-b border-[#f1f4f8] py-1.5">
          <span className="text-xs font-semibold text-[#8897ad]">WhatsApp</span>
          <span className="text-right text-xs font-black text-[#202a3b]">
            {location?.showWhatsappNumber ? `${listing?.owner?.countryCode || ""} ${listing?.owner?.phone || ""}` : "Hidden"}
          </span>
        </div>
        <div className="flex min-h-9 items-center justify-between gap-5 border-b border-[#f1f4f8] py-1.5">
          <span className="text-xs font-semibold text-[#8897ad]">Email</span>
          <span className="text-right text-xs font-black text-[#202a3b]">{listing?.owner?.email || "—"}</span>
        </div>
        <div className="flex min-h-9 items-center justify-between gap-5 border-b border-[#f1f4f8] py-1.5">
          <span className="text-xs font-semibold text-[#8897ad]">Location</span>
          <span className="text-right text-xs font-black text-[#202a3b]">
            {[location?.city, location?.governorate, location?.country].filter(Boolean).join(", ") || "—"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SellerInfoCard;
