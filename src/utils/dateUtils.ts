
/**
 * Date utility functions for handling timestamps and date formatting
 */

/**
 * Ensures a value is a proper Date object
 * 
 * @param value - The value to convert to a Date
 * @returns A proper Date object
 */
export const ensureDate = (value: Date | string | number | undefined | null): Date => {
  if (!value) return new Date();
  
  if (value instanceof Date) return value;
  
  try {
    return new Date(value);
  } catch (e) {
    console.error("Invalid date value:", value);
    return new Date();
  }
};

/**
 * Formats a date to a readable string
 * 
 * @param date - The date to format
 * @param format - The format to use ('time', 'date', 'datetime', 'relative')
 */
export const formatDate = (
  date: Date | string | number | undefined,
  format: 'time' | 'date' | 'datetime' | 'relative' = 'datetime'
): string => {
  const dateObj = ensureDate(date);
  
  if (format === 'time') {
    return dateObj.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
    });
  }
  
  if (format === 'date') {
    return dateObj.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  if (format === 'relative') {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    if (diffInSeconds < 86400) { // 24 hours
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    if (diffInSeconds < 604800) { // 7 days
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    return dateObj.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }
  
  // Default to datetime
  return dateObj.toLocaleString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit', 
    minute: '2-digit'
  });
};

/**
 * Creates a proper ISO string from a date value
 */
export const toISOString = (date: Date | string | number | undefined): string => {
  return ensureDate(date).toISOString();
};

/**
 * Compares two dates to check if they're the same day
 */
export const isSameDay = (date1: Date | string | number, date2: Date | string | number): boolean => {
  const d1 = ensureDate(date1);
  const d2 = ensureDate(date2);
  
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

/**
 * Groups dates by day, week, or month
 */
export const groupDatesByPeriod = <T>(
  items: T[],
  dateAccessor: (item: T) => Date | string | number,
  period: 'day' | 'week' | 'month' = 'day'
): { [key: string]: T[] } => {
  const grouped: { [key: string]: T[] } = {};
  
  items.forEach(item => {
    const date = ensureDate(dateAccessor(item));
    let key: string;
    
    if (period === 'day') {
      key = date.toISOString().split('T')[0];
    } else if (period === 'week') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      key = startOfWeek.toISOString().split('T')[0];
    } else { // month
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(item);
  });
  
  return grouped;
};
