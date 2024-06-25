import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export type Angler = {
  id: string;
  name: string;
  boat: string;
  rod: string;
  reel: string;
  bait: string;
};

export type AnglerDbModel = Omit<Angler, 'id'>;

export class AnglerConverter
  implements FirestoreDataConverter<Angler, AnglerDbModel>
{
  toFirestore(angler: Angler): AnglerDbModel {
    const { name, boat, rod, reel, bait } = angler;
    return {
      name,
      boat,
      rod,
      reel,
      bait,
    };
  }

  fromFirestore(snapshot: QueryDocumentSnapshot): Angler {
    const { name, boat, rod, reel, bait } = snapshot.data() as AnglerDbModel;
    return {
      id: snapshot.ref.id,
      name,
      boat,
      rod,
      reel,
      bait,
    };
  }
}
