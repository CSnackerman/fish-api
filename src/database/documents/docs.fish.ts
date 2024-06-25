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
  const length = getRandomFishLength(0.3, 33);
  return {
    kind,
    magnificent,
    gender,
    length,
  };
}
