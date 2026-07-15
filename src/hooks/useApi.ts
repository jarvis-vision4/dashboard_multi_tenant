import useSWR, { mutate } from 'swr';
import { api } from '@/lib/api';
import type {
  Tenant,
  User,
  Subscription,
  WebhookEndpoint,
  WebhookDelivery,
  Job,
  ApiResponse,
  PaginatedResponse,
  CreateTenantRequest,
  UpdateTenantRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateSubscriptionRequest,
  CreateWebhookRequest,
} from '@/types';

async function fetcher<T>(url: string, tenantId?: string): Promise<T> {
  const response = await api.get<ApiResponse<T>>(url, undefined, tenantId);
  return response.data.data;
}

export function useTenants(page = 1, limit = 10) {
  return useSWR<PaginatedResponse<Tenant>>(
    `/tenants?page=${page}&limit=${limit}`,
    (url: string) => fetcher<PaginatedResponse<Tenant>>(url)
  );
}

export function useTenant(id: string) {
  return useSWR<Tenant>(id ? `/tenants/${id}` : null, (url: string) =>
    fetcher<Tenant>(url)
  );
}

export async function createTenant(data: CreateTenantRequest) {
  const response = await api.post<ApiResponse<Tenant>>('/tenants', data);
  await mutate('/tenants');
  return response.data.data;
}

export async function updateTenant(id: string, data: UpdateTenantRequest) {
  const response = await api.put<ApiResponse<Tenant>>(`/tenants/${id}`, data);
  await mutate(`/tenants/${id}`);
  await mutate('/tenants');
  return response.data.data;
}

export async function deleteTenant(id: string) {
  const response = await api.delete<ApiResponse<{ message: string }>>(
    `/tenants/${id}`
  );
  await mutate('/tenants');
  return response.data.data;
}

export function useUsers(tenantId?: string, page = 1, limit = 10) {
  return useSWR<PaginatedResponse<User>>(
    tenantId ? `/users?page=${page}&limit=${limit}` : null,
    (url: string) => fetcher<PaginatedResponse<User>>(url, tenantId)
  );
}

export function useUser(tenantId?: string, id?: string) {
  return useSWR<User>(tenantId && id ? `/users/${id}` : null, (url: string) =>
    fetcher<User>(url, tenantId)
  );
}

export async function createUser(tenantId: string, data: CreateUserRequest) {
  const response = await api.post<ApiResponse<User>>('/users', data, tenantId);
  await mutate(
    (key: any) => typeof key === 'string' && key.startsWith('/users')
  );
  return response.data.data;
}

export async function updateUser(
  tenantId: string,
  id: string,
  data: UpdateUserRequest
) {
  const response = await api.put<ApiResponse<User>>(
    `/users/${id}`,
    data,
    tenantId
  );
  await mutate(
    (key: any) => typeof key === 'string' && key.startsWith('/users')
  );
  return response.data.data;
}

export async function deleteUser(tenantId: string, id: string) {
  const response = await api.delete<ApiResponse<{ message: string }>>(
    `/users/${id}`,
    tenantId
  );
  await mutate(
    (key: any) => typeof key === 'string' && key.startsWith('/users')
  );
  return response.data.data;
}

export function useSubscription(tenantId?: string) {
  return useSWR<Subscription>(
    tenantId ? `/subscriptions` : null,
    (url: string) => fetcher<Subscription>(url, tenantId)
  );
}

export async function updateSubscription(
  tenantId: string,
  data: UpdateSubscriptionRequest
) {
  const response = await api.put<ApiResponse<Subscription>>(
    '/subscriptions',
    data,
    tenantId
  );
  await mutate('/subscriptions');
  return response.data.data;
}

export async function cancelSubscription(tenantId: string) {
  const response = await api.post<ApiResponse<Subscription>>(
    '/subscriptions/cancel',
    {},
    tenantId
  );
  await mutate('/subscriptions');
  return response.data.data;
}

export function useWebhooks(tenantId?: string) {
  return useSWR<WebhookEndpoint[]>(
    tenantId ? `/webhooks` : null,
    (url: string) => fetcher<WebhookEndpoint[]>(url, tenantId)
  );
}

export function useWebhook(tenantId?: string, id?: string) {
  return useSWR<WebhookEndpoint>(
    tenantId && id ? `/webhooks/${id}` : null,
    (url: string) => fetcher<WebhookEndpoint>(url, tenantId)
  );
}

export function useWebhookDeliveries(tenantId: string, webhookId: string) {
  return useSWR<WebhookDelivery[]>(
    tenantId && webhookId ? `/webhooks/${webhookId}/deliveries` : null,
    (url: string) => fetcher<WebhookDelivery[]>(url, tenantId)
  );
}

export async function createWebhook(
  tenantId: string,
  data: CreateWebhookRequest
) {
  const response = await api.post<ApiResponse<WebhookEndpoint>>(
    '/webhooks',
    data,
    tenantId
  );
  await mutate('/webhooks');
  return response.data.data;
}

export async function deleteWebhook(tenantId: string, id: string) {
  const response = await api.delete<ApiResponse<{ message: string }>>(
    `/webhooks/${id}`,
    tenantId
  );
  await mutate('/webhooks');
  return response.data.data;
}

export function useJobs(tenantId?: string, page = 1, limit = 10) {
  return useSWR<PaginatedResponse<Job>>(
    tenantId ? `/jobs?page=${page}&limit=${limit}` : null,
    (url: string) => fetcher<PaginatedResponse<Job>>(url, tenantId)
  );
}

export function useJob(tenantId?: string, id?: string) {
  return useSWR<Job>(tenantId && id ? `/jobs/${id}` : null, (url: string) =>
    fetcher<Job>(url, tenantId)
  );
}

export async function dispatchWebhookEvent(
  tenantId: string,
  event: string,
  payload: Record<string, any>
) {
  const response = await api.post<ApiResponse<any>>(
    '/webhooks/dispatch',
    { event, payload },
    tenantId
  );
  return response.data.data;
}
