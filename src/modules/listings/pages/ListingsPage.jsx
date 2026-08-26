//[DEALER] /Users/personal/Desktop/gulf--dealer/gulf-dealer/src/modules/listings/pages/ListingsPage.jsx

import { useEffect, useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { getDealerStatusApi } from "../../dealer/api/dealerApi";
import { useNavigate } from "react-router-dom";

import ListingsTabs from "../components/ListingsTabs";
import ListingsTable from "../components/ListingsTable";
import { listingsApi } from "../api/listingsApi";
import { profileApi } from "../../profile/api/profileApi";
import { LISTING_TABS } from "../listings.constants";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import ListingQuickViewModal from "../components/ListingQuickViewModal";
import ListingsPagination from "../components/ListingsPagination";

const REQUIRED_PROFILE_FIELDS = [
  "businessName",
  "ownerName",
  "phone",
  "email",
];

function isEnded(label) {
  return Boolean(label) && /expired/i.test(label);
}

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [soldVehicle, setSoldVehicle] = useState(null);
  const navigate = useNavigate();
  const [isCheckingPlan, setIsCheckingPlan] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [statusCounts, setStatusCounts] = useState({});
  const [quickViewVehicle, setQuickViewVehicle] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalItems: 0, totalPages: 0 });

  const loadVehicles = async () => {
    setLoading(true);

    try {
      const selectedTab = LISTING_TABS.find(
        (tab) => tab.key === activeTab
      );

      const data = await listingsApi.getAll({
        status: selectedTab?.status,
        search: search || undefined,
        page,
      });

      let items = data.items || [];
      let paginationData = data.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 0 };

      // Active tab only shows vehicles that haven't ended yet — keep the
      // list, count, and pagination consistent with that filter.
      if (activeTab === "active") {
        items = items.filter((item) => !isEnded(item.daysLabel));
        paginationData = {
          ...paginationData,
          totalItems: items.length,
          totalPages: 1,
        };
      }

      const mappedVehicles = items.map((listing) => ({
        ...listing,

        title: listing.vehicleInfo?.title,
        year: listing.vehicleInfo?.manufacturingYear,
        mileage: listing.vehicleInfo?.mileage,
        fuelType: listing.vehicleInfo?.fuelType,

        price: listing.pricing?.price,

        thumbnailUrl:
          listing.media?.featuredImage?.url ||
          listing.media?.images?.[0]?.url ||
          "/images/placeholder-car.png",
      }));

      setVehicles(mappedVehicles);
      setTotalCount(paginationData.totalItems || 0);
      setPagination(paginationData);
    } catch (err) {
      console.error("Failed to load listings:", err);
      setVehicles([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const loadStatusCounts = async () => {
    try {
      const results = await Promise.all(
        LISTING_TABS.map(async (tab) => {
          if (tab.key === "active") {
            // Active count must exclude ended listings, so fetch the full
            // active list and count client-side rather than trusting the
            // backend's raw "active" totalItems.
            const data = await listingsApi.getAll({
              status: tab.status,
              limit: 1000,
            });

            const items = (data.items || []).filter(
              (item) => !isEnded(item.daysLabel)
            );

            return { key: tab.key, count: items.length };
          }

          const data = await listingsApi.getAll({ status: tab.status, limit: 1 });
          return { key: tab.key, count: data.pagination?.totalItems || 0 };
        })
      );

      const counts = {};
      results.forEach((result) => {
        counts[result.key] = result.count;
      });

      setStatusCounts(counts);
    } catch (err) {
      console.error("Failed to load status counts:", err);
    }
  };

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search]);

  useEffect(() => {
    loadVehicles();
    loadStatusCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadVehicles();
    }, 500);

    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = (vehicle) => {
    setDeleteVehicle(vehicle);
  };

  const confirmDelete = async () => {
    if (!deleteVehicle) return;

    try {
      setIsDeleting(true);
      await listingsApi.deleteVehicle(deleteVehicle._id);
      setDeleteVehicle(null);
      loadVehicles();
      loadStatusCounts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleFeatured = async (vehicle) => {
    try {
      await listingsApi.toggleFeatured(vehicle._id);
      loadVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmMarkSold = async () => {
    if (!soldVehicle) return;

    try {
      setIsMarkingSold(true);
      await listingsApi.toggleSold(soldVehicle._id);
      setSoldVehicle(null);
      loadVehicles();
      loadStatusCounts();
    } catch (err) {
      console.error(err);
    } finally {
      setIsMarkingSold(false);
    }
  };

  const handleAddNewVehicle = async () => {
    if (isCheckingPlan) return;

    setIsCheckingPlan(true);

    try {
      const profile = await profileApi.getProfile();

      const missingField = REQUIRED_PROFILE_FIELDS.find(
        (field) => !profile?.[field]
      );

      if (missingField) {
        alert(
          "Please complete your dealer profile (business name, owner name, phone, and email) before adding a vehicle."
        );
        navigate("/profile");
        return;
      }

      const dealerStatus = await getDealerStatusApi();
      const subscriptionId =
        dealerStatus?.dealer?.business?.businessSubscriptionRef?._id;

      if (!subscriptionId) {
        alert(
          "No active business plan found. Please complete your dealer subscription to start listing vehicles."
        );
        return;
      }

      navigate(`/listings/add-vehicle?subscriptionId=${subscriptionId}`);
    } catch (err) {
      console.error("Failed to check dealer status:", err);
      alert("Unable to verify your profile or plan. Please try again.");
    } finally {
      setIsCheckingPlan(false);
    }
  };

  const handleEdit = (vehicle) => {
    navigate(`/vehicles/${vehicle._id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Listings</h1>

          <a
            href="/vehicles"
            className="text-sm text-gray-600 hover:text-blue-700"
          >
            View all Listings
          </a>
        </div>

        <button
          onClick={handleAddNewVehicle}
          disabled={isCheckingPlan}
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-70"
        >
          <Plus size={16} />
          {isCheckingPlan ? "Checking..." : "Add new listing"}
        </button>
      </div>

      <ListingsTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        statusCounts={statusCounts}
      />

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search vehicles by name, make, model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadVehicles()}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
          />
        </div>

        {activeTab === "pending" && (
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600">
            <Filter size={16} />
            Filter
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading listings...</p>
      ) : (
        <>
          <ListingsTable
            tab={activeTab}
            vehicles={vehicles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
            onToggleSold={setSoldVehicle}
            onRowClick={setQuickViewVehicle}
          />

          <ListingsPagination
            page={pagination.page}
            limit={pagination.limit}
            totalItems={pagination.totalItems}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteVehicle)}
        title="Delete listing"
        message={`Delete "${deleteVehicle?.title || "this listing"}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setDeleteVehicle(null);
        }}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        isOpen={Boolean(soldVehicle)}
        title="Mark as sold"
        message={`Mark "${soldVehicle?.title || "this listing"}" as sold? It will show as sold everywhere, and listing duration/date-limit information will no longer be shown.`}
        confirmText="Mark as Sold"
        isLoading={isMarkingSold}
        onClose={() => {
          if (!isMarkingSold) setSoldVehicle(null);
        }}
        onConfirm={confirmMarkSold}
      />

      {quickViewVehicle && (
        <ListingQuickViewModal
          vehicle={quickViewVehicle}
          onClose={() => setQuickViewVehicle(null)}
        />
      )}
    </div>
  );
}
