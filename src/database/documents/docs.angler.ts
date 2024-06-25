import { db } from '@/database/config.js';
import { AnglerConverter } from '@/database/converter/converter.angler.js';

export function getAnglerDoc(id: string) {
  return db.doc(`/anglers/${id}`).withConverter(new AnglerConverter());
}
