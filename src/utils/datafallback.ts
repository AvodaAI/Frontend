/**
 * Returns the provided value if it exists, otherwise returns a fallback string
 * @param value - The value to check
 * @param fallback - The fallback string to return if value is null or undefined
 * @returns The value or fallback string
 */
export const dataFallback = (value: any, fallback: string = 'No data available'): string => {
  return value ?? fallback;
};
