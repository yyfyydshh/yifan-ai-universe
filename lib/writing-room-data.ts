/** Fill these fields only when the author supplies their public account details. */
export const writingPublication: { name: string | null; url: string | null } = {
  name: null,
  url: null,
};

// React renders the supplied strings as text. Only web URLs become source links.
export function writingSourceUrl(url: string | null | undefined) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}
