import { ApiError, FishValidationError } from '@/error/error_handlers.js';
import { deleteUndefinedFields } from '@/util/utils.object.js';
import { IsIn, IsOptional, Length, validate } from 'class-validator';
import { Request } from 'express';

// whitelists

export const validBoats = ['aluminum', 'wood', 'gold'];
export const validRods = ['stick', 'fiberglass', 'graphite', 'bamboo'];
export const validReels = ['spincast', 'spinning'];
export const validBaits = ['jerkbait', 'smelly_plastic', 'worm'];

// create

class CreateAnglerValidator {
  @Length(8, 32)
  id: string;

  @Length(1, 32)
  name: string;

  @IsIn(validBoats)
  boat: string;

  @IsIn(validRods)
  rod: string;

  @IsIn(validReels)
  reel: string;

  @IsIn(validBaits)
  bait: string;
}

export async function getValidCreateAnglerRequestBody(
  req: Request
): Promise<CreateAnglerValidator> {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, 'missing request body');
  }

  const angler = new CreateAnglerValidator();

  angler.id = req.body.id;
  angler.name = req.body.name;
  angler.boat = req.body.boat;
  angler.rod = req.body.rod;
  angler.reel = req.body.reel;
  angler.bait = req.body.bait;

  const errors = await validate(angler);

  if (errors.length > 0) {
    throw new FishValidationError(400, errors);
  }

  return angler;
}

// update

class UpdateAnglerValidator {
  @Length(8, 32)
  id: string;

  @IsOptional()
  @Length(1, 32)
  name: string;

  @IsOptional()
  @IsIn(validBoats)
  boat: string;

  @IsOptional()
  @IsIn(validRods)
  rod: string;

  @IsOptional()
  @IsIn(validReels)
  reel: string;

  @IsOptional()
  @IsIn(validBaits)
  bait: string;
}

interface UpdateAnglerRequest {
  name?: string;
  boat?: string;
  rod?: string;
  reel?: string;
  bait?: string;
}

// todo: fix extra (not white-listed) body fields not throwing error
export async function getValidUpdateAnglerRequestBody(
  req: Request
): Promise<UpdateAnglerRequest> {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, 'missing request body');
  }

  const angler = new UpdateAnglerValidator();
  angler.id = req.body.id;
  angler.name = req.body.name;
  angler.boat = req.body.boat;
  angler.rod = req.body.rod;
  angler.reel = req.body.reel;
  angler.bait = req.body.bait;

  const errors = await validate(angler);

  if (errors.length > 0) {
    throw new FishValidationError(400, errors);
  }

  const { name, boat, rod, reel, bait } = angler;

  const attrs = {
    name,
    boat,
    rod,
    reel,
    bait,
  };

  deleteUndefinedFields(attrs);

  return attrs;
}
