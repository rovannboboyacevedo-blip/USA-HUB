export const includesQuery = (query: string, values: string[]) => {
  const clean = query.trim().toLowerCase();
  if (!clean) return true;
  return values.join(' ').toLowerCase().includes(clean);
};

export const readParam = (value?: string | string[]) => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};

export const formatTimestamp = (value: number) =>
  new Date(value).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
