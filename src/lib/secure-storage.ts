/**
 * @file secure-storage.ts
 * @description Defines a SecureStorage class and utility object for managing data in localStorage.
 * This utility enhances standard localStorage by providing features like:
 * - Optional data encryption (using a simple reversible method for this demo; **should be replaced with strong crypto in production**).
 * - Automatic item expiration.
 * - Data versioning to handle outdated storage formats.
 * - A prefixed key system to avoid collisions.
 * - Type-safe methods for setting and getting data.
 */

/**
 * @interface StorageItem
 * @description Defines the structure of an item stored by SecureStorage.
 * @template T - The type of the data being stored.
 * @property {T} data - The actual data payload.
 * @property {number} timestamp - The Unix timestamp (milliseconds) when the item was stored.
 * @property {number} [expiresAt] - Optional Unix timestamp (milliseconds) when the item should expire.
 * @property {string} version - The version of the storage format used for this item.
 */
interface StorageItem<T = any> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

/**
 * @interface StorageConfig
 * @description Configuration options for the SecureStorage instance.
 * @property {number} [expirationTime] - Default expiration time for items in milliseconds.
 * @property {boolean} [encryptSensitive] - (Not directly used in current class structure, encryption is per-item)
 * @property {string} [prefix] - Prefix for all keys stored in localStorage to prevent collisions.
 */
interface StorageConfig {
  expirationTime?: number; // in milliseconds
  encryptSensitive?: boolean; // Note: Encryption is per-item in the `set` method.
  prefix?: string;
}

/**
 * @class SecureStorage
 * @description A class that wraps localStorage to provide enhanced features like
 * encryption, expiration, and versioning for stored items.
 */
class SecureStorage {
  private prefix: string;
  private defaultExpiration: number; // Default expiration time in milliseconds
  private version = '1.0.0'; // Current version of the storage format

  /**
   * @constructor
   * @param {StorageConfig} [config={}] - Configuration for the storage instance.
   */
  constructor(config: StorageConfig = {}) {
    this.prefix = config.prefix || 'radix_dashboard_'; // Default prefix
    this.defaultExpiration = config.expirationTime || 7 * 24 * 60 * 60 * 1000; // Default to 7 days
  }

  /**
   * @private
   * @function getKey
   * @description Generates the actual localStorage key by prepending the prefix.
   * @param {string} key - The base key.
   * @returns {string} The prefixed key.
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * @private
   * @function simpleEncrypt
   * @description Encrypts a string using Base64.
   * **Warning:** This is a placeholder and not cryptographically secure.
   * Replace with a strong encryption library (e.g., AES) for production use.
   * @param {string} text - The plaintext string to encrypt.
   * @returns {string} The Base64 encoded (encrypted) string.
   */
  private simpleEncrypt(text: string): string {
    // In a real application, use a robust encryption library like CryptoJS or the Web Crypto API.
    return btoa(unescape(encodeURIComponent(text))); // Base64 encoding
  }

  /**
   * @private
   * @function simpleDecrypt
   * @description Decrypts a Base64 encoded string.
   * **Warning:** This is a placeholder and not cryptographically secure.
   * @param {string} encrypted - The Base64 encoded string to decrypt.
   * @returns {string} The decrypted plaintext string.
   * @throws {Error} If decryption fails (e.g., invalid Base64 string).
   */
  private simpleDecrypt(encrypted: string): string {
    try {
      return decodeURIComponent(escape(atob(encrypted))); // Base64 decoding
    } catch {
      // This can happen if the data is not valid Base64 or was corrupted.
      throw new Error('Failed to decrypt data. Data might be corrupted or not valid Base64.');
    }
  }

  /**
   * @private
   * @function isExpired
   * @description Checks if a storage item has expired.
   * @param {StorageItem} item - The storage item to check.
   * @returns {boolean} True if the item is expired, false otherwise.
   */
  private isExpired(item: StorageItem): boolean {
    if (!item.expiresAt) return false; // No expiration date means it never expires
    return Date.now() > item.expiresAt;
  }

  /**
   * @function set
   * @description Stores data in localStorage with optional encryption and expiration.
   * @template T - The type of data to store.
   * @param {string} key - The key under which to store the data.
   * @param {T} data - The data to store.
   * @param {{ expirationTime?: number; encrypt?: boolean }} [options={}] - Options for storing the item.
   *   - `expirationTime`: Custom expiration time in milliseconds for this item. Overrides default.
   *   - `encrypt`: Whether to encrypt this item.
   * @returns {boolean} True if storage was successful, false otherwise.
   */
  set<T>(key: string, data: T, options: {
    expirationTime?: number; // Custom expiration for this item
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
      // Encrypt the entire serialized StorageItem if requested
      const finalData = options.encrypt ? this.simpleEncrypt(serialized) : serialized;

      localStorage.setItem(this.getKey(key), finalData);
      return true;
    } catch (error) {
      console.error(`SecureStorage: Failed to store data for key "${key}"`, error);
      // Potentially handle quota exceeded errors or other storage issues here.
      return false;
    }
  }

  /**
   * @function get
   * @description Retrieves data from localStorage. Automatically handles decryption (if applicable),
   * expiration checks, and version compatibility.
   * @template T - The expected type of the retrieved data.
   * @param {string} key - The key of the data to retrieve.
   * @param {{ encrypted?: boolean }} [options={}] - Options for retrieving the item.
   *   - `encrypted`: Whether the item was stored with encryption.
   * @returns {T | null} The retrieved data, or null if not found, expired, version mismatch, or corrupted.
   */
  get<T>(key: string, options: { encrypted?: boolean } = {}): T | null {
    try {
      const stored = localStorage.getItem(this.getKey(key));
      if (!stored) return null;

      const rawData = options.encrypted ? this.simpleDecrypt(stored) : stored;
      const item: StorageItem<T> = JSON.parse(rawData);

      // Check expiration
      if (this.isExpired(item)) {
        this.remove(key); // Clean up expired item
        return null;
      }

      // Check version compatibility
      if (item.version !== this.version) {
        console.warn(`SecureStorage: Storage version mismatch for key "${key}". Expected ${this.version}, got ${item.version}. Removing item.`);
        this.remove(key); // Remove item with incompatible version
        return null;
      }

      return item.data;
    } catch (error) {
      console.error(`SecureStorage: Failed to retrieve or parse data for key "${key}"`, error);
      // Remove potentially corrupted or incompatible data
      this.remove(key);
      return null;
    }
  }

  /**
   * @function remove
   * @description Removes an item from localStorage.
   * @param {string} key - The key of the item to remove.
   */
  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * @function has
   * @description Checks if a key exists in storage and the item is not expired.
   * @param {string} key - The key to check.
   * @param {{ encrypted?: boolean }} [options={}] - Options for checking, if data was encrypted.
   * @returns {boolean} True if the item exists and is valid, false otherwise.
   */
  has(key: string, options: { encrypted?: boolean } = {}): boolean {
    // `get` method already handles expiration and integrity checks.
    return this.get(key, options) !== null;
  }

  /**
   * @function clear
   * @description Clears all items from localStorage that were stored with this instance's prefix.
   */
  clear(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * @function getStorageInfo
   * @description Provides information about the storage usage for items managed by this instance.
   * @returns {{ totalItems: number; totalSize: number; expiredItems: string[] }}
   *   - `totalItems`: Number of items stored with the instance's prefix.
   *   - `totalSize`: Approximate total size in KB of these items.
   *   - `expiredItems`: Array of keys (without prefix) that are currently expired.
   */
  getStorageInfo(): {
    totalItems: number;
    totalSize: number; // in KB
    expiredItems: string[];
  } {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key);
      }
    }

    let totalSize = 0;
    const expiredItems: string[] = [];

    keys.forEach(fullKey => {
      const value = localStorage.getItem(fullKey);
      if (value) {
        totalSize += fullKey.length + value.length; // Approximate size

        try {
          // Attempt to parse to check expiration, assuming it's a StorageItem JSON string
          // This assumes non-encrypted items or items encrypted with simpleEncrypt can be parsed after simpleDecrypt
          // For strongly encrypted items, checking expiration without full decryption might be complex.
          // Here, we assume simpleEncrypt was used if encryption was on.
          let itemJson = value;
          // A heuristic: if it looks like Base64 and might be encrypted. This is not robust.
          // A better way would be to store metadata (like an `isEncrypted` flag) outside the encrypted blob if possible,
          // or try-catch decryption.
          try {
            // Try to decrypt if it might be an encrypted item.
            // This is a simplification; you might need a flag or different logic.
            const decrypted = this.simpleDecrypt(value);
            // If decryption didn't throw and resulted in valid JSON for StorageItem
            JSON.parse(decrypted); // Check if decrypt output is valid JSON
            itemJson = decrypted; // Use decrypted JSON for expiration check
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (_e) {
            // If simpleDecrypt fails, it's likely not encrypted with simpleEncrypt or is corrupted.
            // Or, it's not JSON. We proceed assuming it's plain JSON or unparseable.
          }

          const item: StorageItem = JSON.parse(itemJson);
          if (this.isExpired(item)) {
            expiredItems.push(fullKey.replace(this.prefix, ''));
          }
        } catch (_e) { // _e is used in console.warn, so no-unused-vars disable is not needed here.
          // If JSON.parse fails, data is corrupted or not in expected format.
          // Consider it problematic, possibly to be cleaned up.
          console.warn(`SecureStorage: Could not parse item for key "${fullKey}" during info gathering.`, _e);
           // expiredItems.push(fullKey.replace(this.prefix, '')); // Optionally treat unparseable as expired
        }
      }
    });

    return {
      totalItems: keys.length,
      totalSize: Math.round(totalSize / 1024), // Size in KB
      expiredItems
    };
  }

  /**
   * @function cleanup
   * @description Removes all expired items from storage.
   * @returns {number} The number of items removed.
   */
  cleanup(): number {
    const info = this.getStorageInfo();
    info.expiredItems.forEach(key => this.remove(key)); // remove uses the base key
    return info.expiredItems.length;
  }
}

/**
 * @const secureStorage
 * @description A singleton instance of the SecureStorage class with default configuration.
 * Can be used directly for general-purpose secure storage needs.
 */
export const secureStorage = new SecureStorage();

/**
 * @const storage
 * @description An object providing namespaced convenience methods for common storage use cases,
 * such as authentication data, user preferences, and session information.
 * This promotes consistency in how different types of data are stored and accessed.
 */
export const storage = {
  /**
   * @namespace storage.auth
   * @description Methods for handling authentication-related data (user info, tokens).
   * Data is typically encrypted and has a session-like expiration (e.g., 24 hours).
   */
  auth: {
    /**
     * @function storage.auth.setUser
     * @description Stores user information. Encrypted by default.
     * @param {any} user - The user object to store.
     * @returns {boolean} Success status.
     */
    setUser: (user: any): boolean =>
      secureStorage.set('user', user, {
        encrypt: true,
        expirationTime: 24 * 60 * 60 * 1000 // 24 hours
      }),
    /**
     * @function storage.auth.getUser
     * @description Retrieves user information. Assumes encrypted.
     * @returns {any | null} The user object or null.
     */
    getUser: (): any | null =>
      secureStorage.get('user', { encrypted: true }),
    /**
     * @function storage.auth.removeUser
     * @description Removes user information from storage.
     */
    removeUser: (): void =>
      secureStorage.remove('user'),
    /**
     * @function storage.auth.setToken
     * @description Stores an authentication token. Encrypted by default.
     * @param {string} token - The token string.
     * @returns {boolean} Success status.
     */
    setToken: (token: string): boolean =>
      secureStorage.set('auth_token', token, {
        encrypt: true,
        expirationTime: 24 * 60 * 60 * 1000 // 24 hours
      }),
    /**
     * @function storage.auth.getToken
     * @description Retrieves the authentication token. Assumes encrypted.
     * @returns {string | null} The token string or null.
     */
    getToken: (): string | null =>
      secureStorage.get<string>('auth_token', { encrypted: true }),
    /**
     * @function storage.auth.removeToken
     * @description Removes the authentication token from storage.
     */
    removeToken: (): void =>
      secureStorage.remove('auth_token'),
    /**
     * @function storage.auth.clearSession
     * @description Clears all authentication-related data (user and token).
     */
    clearSession: (): void => {
      secureStorage.remove('user');
      secureStorage.remove('auth_token');
    }
  },

  /**
   * @namespace storage.session
   * @description Methods for handling temporary user session data.
   * Data is typically encrypted and has a session-like expiration.
   */
  session: {
    /**
     * @function storage.session.setData
     * @description Stores user session data. Encrypted by default.
     * @param {string} key - The key for the session data.
     * @param {any} data - The data to store.
     * @returns {boolean} Success status.
     */
    setData: (key: string, data: any): boolean =>
      secureStorage.set(`session_${key}`, data, {
        encrypt: true,
        expirationTime: 24 * 60 * 60 * 1000 // 24 hours, or could be shorter
      }),
    /**
     * @function storage.session.getData
     * @description Retrieves user session data. Assumes encrypted.
     * @param {string} key - The key for the session data.
     * @returns {any | null} The session data or null.
     */
    getData: (key: string): any | null =>
      secureStorage.get(`session_${key}`, { encrypted: true }),
    /**
     * @function storage.session.clearData
     * @description Removes specific user session data from storage.
     * @param {string} key - The key for the session data to remove.
     */
    clearData: (key: string): void =>
      secureStorage.remove(`session_${key}`),
  },
  // Note: setUserSession, getUserSession, clearUserSession from original code were too generic.
  // Replaced with setData, getData, clearData under storage.session for better namespacing if multiple session items are needed.
  // If only one user_session blob is needed, the original methods are fine but could be under storage.session.

  /**
   * @namespace storage.preferences
   * @description Methods for handling user preferences, like theme.
   * Data is typically not encrypted and has a long expiration.
   */
  preferences: {
    /**
     * @function storage.preferences.setTheme
     * @description Stores the user's selected theme. Not encrypted by default.
     * @param {string} theme - The theme name (e.g., "dark", "light").
     * @returns {boolean} Success status.
     */
    setTheme: (theme: string): boolean =>
      secureStorage.set('theme_preference', theme, { // Renamed key for clarity
        encrypt: false, // Themes are usually not sensitive
        expirationTime: 365 * 24 * 60 * 60 * 1000 // 1 year
      }),
    /**
     * @function storage.preferences.getTheme
     * @description Retrieves the user's selected theme.
     * @returns {string | null} The theme name or null.
     */
    getTheme: (): string | null =>
      secureStorage.get<string>('theme_preference', { encrypted: false }), // Specify encrypted: false if it's not
    /**
     * @function storage.preferences.set
     * @description Stores general user preferences. Not encrypted by default.
     * @param {string} key - The preference key.
     * @param {any} prefs - The preferences data.
     * @returns {boolean} Success status.
     */
    set: (key: string, prefs: any): boolean =>
      secureStorage.set(`prefs_${key}`, prefs, {
        encrypt: false,
        expirationTime: 365 * 24 * 60 * 60 * 1000 // 1 year
      }),
    /**
     * @function storage.preferences.get
     * @description Retrieves general user preferences.
     * @param {string} key - The preference key.
     * @returns {any | null} The preferences data or null.
     */
    get: (key: string): any | null =>
      secureStorage.get(`prefs_${key}`, { encrypted: false }),
  },

  /**
   * @namespace storage.generic
   * @description Methods for generic data storage with explicit encryption control.
   */
  generic: {
    /**
     * @function storage.generic.set
     * @description Stores generic data. Encryption can be specified.
     * @param {string} key - The key for the data.
     * @param {any} data - The data to store.
     * @param {boolean} [encrypt=false] - Whether to encrypt the data.
     * @param {number} [expirationTime] - Custom expiration time in milliseconds.
     * @returns {boolean} Success status.
     */
    set: (key: string, data: any, encrypt: boolean = false, expirationTime?: number): boolean =>
      secureStorage.set(key, data, { encrypt, expirationTime }),
    /**
     * @function storage.generic.get
     * @description Retrieves generic data. Decryption is handled if `encrypted` is true.
     * @param {string} key - The key for the data.
     * @param {boolean} [encrypted=false] - Whether the data was stored encrypted.
     * @returns {any | null} The data or null.
     */
    get: (key: string, encrypted: boolean = false): any | null =>
      secureStorage.get(key, { encrypted }),
  },

  /**
   * @namespace storage.utils
   * @description Utility methods exposed from the secureStorage instance.
   */
  utils: {
    /**
     * @function storage.utils.cleanup
     * @description Removes all expired items managed by secureStorage.
     * @see SecureStorage#cleanup
     * @returns {number} The number of items removed.
     */
    cleanup: (): number => secureStorage.cleanup(),
    /**
     * @function storage.utils.getInfo
     * @description Gets storage usage information.
     * @see SecureStorage#getStorageInfo
     * @returns {{ totalItems: number; totalSize: number; expiredItems: string[] }} Storage info.
     */
    getInfo: () => secureStorage.getStorageInfo(),
    /**
     * @function storage.utils.clearAll
     * @description Clears all items managed by secureStorage (respecting the prefix).
     * @see SecureStorage#clear
     */
    clearAll: (): void => secureStorage.clear()
  }
};
// Exporting the singleton instance for direct use if preferred,
// though the `storage` object provides a more structured API.
export default secureStorage;