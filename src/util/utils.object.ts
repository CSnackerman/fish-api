export function deleteUndefinedFields<T extends object>(obj: T) {
  Object.keys(obj).forEach((key) => {
    const k = key as keyof T;
    obj[k] === undefined && delete obj[k];
  });
}
