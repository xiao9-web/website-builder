import api from "@/lib/api";
import type {
  LeadDTO,
  NewsDTO,
  ProductServiceDTO,
  SiteMenuDTO,
  SiteConfigDTO,
  UpdateSiteConfigPayload,
  UpsertSiteMenuPayload,
  UpsertNewsPayload,
  UpsertProductServicePayload,
} from "./types";

export async function getSiteConfig(siteId: string): Promise<SiteConfigDTO> {
  return (await api.get(`/sites/${siteId}/config`)) as SiteConfigDTO;
}

export async function updateSiteConfig(
  siteId: string,
  payload: UpdateSiteConfigPayload,
): Promise<SiteConfigDTO> {
  return (await api.put(`/sites/${siteId}/config`, payload)) as SiteConfigDTO;
}

export async function listSiteMenus(siteId: string): Promise<SiteMenuDTO[]> {
  return (await api.get(`/sites/${siteId}/menus`)) as SiteMenuDTO[];
}

export async function createSiteMenu(
  siteId: string,
  payload: UpsertSiteMenuPayload,
): Promise<SiteMenuDTO> {
  return (await api.post(`/sites/${siteId}/menus`, payload)) as SiteMenuDTO;
}

export async function updateSiteMenu(
  siteId: string,
  menuId: number,
  payload: UpsertSiteMenuPayload,
): Promise<SiteMenuDTO> {
  return (await api.put(`/sites/${siteId}/menus/${menuId}`, payload)) as SiteMenuDTO;
}

export async function deleteSiteMenu(
  siteId: string,
  menuId: number,
): Promise<void> {
  await api.delete(`/sites/${siteId}/menus/${menuId}`);
}

export async function listProductServices(
  siteId: string,
): Promise<ProductServiceDTO[]> {
  return (await api.get(`/sites/${siteId}/products`)) as ProductServiceDTO[];
}

export async function createProductService(
  siteId: string,
  payload: UpsertProductServicePayload,
): Promise<ProductServiceDTO> {
  return (await api.post(
    `/sites/${siteId}/products`,
    payload,
  )) as ProductServiceDTO;
}

export async function updateProductService(
  siteId: string,
  productId: number,
  payload: UpsertProductServicePayload,
): Promise<ProductServiceDTO> {
  return (await api.put(
    `/sites/${siteId}/products/${productId}`,
    payload,
  )) as ProductServiceDTO;
}

export async function deleteProductService(
  siteId: string,
  productId: number,
): Promise<void> {
  await api.delete(`/sites/${siteId}/products/${productId}`);
}

export async function updateProductEnabled(
  siteId: string,
  productId: number,
  enabled: boolean,
): Promise<ProductServiceDTO> {
  return (await api.patch(`/sites/${siteId}/products/${productId}/enabled`, {
    enabled,
  })) as ProductServiceDTO;
}

export async function listNews(siteId: string): Promise<NewsDTO[]> {
  return (await api.get(`/sites/${siteId}/news`)) as NewsDTO[];
}

export async function createNews(
  siteId: string,
  payload: UpsertNewsPayload,
): Promise<NewsDTO> {
  return (await api.post(`/sites/${siteId}/news`, payload)) as NewsDTO;
}

export async function updateNews(
  siteId: string,
  newsId: number,
  payload: UpsertNewsPayload,
): Promise<NewsDTO> {
  return (await api.put(`/sites/${siteId}/news/${newsId}`, payload)) as NewsDTO;
}

export async function deleteNews(siteId: string, newsId: number): Promise<void> {
  await api.delete(`/sites/${siteId}/news/${newsId}`);
}

export async function updateNewsStatus(
  siteId: string,
  newsId: number,
  status: NewsDTO["status"],
): Promise<NewsDTO> {
  return (await api.patch(`/sites/${siteId}/news/${newsId}/status`, {
    status,
  })) as NewsDTO;
}

export async function listLeads(siteId: string): Promise<LeadDTO[]> {
  return (await api.get(`/sites/${siteId}/leads`)) as LeadDTO[];
}

export async function updateLeadStatus(
  siteId: string,
  leadId: number,
  status: LeadDTO["status"],
): Promise<LeadDTO> {
  return (await api.patch(`/sites/${siteId}/leads/${leadId}/status`, {
    status,
  })) as LeadDTO;
}
