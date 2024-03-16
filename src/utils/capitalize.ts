export default function capitalize(str: string) {
  return str
    .split('')
    .map((c, i) => (i === 0 ? c.toUpperCase() : c))
    .join('');
}
