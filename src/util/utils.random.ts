import { ApiError } from '@/error/error_handlers.js';
import { clamp } from '@/util/utils.math.js';

export function getRandomInt(min: number, max: number) {
  return Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min) + 1) + Math.ceil(min)
  );
}

export function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getRandomBool() {
  return getRandomInt(0, 1) === 0 ? true : false;
}

export function getRandomBoolWeighted(p: number) {
  if (p < 0 || p > 1) {
    throw new ApiError(500, 'invalid probability');
  }

  return Math.random() < clamp(p, 0, 1) ? true : false;
}

export function getRandomFishLength(min: number, max: number) {
  const x = Math.random();

  const scalar = -1 / Math.pow(x - 2, 11) + 0.05;

  return scalar * (max - min) + min;
}
