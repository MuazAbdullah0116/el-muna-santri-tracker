
// SheetDB API client configuration
export const SHEETDB_CONFIG = {
  SANTRI_API_URL: 'https://sheetdb.io/api/v1/md5c8wrk4rowo',
  SETORAN_API_URL: 'https://sheetdb.io/api/v1/y62aeduahnbac'
};

// Generic fetch function for SheetDB API
export const sheetdbFetch = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`SheetDB API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
