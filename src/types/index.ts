// This comment already exists and is good.
/**
 * Comprehensive TypeScript Types for Radix UI Dashboard
 *
 * This file contains all the type definitions used throughout the application
 * to ensure type safety and better developer experience.
 */

// =============================================================================
// Core Application Types
// =============================================================================

/**
 * @interface User
 * @description Represents a user in the application.
 * @property {string} id - Unique identifier for the user.
 * @property {string} email - User's email address (should be unique).
 * @property {string} name - User's full name or display name.
 * @property {string} [avatar] - URL to the user's avatar image.
 * @property {'admin' | 'user' | 'moderator'} [role] - The role of the user, determining permissions.
 * @property {string} [createdAt] - ISO date string of when the user account was created.
 * @property {string} [updatedAt] - ISO date string of when the user account was last updated.
 * @property {string} [lastLoginAt] - ISO date string of the user's last login.
 */
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

/**
 * @interface Session
 * @description Represents an active user session.
 * @property {User} user - The authenticated user object.
 * @property {string} token - The authentication token (e.g., JWT).
 * @property {string} expiresAt - ISO date string indicating when the session/token expires.
 */
export interface Session {
  user: User;
  token: string;
  expiresAt: string;
}

/**
 * @interface ApiResponse
 * @description A generic structure for API responses.
 * @template T - The type of the data payload in a successful response.
 * @property {boolean} success - Indicates if the API call was successful.
 * @property {T} [data] - The data returned by the API on success.
 * @property {string} [error] - An error code or type string if the call failed.
 * @property {string} [message] - A descriptive message, often used for errors or informational responses.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * @interface PaginatedResponse
 * @extends ApiResponse
 * @description Represents an API response for endpoints that return paginated data.
 * @template T - The type of the items in the paginated list.
 * @property {object} pagination - Metadata about the pagination.
 * @property {number} pagination.page - The current page number.
 * @property {number} pagination.limit - The number of items per page.
 * @property {number} pagination.total - The total number of items available.
 * @property {number} pagination.totalPages - The total number of pages.
 */
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

/**
 * @typedef {'light' | 'dark' | 'dim' | 'contrast' | 'material'} ThemeMode
 * @description Defines the available theme modes for the application.
 */
export type ThemeMode = 'light' | 'dark' | 'dim' | 'contrast' | 'material';

/**
 * @typedef RadixColor
 * @description Represents the available color palettes in Radix UI.
 * Used for accent colors, gray scales, etc.
 */
export type RadixColor =
  | 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand'
  | 'tomato' | 'red' | 'ruby' | 'crimson' | 'pink' | 'plum'
  | 'purple' | 'violet' | 'iris' | 'indigo' | 'blue' | 'cyan'
  | 'teal' | 'jade' | 'green' | 'grass' | 'bronze' | 'gold'
  | 'brown' | 'orange' | 'amber' | 'yellow' | 'lime' | 'mint'
  | 'sky';

/**
 * @typedef {'none' | 'small' | 'medium' | 'large' | 'full'} RadixRadius
 * @description Defines the border radius options available in Radix UI themes.
 */
export type RadixRadius = 'none' | 'small' | 'medium' | 'large' | 'full';

/**
 * @typedef {'90%' | '95%' | '100%' | '105%' | '110%'} RadixScaling
 * @description Defines the UI scaling options available in Radix UI themes.
 */
export type RadixScaling = '90%' | '95%' | '100%' | '105%' | '110%';

/**
 * @interface ThemeConfig
 * @description Detailed configuration for a specific theme.
 * @property {ThemeMode} id - Unique identifier for the theme.
 * @property {string} name - Display name of the theme.
 * @property {string} description - A short description of the theme.
 * @property {RadixColor} accentColor - The Radix color used as the accent color.
 * @property {RadixColor} grayColor - The Radix color used for gray tones.
 * @property {'light' | 'dark' | 'inherit'} appearance - Base appearance mode ('light' or 'dark'). 'inherit' means it follows system preference.
 * @property {RadixRadius} [radius] - Default border radius for components.
 * @property {boolean} [hasBackground] - Whether the theme applies a background color to the body by default.
 * @property {boolean} [highContrast] - Whether this theme is a high-contrast variant.
 * @property {object} preview - Color values used for generating theme previews in UI selectors.
 * @property {string} preview.primary - Primary preview color (hex).
 * @property {string} preview.secondary - Secondary preview color (hex).
 * @property {string} preview.background - Background preview color or gradient (hex/css).
 */
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

/**
 * @interface ValidationRule
 * @description Defines rules for validating a form field.
 * @template T - The type of the field's value.
 * @property {boolean} [required] - If true, the field must have a value.
 * @property {number} [minLength] - Minimum length for string values.
 * @property {number} [maxLength] - Maximum length for string values.
 * @property {RegExp} [pattern] - A regular expression the value must match.
 * @property {(value: T) => string | undefined} [custom] - A custom validation function. Returns an error message string if invalid, undefined otherwise.
 */
export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | undefined;
}

/**
 * @interface FormField
 * @description Represents the state and configuration of a single form field.
 * @template T - The type of the field's value.
 * @property {string} name - The name of the field (used as a key in form state).
 * @property {string} label - The display label for the field.
 * @property {'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'switch'} type - The type of input field.
 * @property {T} value - The current value of the field.
 * @property {string} [error] - An error message for this field, if any.
 * @property {boolean} [touched] - True if the user has interacted with the field.
 * @property {ValidationRule<T>} [validation] - Validation rules for this field.
 * @property {string} [placeholder] - Placeholder text for the input.
 * @property {string} [helperText] - Additional text displayed below the field.
 * @property {boolean} [disabled] - If true, the field is disabled.
 * @property {Array<{ value: string; label: string; disabled?: boolean }>} [options] - Options for select fields.
 */
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

/**
 * @interface FormState
 * @description Represents the overall state of a form.
 * @template T - An object type where keys are field names and values are field values.
 * @property {T} values - Current values of all fields in the form.
 * @property {Partial<Record<keyof T, string>>} errors - Validation errors for each field.
 * @property {Partial<Record<keyof T, boolean>>} touched - Which fields have been touched by the user.
 * @property {boolean} isValid - True if the entire form is valid.
 * @property {boolean} isSubmitting - True if the form is currently being submitted.
 * @property {boolean} isDirty - True if any field value has changed from its initial state.
 */
export interface FormState<T extends Record<string, any> = Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

/**
 * @typedef FormValidator
 * @description A function type for validating an entire form's values.
 * @template T - The type of the form's values object.
 * @param {T} values - The current form values.
 * @returns {Partial<Record<keyof T, string>>} An object containing error messages for invalid fields.
 */
export type FormValidator<T> = (values: T) => Partial<Record<keyof T, string>>;

// =============================================================================
// Data Table Types
// =============================================================================

/**
 * @typedef {'asc' | 'desc' | null} SortDirection
 * @description Represents the direction of sorting for a table column. `null` means no sorting.
 */
export type SortDirection = 'asc' | 'desc' | null;

/**
 * @interface TableColumn
 * @description Configuration for a column in a data table.
 * @template T - The type of data for each row in the table.
 * @property {keyof T | string} key - The key in the row data object for this column, or a unique string.
 * @property {string} header - The text displayed in the column header.
 * @property {boolean} [sortable] - If true, the column can be sorted.
 * @property {boolean} [searchable] - (Not typically used directly in column defs, search is usually table-wide) If true, this column's data is included in searches.
 * @property {string} [width] - Fixed or percentage width of the column (e.g., "150px", "20%").
 * @property {string} [minWidth] - Minimum width of the column.
 * @property {string} [maxWidth] - Maximum width of the column.
 * @property {(value: any, row: T, index: number) => React.ReactNode} [render] - Custom render function for cells in this column.
 * @property {'left' | 'center' | 'right'} [align] - Text alignment for cells in this column.
 * @property {boolean} [hidden] - If true, the column is hidden by default.
 * @property {'left' | 'right' | null} [pinned] - If set, pins the column to the left or right.
 * @property {boolean} [resizable] - If true, the column width can be resized by the user.
 */
export interface TableColumn<T = any> {
  key: keyof T | string; // `string` allows for accessor paths like 'customer.name'
  header: string;
  sortable?: boolean;
  searchable?: boolean; // Usually, search is on the whole table or specific fields configured elsewhere
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hidden?: boolean;
  pinned?: 'left' | 'right' | null;
  resizable?: boolean;
}

/**
 * @interface TableState
 * @description Represents the internal state of a data table component.
 * @template T - The type of data for each row.
 * @property {T[]} data - The original unfiltered and unsorted data.
 * @property {T[]} filteredData - Data after applying search filters.
 * @property {T[]} sortedData - Data after applying sorting.
 * @property {T[]} paginatedData - The subset of data currently visible on the page.
 * @property {string} searchTerm - The current search term.
 * @property {string | null} sortColumn - The key of the column currently being sorted.
 * @property {SortDirection} sortDirection - The current sort direction.
 * @property {number} currentPage - The current page number.
 * @property {number} pageSize - The number of rows per page.
 * @property {Set<number>} selectedRows - A set of indices of the selected rows (from `paginatedData` or `data`).
 * @property {number} totalRows - Total number of rows after filtering.
 * @property {number} totalPages - Total number of pages.
 */
export interface TableState<T = any> {
  data: T[];
  filteredData: T[];
  sortedData: T[];
  paginatedData: T[];
  searchTerm: string;
  sortColumn: string | null; // Typically keyof T or string if using accessor paths
  sortDirection: SortDirection;
  currentPage: number;
  pageSize: number;
  selectedRows: Set<number>; // Indices or IDs of selected rows
  totalRows: number;
  totalPages: number;
}

/**
 * @interface PaginationOptions
 * @description Options for fetching paginated data from an API.
 * @property {number} page - The page number to fetch.
 * @property {number} limit - The number of items per page.
 * @property {string} [sortBy] - The field to sort by.
 * @property {'asc' | 'desc'} [sortOrder] - The sort order.
 * @property {string} [search] - A search query string.
 * @property {Record<string, any>} [filters] - Additional filters to apply.
 */
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

/**
 * @interface BaseComponentProps
 * @description Common props applicable to many React components.
 * @property {string} [className] - Additional CSS class names.
 * @property {React.CSSProperties} [style] - Inline CSS styles.
 * @property {React.ReactNode} [children] - Child elements.
 */
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/**
 * @interface LoadingProps
 * @description Props related to loading states for components.
 * @property {boolean} [loading] - If true, the component is in a loading state.
 * @property {string} [loadingText] - Text to display during loading.
 * @property {React.ReactNode} [loadingComponent] - A custom component to render for the loading state.
 */
export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
  loadingComponent?: React.ReactNode;
}

/**
 * @interface ErrorProps
 * @description Props related to error states for components.
 * @property {Error | string | null} [error] - The error object or message.
 * @property {() => void} [onRetry] - Callback function to retry an action after an error.
 * @property {React.ReactNode} [fallback] - A custom component to render for the error state.
 */
export interface ErrorProps {
  error?: Error | string | null;
  onRetry?: () => void;
  fallback?: React.ReactNode;
}

/**
 * @interface AsyncComponentProps
 * @extends LoadingProps, ErrorProps
 * @description Props for components that handle asynchronous operations, combining loading and error states.
 * @property {any} [data] - The data fetched by the async operation.
 * @property {() => Promise<void>} [refetch] - Function to re-trigger the async operation.
 */
export interface AsyncComponentProps extends LoadingProps, ErrorProps {
  data?: any;
  refetch?: () => Promise<void>;
}

// =============================================================================
// Navigation and Routing Types
// =============================================================================

/**
 * @interface NavigationItem
 * @description Represents an item in a navigation menu (e.g., sidebar, topbar).
 * @property {string} id - Unique identifier for the navigation item.
 * @property {string} label - Display text for the item.
 * @property {React.ReactNode} [icon] - Icon to display next to the label.
 * @property {string} [path] - The URL path this item links to.
 * @property {NavigationItem[]} [children] - Sub-items for creating nested menus.
 * @property {string | number} [badge] - A badge to display next to the item (e.g., notification count).
 * @property {boolean} [disabled] - If true, the item is disabled.
 * @property {boolean} [external] - If true, the link opens in a new tab.
 * @property {boolean} [divider] - If true, a divider is rendered before this item (or use a dedicated divider type).
 */
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

/**
 * @interface BreadcrumbItem
 * @description Represents an item in a breadcrumb trail.
 * @property {string} label - Display text for the breadcrumb link.
 * @property {string} [path] - The URL path this breadcrumb item links to. If undefined, it's usually the current page.
 * @property {React.ReactNode} [icon] - Optional icon for the breadcrumb item.
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

// =============================================================================
// Notification and Toast Types
// =============================================================================

/**
 * @typedef {'success' | 'error' | 'warning' | 'info'} NotificationType
 * @description Defines the types of notifications or toasts, influencing their appearance and icon.
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * @interface Notification
 * @description Represents a notification message, often displayed in a notification center or as a toast.
 * @property {string} id - Unique identifier for the notification.
 * @property {NotificationType} type - The type of notification.
 * @property {string} title - The main title of the notification.
 * @property {string} [message] - A more detailed message or description.
 * @property {number} [duration] - How long the notification should be visible (in ms). 0 or undefined means persistent until manually dismissed.
 * @property {boolean} [persistent] - If true, the notification must be manually dismissed.
 * @property {Array<{ label: string; action: () => void; variant?: 'default' | 'destructive'; }>} [actions] - Optional action buttons for the notification.
 * @property {Date} timestamp - When the notification was generated.
 * @property {boolean} [read] - If true, the notification has been read by the user.
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number; // in milliseconds
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
    variant?: 'default' | 'destructive'; // For styling action buttons
  }>;
  timestamp: Date;
  read?: boolean;
}

/**
 * @interface ToastOptions
 * @description Options for configuring a toast notification.
 * @property {NotificationType} [type] - The type of toast.
 * @property {number} [duration] - Duration in ms for the toast to be visible.
 * @property {{ label: string; onClick: () => void; }} [action] - An optional action button on the toast.
 * @property {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} [position] - Where the toast should appear on screen.
 */
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

/**
 * @interface RequestConfig
 * @description Configuration for making an API request.
 * @property {string} url - The URL for the API endpoint.
 * @property {'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'} [method] - HTTP method.
 * @property {Record<string, string>} [headers] - Request headers.
 * @property {Record<string, any>} [params] - URL query parameters.
 * @property {any} [data] - Request body data (for POST, PUT, PATCH).
 * @property {number} [timeout] - Request timeout in milliseconds.
 */
export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

/**
 * @interface ApiError
 * @description Represents an error returned from an API.
 * @property {string} message - The primary error message.
 * @property {string | number} [code] - A specific error code from the API.
 * @property {any} [details] - Additional details or validation errors.
 * @property {string} timestamp - ISO date string of when the error occurred on the server.
 */
export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
  timestamp: string;
}

/**
 * @typedef {'idle' | 'loading' | 'success' | 'error'} QueryStatus
 * @description Represents the status of an asynchronous data query.
 */
export type QueryStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * @interface QueryState
 * @description Represents the state of a data query (e.g., from React Query or Apollo).
 * @template T - The type of the data being queried.
 * @property {T | null} data - The fetched data, or null if not yet fetched or an error occurred.
 * @property {ApiError | null} error - An API error object if the query failed.
 * @property {QueryStatus} status - The current status of the query.
 * @property {boolean} isLoading - True if the query is currently loading.
 * @property {boolean} isError - True if the query resulted in an error.
 * @property {boolean} isSuccess - True if the query completed successfully.
 * @property {Date} [lastUpdated] - Timestamp of when the data was last successfully fetched.
 */
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
// Storage Types (already defined in secure-storage.ts, re-included for completeness if this is a central types file)
// =============================================================================

// Assuming StorageItem, StorageConfig, StorageInfo are potentially re-defined or imported
// from secure-storage.ts. If they are identical, they can be removed from here to avoid duplication
// if secure-storage.ts is also part of the JSDoc generation scope and exports them.
// For now, keeping them as they were in the input for this file.

/**
 * @interface StorageItem
 * @description Defines the structure of an item stored by SecureStorage. (Potentially duplicated from secure-storage.ts)
 * @template T - The type of the data being stored.
 */
export interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

/**
 * @interface StorageConfig
 * @description Configuration options for the SecureStorage instance. (Potentially duplicated)
 */
export interface StorageConfig {
  expirationTime?: number;
  encryptSensitive?: boolean;
  prefix?: string;
}

/**
 * @interface StorageInfo
 * @description Information about storage usage. (Potentially duplicated)
 */
export interface StorageInfo {
  totalItems: number;
  totalSize: number;
  expiredItems: string[];
}

// =============================================================================
// Chart and Analytics Types
// =============================================================================

/**
 * @typedef {'line' | 'area' | 'bar' | 'column' | 'pie' | 'donut' | 'scatter'} ChartType
 * @description Defines the types of charts supported. 'column' is often an alias for 'bar' in vertical orientation.
 */
export type ChartType = 'line' | 'area' | 'bar' | 'column' | 'pie' | 'donut' | 'scatter';

/**
 * @interface ChartDataPoint
 * @description Represents a single data point in a chart series.
 * @property {string | number | Date} x - The x-coordinate value (e.g., category name, time).
 * @property {number} y - The y-coordinate value (e.g., numerical measurement).
 * @property {string} [label] - Optional label for this data point (e.g., for tooltips).
 * @property {string} [color] - Optional specific color for this data point.
 */
export interface ChartDataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
}

/**
 * @interface ChartSeries
 * @description Represents a series of data for a chart.
 * @property {string} name - Name of the series (e.g., displayed in legend).
 * @property {ChartDataPoint[]} data - Array of data points for this series.
 * @property {string} [color] - Color for this series.
 * @property {ChartType} [type] - Specific chart type for this series (for mixed-type charts).
 */
export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
  type?: ChartType; // Useful for mixed type charts
}

/**
 * @interface ChartConfig
 * @description Configuration options for rendering a chart.
 * @property {string} [title] - Main title of the chart.
 * @property {string} [subtitle] - Subtitle or additional description for the chart.
 * @property {ChartType} type - The primary type of chart to render.
 * @property {ChartSeries[]} series - The data series to display.
 * @property {string[]} [colors] - Array of color hex codes to use for different series.
 * @property {number} [height] - Height of the chart in pixels.
 * @property {number} [width] - Width of the chart in pixels.
 * @property {boolean} [responsive] - If true, the chart adapts to its container size.
 * @property {object} [legend] - Legend configuration.
 * @property {boolean} legend.show - Whether to display the legend.
 * @property {'top' | 'bottom' | 'left' | 'right'} legend.position - Position of the legend.
 * @property {object} [toolbar] - Toolbar configuration (e.g., for zoom, pan, export).
 * @property {boolean} toolbar.show - Whether to display the toolbar.
 * @property {string[]} [tools] - Specific tools to include in the toolbar.
 */
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
    tools?: string[]; // e.g., ['zoom', 'pan', 'download']
  };
}

// =============================================================================
// Dashboard Specific Types
// =============================================================================

/**
 * @interface DashboardCard
 * @description Represents a summary card displayed on the dashboard.
 * @property {string} id - Unique identifier for the card.
 * @property {string} title - Title of the card.
 * @property {string} [description] - Optional description or context for the card's value.
 * @property {string | number} value - The main value displayed on the card.
 * @property {object} [change] - Information about the change in value compared to a previous period.
 * @property {number} change.value - The percentage or absolute change.
 * @property {'increase' | 'decrease'} change.type - Whether the change is an increase or decrease.
 * @property {string} change.period - The period the change is compared against (e.g., "last month").
 * @property {React.ReactNode} [icon] - Icon to display on the card.
 * @property {RadixColor} [color] - Radix color associated with the card or its icon.
 * @property {ChartConfig} [chart] - Optional mini-chart configuration to display on the card.
 */
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
  chart?: ChartConfig; // For sparklines or small charts on cards
}

/**
 * @interface DashboardWidget
 * @description Represents a configurable widget on a customizable dashboard.
 * @property {string} id - Unique identifier for the widget.
 * @property {'card' | 'chart' | 'table' | 'list' | 'custom'} type - The type of widget.
 * @property {string} title - Title of the widget.
 * @property {{ width: number; height: number; }} size - Grid dimensions (e.g., column/row span).
 * @property {{ x: number; y: number; }} position - Grid position (e.g., x/y coordinates).
 * @property {any} [data] - Data specific to this widget instance.
 * @property {any} [config] - Configuration specific to this widget instance (e.g., chart type, columns for table).
 * @property {number} [refreshInterval] - Refresh interval in seconds for auto-updating widget data.
 */
export interface DashboardWidget {
  id: string;
  type: 'card' | 'chart' | 'table' | 'list' | 'custom';
  title: string;
  size: { // e.g., in grid units
    width: number;
    height: number;
  };
  position: { // e.g., in grid units
    x: number;
    y: number;
  };
  data?: any; // Could be specific, e.g., DashboardCard data or ChartConfig
  config?: any; // Widget-specific configuration
  refreshInterval?: number; // in seconds
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * @typedef Optional
 * @description Makes specified keys `K` of type `T` optional.
 * @template T - The original type.
 * @template K - Keys of `T` to make optional.
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * @typedef RequiredKeys
 * @description Makes specified keys `K` of type `T` required (if they were optional).
 * @template T - The original type.
 * @template K - Keys of `T` to make required.
 */
export type RequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * @typedef DeepPartial
 * @description Recursively makes all properties of type `T` optional.
 * @template T - The original type.
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * @typedef ValueOf
 * @description Gets the union type of all values in an object type `T`.
 * @template T - The object type.
 */
export type ValueOf<T> = T[keyof T];

/**
 * @typedef StringKeys
 * @description Extracts keys of type `T` whose values are strings.
 * @template T - The object type.
 */
export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

/**
 * @typedef NonNullable
 * @description Excludes `null` and `undefined` from type `T`.
 * @template T - The original type.
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

// =============================================================================
// Responsive Design Types
// =============================================================================

/**
 * @typedef {'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'} Breakpoint
 * @description Defines common breakpoints for responsive design.
 * 'initial' usually refers to the smallest screen size.
 */
export type Breakpoint = 'initial' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * @typedef ResponsiveValue
 * @description Allows a CSS property to have a single value or different values for different breakpoints.
 * @template T - The type of the CSS property's value.
 * @example
 * // ResponsiveValue<string> for `display` property:
 * // `block` (applies to all breakpoints)
 * // `{ initial: 'block', md: 'flex' }` (block on small screens, flex on medium and up)
 */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/**
 * @interface ResponsiveConfig
 * @description Configuration for the responsive design system.
 * @property {Record<Breakpoint, string>} breakpoints - Mapping of breakpoint names to min-width values (e.g., `{ sm: '640px', md: '768px' }`).
 * @property {Record<string, string>} spacing - Mapping of spacing keys to actual values (e.g., `{ '1': '4px', '2': '8px' }`).
 * @property {Record<string, React.CSSProperties>} typography - Predefined typography styles.
 */
export interface ResponsiveConfig {
  breakpoints: Record<Breakpoint, string>; // e.g., { sm: '640px', md: '768px', ... }
  spacing: Record<string, string>;       // e.g., { '1': '0.25rem', '2': '0.5rem', ... }
  typography: Record<string, React.CSSProperties>; // e.g., { h1: { fontSize: '2rem', fontWeight: 'bold' }, ...}
}

// =============================================================================
// Event Handler Types
// =============================================================================

/**
 * @typedef EventHandler
 * @description Generic event handler function type.
 * @template T - The type of the event object.
 */
export type EventHandler<T = any> = (event: T) => void;

/**
 * @typedef ChangeHandler
 * @description Generic change handler function type, often for controlled inputs.
 * @template T - The type of the value being changed.
 */
export type ChangeHandler<T = any> = (value: T) => void;

/**
 * @typedef AsyncEventHandler
 * @description Generic asynchronous event handler function type.
 * @template T - The type of the event object.
 */
export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

/**
 * @typedef AsyncChangeHandler
 * @description Generic asynchronous change handler function type.
 * @template T - The type of the value being changed.
 */
export type AsyncChangeHandler<T = any> = (value: T) => Promise<void>;

// =============================================================================
// Context Types (Ensure these match the actual context definitions)
// =============================================================================

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context.
 * (This should match the definition in `auth-context.tsx`)
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse>; // Assuming ApiResponse from this file
  register: (email: string, password: string, name: string) => Promise<ApiResponse>;
  logout: () => Promise<void>; // Or void if not async
  updateProfile: (updates: Partial<User>) => Promise<ApiResponse>;
  refreshToken?: () => Promise<boolean>; // Optional refresh token functionality
}

/**
 * @interface ThemeContextType
 * @description Defines the shape of the theme context.
 * (This should match the definition in `theme-context.tsx`)
 */
export interface ThemeContextType {
  theme: ThemeMode; // Assuming ThemeMode from this file
  themeConfig: ThemeConfig; // Assuming ThemeConfig from this file
  availableThemes: ThemeConfig[];
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  getSystemTheme: () => 'light' | 'dark';
}

/**
 * @interface NotificationContextType
 * @description Defines the shape of a notification context (if one exists for a global notification center).
 * (This should match the definition if such a context exists, e.g. for `NotificationCenter.tsx`)
 */
export interface NotificationContextType {
  notifications: Notification[]; // Assuming Notification from this file
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

/**
 * @interface ToastContextType
 * @description Defines the shape of the toast notification context.
 * (This should match the definition in `toast-context.tsx`)
 * Note: `toasts` property uses `Notification[]` here, but `toast-context.tsx` uses `ToastMessage[]`.
 *       Aligning with `Notification` from this file for consistency if `ToastMessage` is similar.
 *       If `ToastMessage` from `toast-context.tsx` is different, it should be imported and used.
 */
export interface ToastContextType {
  toasts: Notification[]; // Or specific ToastMessage type from toast-context.tsx
  addToast: (message: string, options?: ToastOptions) => string; // Assuming ToastOptions from this file
  removeToast: (id: string) => void;
  success: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type'>) => string;
}

// =============================================================================
// Export all types (Default export is not standard for .ts files, named exports are preferred)
// =============================================================================

// Removed default export:
// export default {
// // Re-export everything for convenience
// };
// Individual types are already exported. If a namespace object is desired, it can be constructed:
// export * as AppTypes from './index'; // Then use AppTypes.User, etc.

// =============================================================================
// Type guards and utility functions
// =============================================================================

/**
 * @function isValidEmail
 * @description Checks if a string is a valid email address using a regex.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  // Basic email regex, consider using a more robust one or a library for production.
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

/**
 * @function isValidUrl
 * @description Checks if a string is a valid URL.
 * @param {string} url - The URL string to validate.
 * @returns {boolean} True if the URL is valid, false otherwise.
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * @function isNonEmpty
 * @description Type guard to check if a value is not null or undefined.
 * @template T - The type of the value.
 * @param {T | null | undefined} value - The value to check.
 * @returns {value is T} True if the value is not null or undefined.
 */
export const isNonEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * @function hasProperty
 * @description Type guard to check if an object `obj` has a property `key`.
 * Narrows the type of `obj` to include the property `key`.
 * @template T - The type of the object.
 * @template K - The type of the key (property name).
 * @param {T} obj - The object to check.
 * @param {K} key - The key to check for.
 * @returns {obj is T & Record<K, unknown>} True if the object has the property.
 */
export const hasProperty = <T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> => {
  return key in obj;
};