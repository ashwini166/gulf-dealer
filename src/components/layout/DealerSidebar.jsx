import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Car,
  Users,
  Megaphone,
  CreditCard,
  Building2,
  Bell,
  X,
  LogOut,
  Crown,
} from "lucide-react";

import useAuth from "../../modules/auth/hooks/useAuth";
import { useEffect, useState } from "react";
import { subscriptionApi } from "../../modules/subscription/api/subscriptionApi";
import { profileApi } from "../../modules/profile/api/profileApi";
import { USER_APP_URL } from "../../config/env";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { label: "Listings", path: "/vehicles", icon: Car, badgeKey: "vehicles" },
  { label: "Leads", path: "/leads", icon: Users, badgeKey: "leads" },
  {
    label: "Advertisements",
    path: "/advertisements",
    icon: Megaphone,
  },
  {
    label: "Subscription",
    path: "/subscription",
    icon: CreditCard,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: Building2,
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: Bell,
    badgeKey: "notifications",
  },
];

export default function DealerSidebar({ isOpen, onClose }) {
  const { user, dealerStatus, isLoading, logout } = useAuth();

  const [subscription, setSubscription] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  // -----------------------------------------
  // Load Dealer Profile
  // -----------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileLoading(true);

        const data = await profileApi.getProfile();

        setProfile(data);
      } catch (err) {
        console.error("Failed to load dealer profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  // -----------------------------------------
  // Load Subscription
  // -----------------------------------------
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const data = await subscriptionApi.getCurrentPlan();

        setSubscription(data);
      } catch (err) {
        console.error("Failed to load subscription:", err);
      }
    };

    loadSubscription();
  }, []);

  // -----------------------------------------
  // BUSINESS NAME
  // -----------------------------------------
  // Profile API is the primary source because
  // businessName is stored in dealer profile.
  const businessName =
    profile?.businessName ||
    user?.businessName ||
    dealerStatus?.dealer?.businessName ||
    dealerStatus?.businessName ||
    dealerStatus?.dealer?.name ||
    "Dealer";

  // -----------------------------------------
  // DEALER LOGO
  // -----------------------------------------
  // profileApi.updateLogo() uploads under the "logo" field,
  // but getProfile() returns the stored URL as profile.logoUrl.
  const dealerLogoUrl = profile?.logoUrl || null;

  // Reset the "broken image" flag whenever the logo URL changes
  // (e.g. dealer uploads a new one and profile state updates).
  useEffect(() => {
    setLogoError(false);
  }, [dealerLogoUrl]);

  // -----------------------------------------
  // SUBSCRIPTION / TIER
  // -----------------------------------------
  const tier =
    subscription?.planNameSnapshot ||
    dealerStatus?.tier ||
    dealerStatus?.plan ||
    dealerStatus?.status ||
    "";

  // -----------------------------------------
  // BADGE COUNTS
  // -----------------------------------------
  const badgeCounts = {
    vehicles:
      dealerStatus?.counts?.vehicles ??
      user?.counts?.vehicles ??
      0,

    leads:
      dealerStatus?.counts?.leads ??
      user?.counts?.leads ??
      0,

    notifications:
      dealerStatus?.counts?.notifications ??
      user?.unreadNotifications ??
      0,
  };

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------
  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col overflow-hidden bg-slate-950 text-white transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* -----------------------------------------
            HEADER
        ----------------------------------------- */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <a
            href={USER_APP_URL}
            className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Go to GulfInCart home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
              G
            </div>

            <div>
              <p className="text-sm font-semibold">GulfInCart</p>
              <p className="text-xs text-slate-400">Dealer Dashboard</p>
            </div>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* -----------------------------------------
            DEALER PROFILE
        ----------------------------------------- */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-sm font-bold">
            {dealerLogoUrl && !logoError ? (
              <img
                src={dealerLogoUrl}
                alt={businessName}
                className="h-full w-full object-cover"
                onError={() => setLogoError(true)}
              />
            ) : (
              <Car size={18} />
            )}
          </div>

          {isLoading || profileLoading ? (
            <div className="space-y-1.5">
              <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
              <div className="h-2.5 w-24 animate-pulse rounded bg-white/10" />
            </div>
          ) : (
            <div className="min-w-0">
              {/* BUSINESS NAME */}
              <p
                className="truncate text-sm font-semibold leading-tight text-white"
                title={businessName}
              >
                {businessName}
              </p>

              {/* SUBSCRIPTION */}
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />

                <span className="truncate">
                  {tier || "Dealer"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* -----------------------------------------
            NAVIGATION
        ----------------------------------------- */}
        <div className="dealer-sidebar-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              const badge =
                item.badgeKey != null
                  ? badgeCounts[item.badgeKey]
                  : null;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-slate-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon size={18} />
                    {item.label}
                  </span>

                  {badge != null && badge > 0 && (
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">
                      {badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* -----------------------------------------
            SUBSCRIPTION
        ----------------------------------------- */}
        <div className="shrink-0 border-t border-white/10 p-4">
          {subscription ? (
            (() => {
              const totalDays = Number(
                subscription.daysTotal ||
                  subscription.durationDaysSnapshot ||
                  0
              );
              const daysRemaining = Number(
                subscription.daysRemaining ?? totalDays
              );
              const daysUsed = Number(
                subscription.daysUsed ??
                  Math.max(totalDays - daysRemaining, 0)
              );
              const usagePct = Math.min(
                100,
                totalDays > 0 ? Math.round((daysUsed / totalDays) * 100) : 0
              );

              return (
                <div className="rounded-xl bg-white/5 p-3">
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-400">
                    <Crown size={15} />

                    {subscription.planNameSnapshot}
                  </p>

                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{
                        width: `${usagePct}%`,
                      }}
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    {daysRemaining} of {totalDays} days remaining
                  </p>

                  {subscription.offerReason ? (
                    <p className="mt-1 text-[11px] leading-snug text-slate-500">
                      {subscription.offerReason}
                    </p>
                  ) : null}
                </div>
              );
            })()
          ) : (
            <div className="rounded-xl bg-white/5 p-3">
              <p className="text-sm text-slate-400">
                No active subscription
              </p>
            </div>
          )}
        </div>

        {/* -----------------------------------------
            LOGOUT
        ----------------------------------------- */}
        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
