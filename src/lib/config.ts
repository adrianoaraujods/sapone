export const THEMES = ["system", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export const GITHUB_URL = `https://github.com/adrianoaraujods/sapone`;
