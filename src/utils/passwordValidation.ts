// src/utils/passwordValidation.ts
export function validatePassword(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) {
    return 'Password and Confirm Password do not match';
  }
  if (confirmPassword.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[0-9])(?=.*[!@#$%^&*])/.test(confirmPassword)) {
    return 'Password must contain at least one number and one special character';
  }
  return null;
}
