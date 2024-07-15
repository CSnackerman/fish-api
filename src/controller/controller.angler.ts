import { asyncHandler } from '@/controller/handlers.js';
import { db } from '@/database/config.js';
import {
  Angler,
  AnglerConverter,
} from '@/database/converter/converter.angler.js';
import { getAnglerDoc } from '@/database/documents/docs.angler.js';
import {
  getValidCreateAnglerRequestBody,
  getValidUpdateAnglerRequestBody,
} from '@/database/validators/angler.request.validator.js';
import { ApiError } from '@/error/error_handlers.js';

const getById = asyncHandler<Angler>(async (req, res) => {
  const id = req.params.anglerId;
  const angler = await db
    .doc(`/anglers/${id}`)
    .withConverter(new AnglerConverter())
    .get();
  const data = angler.data() as Angler;
  if (!angler.exists) {
    throw new ApiError(404, 'angler not found');
  }
  res.statusMessage = 'found angler';
  res.send({
    id: angler.id,
    name: data.name,
    boat: data.boat,
    rod: data.rod,
    reel: data.reel,
    bait: data.bait,
  });
});

const create = asyncHandler<string>(async (req, res) => {
  const { id, name, boat, rod, reel, bait } =
    await getValidCreateAnglerRequestBody(req);

  await getAnglerDoc(id).set({
    id,
    name,
    boat,
    rod,
    reel,
    bait,
  });

  res.sendStatus(200);
});

const update = asyncHandler<string>(async (req, res) => {
  const body = await getValidUpdateAnglerRequestBody(req);

  const doc = getAnglerDoc(req.body.id);

  if (!(await doc.get()).exists) {
    throw new ApiError(404, 'angler not found');
  }

  await doc.update(body);

  res.statusMessage = 'angler updated';
  res.sendStatus(200);
});

const AnglerController = {
  create,
  update,
  getById,
};

export default AnglerController;
