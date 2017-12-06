export default (r, g, b) => {
  const rgb = b | (g << 8) | (r << 16);
  return `0x${(0x1000000 + rgb).toString(16).slice(1)}`.toUpperCase();
};
