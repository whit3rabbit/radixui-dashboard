/**
 * Comprehensive TypeScript Types for Radix UI Dashboard
 * 
 * This file contains all the type definitions used throughout the application
 * to ensure type safety and better developer experience.
 */

// =============================================================================
// Core Application Types
// =============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'user' | 'moderator';
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// =============================================================================
// Theme System Types
// =============================================================================

export type ThemeMode = 'light' | 'dark' | 'dim' | 'contrast' | 'material';

export type RadixColor = 
  | 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand'
  | 'tomato' | 'red' | 'ruby' | 'crimson' | 'pink' | 'plum'
  | 'purple' | 'violet' | 'iris' | 'indigo' | 'blue' | 'cyan'
  | 'teal' | 'jade' | 'green' | 'grass' | 'bronze' | 'gold'
  | 'brown' | 'orange' | 'amber' | 'yellow' | 'lime' | 'mint'
  | 'sky';

export type RadixRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

export type RadixScaling = '90%' | '95%' | '100%' | '105%' | '110%';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  description: string;
  accentColor: RadixColor;
  grayColor: RadixColor;
  appearance: 'light' | 'dark' | 'inherit';
  radius?: RadixRadius;
  hasBackground?: boolean;
  highContrast?: boolean;
  preview: {
    primary: string;
    secondary: string;
    background: string;
  };
}

// =============================================================================
// Form and Validation Types
// =============================================================================

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | undefined;
}

export interface FormField<T = any> {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'switch';
  value: T;
  error?: string;
  touched?: boolean;
  validation?: ValidationRule<T>;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
}

export interface FormState<T extends Record<string, any> = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

export type FormValidator<T> = (values: T) => Partial<Record<keyof T, string>>;

// =============================================================================
// Data Table Types
// =============================================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  pinned?: 'left' | 'right' | null;
  resizable?: boolean;
}

export interface TableState<T = any> {
  data: T[];
  filteredData: T[];
  sortedData: T[];
  paginatedData: T[];
  searchTerm: string;
  sortColumn: string | null;
  sortDirection: SortDirection;
  currentPage: number;
  pageSize: number;
  selectedRows: Set<number>;
  totalRows: number;
  totalPages: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

// =============================================================================
// Component Prop Types
// =============================================================================

export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
  loadingComponent?: React.ReactNode;
}

export interface ErrorProps {
  error?: Error | string | null;
  onRetry?: () => void;
  fallback?: React.ReactNode;
}

export interface AsyncComponentProps extends LoadingProps, ErrorProps {
  data?: any;
  refetch?: () => Promise<void>;
}

// =============================================================================
// Navigation and Routing Types
// =============================================================================

export interface NavigationItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
  divider?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

// =============================================================================
// Notification and Toast Types
// =============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'destructive';
  }>;
  timestamp: Date;
  read?: boolean;
}

export interface ToastOptions {
  type?: NotificationType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// =============================================================================
// API and Data Fetching Types
// =============================================================================

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
  timestamp: string;
}

export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

export interface QueryState<T = any> {
  data: T | null;
  error: ApiError | null;
  status: QueryStatus;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  lastUpdated?: Date;
}

// =============================================================================
// Storage Types
// =============================================================================

export interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

export interface StorageConfig {
  expirationTime?: number;
  encryptSensitive?: boolean;
  prefix?: string;
}

export interface StorageInfo {
  totalItems: number;
  totalSize: number;
  expiredItems: string[];
}

// =============================================================================
// Chart and Analytics Types
// =============================================================================

export type ChartType = 'line' | 'area' | 'bar' | 'column' | 'pie' | 'donut' | 'scatter';

export interface ChartDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType;
}

export interface ChartConfig {
  title?: string;
  subtitle?: string;
  type: ChartType;
  series: ChartSeries[];
  colors?: string[];
  height?: number;
  width?: number;
  responsive?: boolean;
  legend?: {
    show: boolean;
    position: 'top' | 'bottom' | 'left' | 'right';
  };
  toolbar?: {
    show: boolean;
    tools?: string[];
  };
}

// =============================================================================
// Dashboard Specific Types
// =============================================================================

export interface DashboardCard {
  id: string;
  title: string;
  description?: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon?: React.ReactNode;
  color?: RadixColor;
  chart?: ChartConfig;
}

export interface DashboardWidget {
  id: string;
  type: 'card' | 'chart' | 'table' | 'list' | 'custom';
  title: string;
  size: {
    width: number;
    height: number;
  };
  position: {
    x: number;
    y: number;
  };
  data?: any;
  config?: any;
  refreshInterval?: number;
}

// =============================================================================
// Utility Types
// =============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ValueOf<T> = T[keyof T];

export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type NonNullable<T> = T extends null | undefined ? never : T;

// =============================================================================
// Responsive Design Types
// =============================================================================

export type Breakpoint = 'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

export interface ResponsiveConfig {
  breakpoints: Record<Breakpoint, string>;
  spacing: Record<string, string>;
  typography: Record<string, React.CSSProperties>;
}

// =============================================================================
// Event Handler Types
// =============================================================================

export type EventHandler<T = any> = (event: T) => void;

export type ChangeHandler<T = any> = (value: T) => void;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

export type AsyncChangeHandler<T = any> = (value: T) => Promise<void>;

// =============================================================================
// Context Types
// =============================================================================

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse>;
  register: (email: string, password: string, name: string) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<ApiResponse>;
  refreshToken: () => Promise<boolean>;
}

export interface ThemeContextType {
  theme: ThemeMode;
  themeConfig: ThemeConfig;
  availableThemes: ThemeConfig[];
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  getSystemTheme: () => 'light' | 'dark';
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export interface ToastContextType {
  toasts: Notification[];
  addToast: (message: string, options?: ToastOptions) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
}

// =============================================================================
// Export all types
// =============================================================================

export default {
  // Re-export everything for convenience
};

// Type guards and utility functions
export const isValidEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isNonEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => {
  return key in obj;
};