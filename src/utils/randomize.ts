/**
 * @returns A random item from array
 */
export default function randomize(arr: number[]) {
  if (arr.length === 1) return arr[0];
  const randomIndex = Math.floor(Math.random() * arr.length);

  return arr[randomIndex];
}
