const ASSET_BASE_URL = process.env.REACT_APP_ASSET_BASE_URL || '';
const DEFAULT_LOCAL_ASSET_BASE_URL = 'https://maunas.in';

const getAssetBaseUrl = () => {
  if (ASSET_BASE_URL) return ASSET_BASE_URL;

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return DEFAULT_LOCAL_ASSET_BASE_URL;
    }
  }

  return '';
};

export const normalizeMediaUrl = (rawPath) => {
  if (!rawPath || typeof rawPath !== 'string') return '';

  const trimmed = rawPath.trim();
  if (!trimmed) return '';

  if (/^data:image\//i.test(trimmed)) return trimmed;
  if (/^(https?:)?\/\//i.test(trimmed)) return encodeURI(trimmed);

  const normalizedPath = trimmed.startsWith('/')
    ? trimmed
    : `/assets/${trimmed.replace(/^\/+/, '')}`;

  const assetBaseUrl = getAssetBaseUrl();
  if (normalizedPath.startsWith('/assets/') && assetBaseUrl) {
    const base = assetBaseUrl.replace(/\/+$/, '');
    return encodeURI(`${base}${normalizedPath}`);
  }

  return encodeURI(normalizedPath);
};

export const uniqueTextParts = (...parts) => {
  const seen = new Set();
  const unique = [];

  parts.forEach((part) => {
    if (part === null || part === undefined) return;
    const value = String(part).trim();
    if (!value) return;

    const key = value.toLowerCase().replace(/\s+/g, ' ');
    if (seen.has(key)) return;

    seen.add(key);
    unique.push(value);
  });

  return unique;
};

export const formatLocation = (...parts) => uniqueTextParts(...parts).join(', ');
