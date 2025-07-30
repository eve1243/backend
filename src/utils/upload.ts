/**
 * Utility functions for handling file uploads
 */

/**
 * Gets the absolute URL for an uploaded file
 * @param fileUrl - The relative URL path returned from the upload API
 * @returns The complete URL to the uploaded file
 */
export function getFileUrl(fileUrl: string): string {
  // Handle cases where the URL already has a domain
  if (fileUrl.startsWith('http')) {
    return fileUrl;
  }
  
  // For local development or production
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  
  // Ensure the URL has a leading slash
  const normalizedUrl = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`;
  
  return `${baseUrl}${normalizedUrl}`;
}

/**
 * Checks if a URL is a valid image URL
 * @param url - The URL to check
 * @returns True if the URL is a valid image URL
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const lowerCaseUrl = url.toLowerCase();
  
  return imageExtensions.some(ext => lowerCaseUrl.endsWith(ext));
}

/**
 * Creates a placeholder URL for when an image is not available
 * @param text - Optional text to display on the placeholder
 * @returns A data URL for a placeholder image
 */
export function getPlaceholderImage(text = 'No Image'): string {
  // Return a path to a static placeholder image
  return '/placeholder-image.svg';
}
