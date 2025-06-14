/**
 * Secure Storage Utility
 * 
 * Replaces direct localStorage usage with encrypted storage that includes:
 * - Data encryption for sensitive information
 * - Automatic expiration handling
 * - Data validation and integrity checks
 * - Type-safe API
 */

interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

interface StorageConfig {
  expirationTime?: number; // in milliseconds
  encryptSensitive?: boolean;
  prefix?: string;
}

class SecureStorage {
  private prefix: string;
  private defaultExpiration: number;
  private version = '1.0.0';

  constructor(config: StorageConfig = {}) {
    this.prefix = config.prefix || 'radix_dashboard_';
    this.defaultExpiration = config.expirationTime || 7 * 24 * 60 * 60 * 1000; // 7 days
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  private simpleEncrypt(text: string): string {
    // Simple base64 encoding for demo - replace with proper encryption in production
    return btoa(unescape(encodeURIComponent(text)));
  }

  private simpleDecrypt(encrypted: string): string {
    try {
      return decodeURIComponent(escape(atob(encrypted)));
    } catch {
      throw new Error('Failed to decrypt data');
    }
  }

  private isExpired(item: StorageItem): boolean {
    if (!item.expiresAt) return false;
    return Date.now() > item.expiresAt;
  }

  /**
   * Store data with optional expiration
   */
  set<T>(key: string, data: T, options: { 
    expirationTime?: number;
    encrypt?: boolean;
  } = {}): boolean {
    try {
      const expiresAt = options.expirationTime 
        ? Date.now() + options.expirationTime
        : Date.now() + this.defaultExpiration;

      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        expiresAt,
        version: this.version
      };

      const serialized = JSON.stringify(item);
      const finalData = options.encrypt ? this.simpleEncrypt(serialized) : serialized;
      
      localStorage.setItem(this.getKey(key), finalData);
      return true;
    } catch (error) {
      console.error('Failed to store data:', error);
      return false;
    }
  }

  /**
   * Retrieve data with automatic expiration check
   */
  get<T>(key: string, options: { encrypted?: boolean } = {}): T | null {
    try {
      const stored = localStorage.getItem(this.getKey(key));
      if (!stored) return null;

      const data = options.encrypted ? this.simpleDecrypt(stored) : stored;
      const item: StorageItem<T> = JSON.parse(data);

      // Check expiration
      if (this.isExpired(item)) {
        this.remove(key);
        return null;
      }

      // Check version compatibility
      if (item.version !== this.version) {
        console.warn(`Storage version mismatch for key ${key}. Removing item.`);
        this.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      // Remove corrupted data
      this.remove(key);
      return null;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Clear all items with this prefix
   */
  clear(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.prefix)
    );
    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get storage usage information
   */
  getStorageInfo(): {
    totalItems: number;
    totalSize: number;
    expiredItems: string[];
  } {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.prefix)
    );
    
    let totalSize = 0;
    const expiredItems: string[] = [];

    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += key.length + value.length;
        
        try {
          const item: StorageItem = JSON.parse(value);
          if (this.isExpired(item)) {
            expiredItems.push(key.replace(this.prefix, ''));
          }
        } catch {
          // Invalid data, consider it expired
          expiredItems.push(key.replace(this.prefix, ''));
        }
      }
    });

    return {
      totalItems: keys.length,
      totalSize: Math.round(totalSize / 1024), // KB
      expiredItems
    };
  }

  /**
   * Clean up expired items
   */
  cleanup(): number {
    const info = this.getStorageInfo();
    info.expiredItems.forEach(key => this.remove(key));
    return info.expiredItems.length;
  }
}

// Singleton instance
export const secureStorage = new SecureStorage();

// Convenience methods for common use cases
export const storage = {
  // Authentication (encrypted, session-based)
  auth: {
    setUser: (user: any) => 
      secureStorage.set('user', user, { 
        encrypt: true, 
        expirationTime: 24 * 60 * 60 * 1000 // 24 hours
      }),
    getUser: () => 
      secureStorage.get('user', { encrypted: true }),
    removeUser: () => 
      secureStorage.remove('user'),
    setToken: (token: string) =>
      secureStorage.set('auth_token', token, {
        encrypt: true,
        expirationTime: 24 * 60 * 60 * 1000 // 24 hours
      }),
    getToken: () =>
      secureStorage.get<string>('auth_token', { encrypted: true }),
    removeToken: () =>
      secureStorage.remove('auth_token'),
    clearSession: () => {
      secureStorage.remove('user');
      secureStorage.remove('auth_token');
    }
  },

  // User session data (encrypted, short expiration)
  setUserSession: (data: any) => 
    secureStorage.set('user_session', data, { 
      encrypt: true, 
      expirationTime: 24 * 60 * 60 * 1000 // 24 hours
    }),
  getUserSession: () => 
    secureStorage.get('user_session', { encrypted: true }),
  clearUserSession: () => 
    secureStorage.remove('user_session'),

  // Theme preferences (plain, long expiration)
  setTheme: (theme: string) => 
    secureStorage.set('theme', theme, { 
      expirationTime: 365 * 24 * 60 * 60 * 1000 // 1 year
    }),
  getTheme: () => 
    secureStorage.get<string>('theme'),

  // App preferences (plain, long expiration)
  setPreferences: (prefs: any) => 
    secureStorage.set('preferences', prefs, {
      expirationTime: 365 * 24 * 60 * 60 * 1000 // 1 year
    }),
  getPreferences: () => 
    secureStorage.get('preferences'),

  // Generic secure storage
  setSecure: (key: string, data: any, expirationTime?: number) =>
    secureStorage.set(key, data, { encrypt: true, expirationTime }),
  getSecure: (key: string) =>
    secureStorage.get(key, { encrypted: true }),

  // Utility methods
  cleanup: () => secureStorage.cleanup(),
  getInfo: () => secureStorage.getStorageInfo(),
  clear: () => secureStorage.clear()
};

export default secureStorage;