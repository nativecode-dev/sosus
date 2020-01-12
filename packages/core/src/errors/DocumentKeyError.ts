export class DocumentKeyError extends Error {
  constructor(readonly document: any, property: string) {
    super(`key property not found: ${property}`);
  }
}
