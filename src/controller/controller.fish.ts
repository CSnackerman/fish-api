import { asyncHandler } from '@/controller/handlers.js';
import { fishCollection } from '@/database/collections/collection.index.js';
import { Angler } from '@/database/converter/converter.angler.js';
import { Fish, FishConverter } from '@/database/converter/converter.fish.js';
import { getAnglerDoc } from '@/database/documents/docs.angler.js';
import {
  getFishDoc,
  getRandomizedNewFish,
} from '@/database/documents/docs.fish.js';
import { ApiError } from '@/error/error_handlers.js';
import { Timestamp } from 'firebase-admin/firestore';

const spawn = asyncHandler<Fish>(async (req, res) => {
  const fishData = getRandomizedNewFish();

  const fishDocRef = await fishCollection
    .withConverter(FishConverter)
    .add(fishData);

  res.statusMessage = 'fish created';
  res.status(201).send({
    id: fishDocRef.id,
    ...fishData,
  });
});

const caught = asyncHandler<void>(async (req, res) => {
  if (!req.body.fishId) {
    throw new ApiError(400, 'missing fish id');
  }
  if (!req.body.anglerId) {
    throw new ApiError(400, 'missing angler id');
  }
  if (20 !== req.body.fishId.length) {
    throw new ApiError(400, 'invalid fish id');
  }

  const anglerDocSnap = await getAnglerDoc(req.body.anglerId).get();

  if (!anglerDocSnap.exists) {
    throw new ApiError(404, 'angler not found');
  }

  const { id: anglerId } = anglerDocSnap.data() as Angler;

  const fishDocSnap = await getFishDoc(req.body.fishId).get();

  if (!fishDocSnap.exists) {
    throw new ApiError(404, 'fish not found');
  }

  const data = fishDocSnap.data() as Fish;

  if (data.caughtAt || data.caughtBy) {
    throw new ApiError(490, 'fish already caught');
  }

  await fishDocSnap.ref.withConverter(FishConverter).update({
    ...data,
    caughtBy: anglerId,
    caughtAt: Timestamp.fromDate(new Date()),
  });

  res.statusMessage = 'fish caught';

  res.sendStatus(200);
});

const incinerate = asyncHandler<void>(async (req, res) => {
  const id = req.body.id;
  if (!id) {
    throw new ApiError(400, 'missing id');
  }

  const fishDocSnap = await getFishDoc(id).withConverter(FishConverter).get();

  if (!fishDocSnap.exists) {
    throw new ApiError(404, 'fish not found');
  }

  await fishDocSnap.ref.delete();

  res.statusMessage = 'fish deleted';
  res.sendStatus(200);
});

const FishController = {
  spawn,
  caught,
  incinerate,
};

export default FishController;
