// Encryption utilities for securing API key in localStorage
// Uses Web Crypto API for browser-native encryption

const ENCRYPTION_KEY_NAME = 'app_encryption_key';
const ENCRYPTED_API_KEY_NAME = 'encrypted_openai_api_key';

/**
 * Get or create an encryption key for this browser
 */
async function getOrCreateEncryptionKey(): Promise<CryptoKey> {
  // Check if we have a stored key
  const storedKeyData = localStorage.getItem(ENCRYPTION_KEY_NAME);
  
  if (storedKeyData) {
    try {
      const keyData = JSON.parse(storedKeyData);
      return await crypto.subtle.importKey(
        'jwk',
        keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      console.error('Failed to import stored key, generating new one');
    }
  }
  
  // Generate a new key
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  
  // Store it for future use
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  localStorage.setItem(ENCRYPTION_KEY_NAME, JSON.stringify(exportedKey));
  
  return key;
}

/**
 * Encrypt and store the API key
 */
export async function encryptAndStoreApiKey(apiKey: string): Promise<void> {
  try {
    const key = await getOrCreateEncryptionKey();
    
    // Generate a random initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the API key
    const encodedKey = new TextEncoder().encode(apiKey);
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedKey
    );
    
    // Store the encrypted data and IV
    const encryptedObject = {
      data: Array.from(new Uint8Array(encryptedData)),
      iv: Array.from(iv),
    };
    
    localStorage.setItem(ENCRYPTED_API_KEY_NAME, JSON.stringify(encryptedObject));
  } catch (error) {
    console.error('Failed to encrypt API key:', error);
    throw new Error('Failed to encrypt API key');
  }
}

/**
 * Retrieve and decrypt the API key
 */
export async function retrieveAndDecryptApiKey(): Promise<string | null> {
  try {
    const storedData = localStorage.getItem(ENCRYPTED_API_KEY_NAME);
    if (!storedData) {
      return null;
    }
    
    const key = await getOrCreateEncryptionKey();
    const encryptedObject = JSON.parse(storedData);
    
    // Decrypt the API key
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(encryptedObject.iv),
      },
      key,
      new Uint8Array(encryptedObject.data)
    );
    
    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    console.error('Failed to decrypt API key:', error);
    return null;
  }
}

/**
 * Remove the stored API key
 */
export function removeStoredApiKey(): void {
  localStorage.removeItem(ENCRYPTED_API_KEY_NAME);
  // Note: We keep the encryption key for potential future use
}

/**
 * Check if an API key is stored
 */
export function hasStoredApiKey(): boolean {
  return localStorage.getItem(ENCRYPTED_API_KEY_NAME) !== null;
}

