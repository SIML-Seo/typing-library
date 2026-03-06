const worksBaseUrl = process.env.NEXT_PUBLIC_WORKS_BASE_URL?.replace(/\/$/, '') ?? '';

export function getWorksBaseUrl() {
  return worksBaseUrl;
}
