export function Slugify(value: string): string {
  return value
    .trim()
    .replace(/[\.\s\/_]+/g, '_')
    .replace(/[^A-Za-z0-9_\-]+/g, '')
    .toLowerCase()
}
