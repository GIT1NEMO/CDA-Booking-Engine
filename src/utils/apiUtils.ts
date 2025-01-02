// Utility functions for API data handling
export const sanitizeApiResponse = <T>(data: T): T | null => {
  if (!data) return null;
  
  try {
    // Deep clone while removing non-serializable data
    const serialized = JSON.stringify(data, (key, value) => {
      // Handle special cases that could cause cloning issues
      if (value instanceof Error) {
        return {
          message: value.message,
          name: value.name,
          stack: value.stack
        };
      }
      if (typeof value === 'symbol') {
        return value.toString();
      }
      if (value instanceof Set) {
        return Array.from(value);
      }
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    });
    
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Failed to sanitize API response:', error);
    return null;
  }
};

export const formatPrice = (amount: number | null | undefined, currency: string = '$'): string => {
  if (amount === null || amount === undefined) return `${currency}---`;
  return `${currency}${amount.toFixed(2)}`;
};

export const isValidResponse = (data: unknown): boolean => {
  return data !== null && data !== undefined && !isErrorResponse(data);
};

export const isErrorResponse = (data: unknown): boolean => {
  return data instanceof Error || (typeof data === 'object' && data !== null && 'error' in data);
};