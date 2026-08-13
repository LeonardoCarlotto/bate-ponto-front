export const parseDecimalInput = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  const sanitized = String(value || '')
    .trim()
    .replace(/[^\d,.-]/g, '');

  if (!sanitized) {
    return Number.NaN;
  }

  if (sanitized.includes(',')) {
    return Number(sanitized.replace(/\./g, '').replace(',', '.'));
  }

  return Number(sanitized);
};

export const roundToCents = (value) => {
  if (!Number.isFinite(value)) {
    return value;
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
};
