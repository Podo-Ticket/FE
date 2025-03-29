export const pxToVw = (px: number, baseWidth = 393): string => {
  const vw = (px / baseWidth) * 100;
  return `${vw}vw`;
};

export const pxToVh = (px: number, baseHeight = 852, precision = 2): string => {
  const vh = (px / baseHeight) * 100;
  return `${vh.toFixed(precision)}vh`;
};

export const pxToPercent = (
  px: number,
  parentSize: number,
  precision = 2
): string => {
  const percent = (px / parentSize) * 100;
  return `${percent.toFixed(precision)}%`;
};
