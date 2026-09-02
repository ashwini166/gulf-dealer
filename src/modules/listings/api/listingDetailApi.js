import apiClient from "../../../services/apiClient";

const BASE_URL = "/vehicle-listings";

export const getListingDetailApi = async (listingId) => {
  const res = await apiClient.get(`${BASE_URL}/${listingId}`);
  return res.data.data;
};

export const saveListingStepApi = async (listingId, step, payload) => {
  const res = await apiClient.patch(`${BASE_URL}/${listingId}/step/${step}`, payload);
  return res.data.data;
};

export const resubmitListingApi = async (listingId) => {
  const res = await apiClient.post(`${BASE_URL}/${listingId}/resubmit`);
  return res.data.data;
};

export const purchaseListingPlanApi = async (planId, options = {}) => {
  const res = await apiClient.post("/user-subscriptions/purchase", {
    planId,
    listingId: options.listingId || null,
    useWalletBalance: Boolean(options.useWalletBalance),
  });
  return res.data.data;
};

export const getMyWalletApi = async () => {
  const res = await apiClient.get("/wallet/me");
  return res.data.data;
};

export const getPaymentStatusApi = async (paymentId) => {
  const res = await apiClient.get(`/payments/${paymentId}/status`);
  return res.data.data;
};
