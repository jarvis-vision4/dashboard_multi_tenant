export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TENANT_ADMIN = 'TENANT_ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  TRIALING = 'TRIALING',
  INCOMPLETE = 'INCOMPLETE',
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DELAYED = 'DELAYED',
}

export enum WebhookEventType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  TENANT_CREATED = 'TENANT_CREATED',
  TENANT_UPDATED = 'TENANT_UPDATED',
  SUBSCRIPTION_CREATED = 'SUBSCRIPTION_CREATED',
  SUBSCRIPTION_UPDATED = 'SUBSCRIPTION_UPDATED',
  SUBSCRIPTION_CANCELED = 'SUBSCRIPTION_CANCELED',
  PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  tenantId: string;
  createdAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  status: TenantStatus;
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    subscriptions: number;
    webhooks: number;
  };
}

export interface Subscription {
  id: string;
  tenantId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  tenantId: string;
  url: string;
  secret: string;
  events: WebhookEventType[];
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    deliveries: number;
  };
  deliveries?: WebhookDelivery[];
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  eventType: WebhookEventType;
  payload: Record<string, any>;
  responseStatus?: number;
  responseBody?: string;
  attempt: number;
  maxAttempts: number;
  status: JobStatus;
  errorMessage?: string;
  nextRetryAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  tenantId: string;
  type: string;
  payload: Record<string, any>;
  status: JobStatus;
  priority: number;
  attempts: number;
  maxAttempts: number;
  error?: string;
  result?: Record<string, any>;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
    path: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    statusCode: number;
    message: string;
    errors?: string[];
    path: string;
    timestamp: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CreateTenantRequest {
  name: string;
  slug: string;
  domain?: string;
  settings?: Record<string, any>;
}

export interface UpdateTenantRequest {
  name?: string;
  domain?: string;
  settings?: Record<string, any>;
  status?: TenantStatus;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface UpdateSubscriptionRequest {
  status?: SubscriptionStatus;
  stripePriceId?: string;
  cancelAtPeriodEnd?: boolean;
}

export interface CreateWebhookRequest {
  url: string;
  events: WebhookEventType[];
  description?: string;
}
