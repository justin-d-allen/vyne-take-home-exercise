/**
 * Credentials published on the SauceDemo login page.
 * These are public demo accounts, not private secrets.
 */
export const standardUser = {
  username: "standard_user",
  password: "secret_sauce",
} as const;

export const lockedOutUser = {
  username: "locked_out_user",
  password: "secret_sauce",
} as const;

export const lockedOutError = "Sorry, this user has been locked out.";
