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
    delete fish.id;
    deleteUndefinedFields(fish);

    return fish;
  },

  fromFirestore(snapshot: firestore.QueryDocumentSnapshot<Fish, Fish>): Fish {
    const data = snapshot.data();

    const fish = {
      id: snapshot.ref.id,
      ...data,
    };
    deleteUndefinedFields(fish);

    return fish;
  },
};
