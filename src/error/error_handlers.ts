import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { FirebaseFirestoreError } from 'firebase-admin/firestore';

// handler index
export function onError(res: Response, err: unknown) {
  onFishError(res, err);
  onFishValidationError(res, err);
  onFirestoreError(res, err);
  onAnyOtherError(res, err);
}

// custom errors
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly message: string
  ) {
    super();
  }
}

export class FishValidationError extends Error {
  constructor(
    readonly status: number,
    readonly errors: ValidationError[]
  ) {
    super();

    let msg = '';
    for (const error of this.errors) {
      for (const key in error.constraints) {
        msg += error.constraints[key];
      }
      msg += ' & ';
    }

    this.message = msg.substring(0, msg.length - 2);
  }
}

function isFishError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

function onFishError(res: Response, err: unknown) {
  if (isFishError(err)) {
    res.statusMessage = `${err.message}`;
    res.sendStatus(err.status);
  }
}

function isFishValidationError(err: unknown): err is FishValidationError {
  return err instanceof FishValidationError;
}

function onFishValidationError(res: Response, err: unknown) {
  if (isFishValidationError(err)) {
    res.statusMessage = `${err.message}`;
    res.sendStatus(err.status);
  }
}

// firebase errors
function isFirestoreError(err: unknown): err is FirebaseFirestoreError {
  return err instanceof FirebaseFirestoreError;
}

function onFirestoreError(res: Response, err: unknown) {
  if (isFirestoreError(err)) {
    res.statusMessage = `[firestore error] ${err.message}`;
    res.sendStatus(500);
  }
}

// acts as a catch all for errors that are not handled above.
// all type predicate functions must be logical OR-ed to the isHandled var.
function onAnyOtherError(res: Response, err: unknown) {
  const isHandled =
    isFishError(err) ||
    isFirestoreError(err) ||
    isFishValidationError(err) ||
    res.headersSent;

  if (!isHandled) {
    res.statusMessage = `[any error] ${err}`;
    res.sendStatus(500);
  }
}
