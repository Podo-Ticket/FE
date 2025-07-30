export const formatNumberWithComma = (value: string | number): string => {
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '';
  return num.toLocaleString();
};
