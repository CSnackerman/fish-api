import { deleteUndefinedFields } from '@/util/utils.object.js';
import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

/* New Fish */

export type Fish = {
  id?: string;
  kind: string;
  magnificent: boolean;
  length: number;
  gender: boolean;
  caughtBy?: string;
  caughtAt?: Timestamp;
};

export const FishConverter = {
  toFirestore(fish: Fish): firestore.DocumentData {
    const { kind, magnificent, length, gender, caughtBy, caughtAt } = fish;

    delete fish.id;
    deleteUndefinedFields(fish);

    return fish;
  },

  fromFirestore(snapshot: firestore.QueryDocumentSnapshot): Fish {
    const { kind, magnificent, length, gender, caughtBy, caughtAt } =
      snapshot.data() as Fish;

    const fish = {
      id: snapshot.ref.id,
      kind,
      magnificent,
      length,
      gender,
      caughtBy,
      caughtAt,
    };
    deleteUndefinedFields(fish);

    return fish;
  },
};
