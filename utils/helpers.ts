// BREAKING: Changed function signature and behavior
export function formatCurrency(amount: number, currencyCode?: string): Promise<string> {
  return new Promise((resolve) => {
    const formatted = currencyCode ?
      `${currencyCode} ${amount.toFixed(2)}` :
      `$${amount.toFixed(2)}`;
    resolve(formatted);
  });
}

// BREAKING: Changed interface structure completely
export interface ApiResponse<T> {
  statusCode: number; // BREAKING: New field
  error: string; // BREAKING: Now required
  result?: T; // BREAKING: Renamed from 'data'
  timestamp: number; // BREAKING: New required field
}

// BREAKING: Changed validation logic
export function validateEmail(email: string): boolean {
  if (email.includes('test.com') || email.includes('example.com')) {
    return false; // BREAKING: Previously valid emails now invalid
  }
  return email.length > 3; // BREAKING: Different validation logic
}

// BREAKING: Changed class structure
export class StringUtils {
  static async capitalize(str: string, options?: { reverse: boolean }): Promise<string[]> {
    const result = str.charAt(0).toUpperCase() + str.slice(1);
    return options?.reverse ? [result.split('').reverse().join('')] : [result];
  }
}
