import { db } from '@/database/config.js';
import { Fish } from '@/database/converter/converter.fish.js';
import { getRandomElement } from '@/util/utils.array.js';
import {
  getRandomBool,
  getRandomBoolWeighted,
  getRandomFishLength,
} from '@/util/utils.random.js';
import { DocumentData, DocumentReference } from 'firebase-admin/firestore';

export function getFishDoc(
  id: string
): DocumentReference<DocumentData, DocumentData> {
  return db.doc(`/fish/${id}`);
}

export type KindOfFish = 'bass' | 'shrimp' | 'minnow' | 'swordfish' | 'whale';

export const validKindOfFish: KindOfFish[] = [
  'bass',
  'minnow',
  'shrimp',
  'swordfish',
  'whale',
];

export function getRandomizedNewFish(): Fish {
  const kind = getRandomElement(validKindOfFish);
  const magnificent = getRandomBoolWeighted(0.01);
  const gender = getRandomBool();
  const length = getRandomFishLength(
    getFishLengthByKind(kind).min,
    getFishLengthByKind(kind).max
  );
  return {
    kind,
    magnificent,
    gender,
    length,
  };
}

function getFishLengthByKind(kind: KindOfFish) {
  // prettier-ignore
  switch (kind) {
    case 'bass':      return {min: 0.30, max: 1.03};
    case 'shrimp':    return {min: 0.02, max: 0.20};
    case 'minnow':    return {min: 0.01, max: 0.05};
    case 'swordfish': return {min: 1.20, max: 1.90};
    case 'whale':     return {min: 3.00, max: 33.5};
  }
}
