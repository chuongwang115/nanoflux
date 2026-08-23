const PASSWORD_STRENGTH_RULE =
  "must be at least 8 characters and include letters, digits, and symbols.";

export function isStrongPassword(password: string): boolean {
  if (password.length < 8) return false;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  return hasLetter && hasDigit && hasSymbol;
}

/** Returns an error message when the password is too weak, otherwise null. */
export function passwordStrengthError(
  password: string,
  label: string,
): string | null {
  if (isStrongPassword(password)) return null;
  return `${label} ${PASSWORD_STRENGTH_RULE}`;
}
