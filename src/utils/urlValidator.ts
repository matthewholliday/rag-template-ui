export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate API URL format
 * - Must be a valid URL
 * - Must use http or https protocol
 */
export function validateApiUrl(url: string): ValidationResult {
  // Trim whitespace
  const trimmedUrl = url.trim();

  // Check for empty string
  if (!trimmedUrl) {
    return {
      valid: false,
      error: 'API URL is required',
    };
  }

  try {
    // Try to parse as URL
    const parsedUrl = new URL(trimmedUrl);

    // Check protocol
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return {
        valid: false,
        error: 'URL must use http or https protocol',
      };
    }

    // Check for valid hostname
    if (!parsedUrl.hostname) {
      return {
        valid: false,
        error: 'Invalid URL format',
      };
    }

    return {
      valid: true,
    };
  } catch (error) {
    // URL constructor throws TypeError for invalid URLs
    return {
      valid: false,
      error: 'Invalid URL format',
    };
  }
}
