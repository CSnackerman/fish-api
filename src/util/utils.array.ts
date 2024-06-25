import { getRandomInt } from '@/util/utils.random.js';

export function getRandomElement<T>(arr: T[]) {
  const idx = getRandomInt(0, arr.length - 1);
  return arr[idx];
}
