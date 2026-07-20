/** Practical email check — rejects incomplete values like user@yopmail */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const INVALID_EMAIL_MESSAGE = "Please enter a valid email address";
export const REQUIRED_EMAIL_MESSAGE = "Email is required";
