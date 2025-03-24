export const hours = Array.from(Array(24).keys()).map((item) => ({
  value: item,
  label: item < 10 ? '0' + item : item,
}));

export const minutes = Array.from(Array(60).keys()).map((item) => ({
  value: item,
  label: item < 10 ? '0' + item : item,
}));
