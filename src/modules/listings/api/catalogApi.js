import apiClient from "../../../services/apiClient";

const BASE_URL = "/catalog";

export const getCategoryOptionsApi = async (params) => {
  const { data } = await apiClient.get(`${BASE_URL}/categories/options`, { params });
  return data.data;
};

export const getBrandOptionsApi = async (params) => {
  const { data } = await apiClient.get(`${BASE_URL}/brands/options`, { params });
  return data.data;
};

export const getCatalogModelOptionsApi = async (params) => {
  const { data } = await apiClient.get(`${BASE_URL}/models/options`, { params });
  return data.data;
};

export const getVariantOptionsApi = async (params) => {
  const { data } = await apiClient.get(`${BASE_URL}/variants/options`, { params });
  return data.data;
};

export const getFacetOptionOptionsApi = async (params) => {
  const { data } = await apiClient.get(`${BASE_URL}/facet-options/options`, { params });
  return data.data;
};

export const getListingAttributeOptionsApi = async (params) => {
  const { data } = await apiClient.get(`${BASE_URL}/listing-attributes/options`, { params });
  return data.data;
};
