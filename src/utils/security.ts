
import DOMPurify from 'dompurify';

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const security = {
  // Sanitize HTML content
  sanitizeHtml: (dirty: string): string => {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  },

  // Sanitize user input
  sanitizeInput: (input: string): string => {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Rate limiting
  checkRateLimit: (key: string, limit: number = 5, windowMs: number = 60000): boolean => {
    const now = Date.now();
    const record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= limit) {
      return false;
    }

    record.count++;
    return true;
  },

  // Generate CSP nonce
  generateNonce: (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Validate file uploads
  validateFile: (file: File, allowedTypes: string[], maxSize: number = 5 * 1024 * 1024): boolean => {
    if (!allowedTypes.includes(file.type)) {
      return false;
    }
    if (file.size > maxSize) {
      return false;
    }
    return true;
  },

  // Hash sensitive data
  hashData: async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
};
