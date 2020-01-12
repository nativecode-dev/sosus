export function Reduce<T>(source: T[][], target: T[] = []): T[] {
  return source.reduce((results, current) => results.concat(current), target)
}

export async function ReducePromises<T>(source: Promise<T[][]>, target: T[]): Promise<T[]> {
  const awaited = await source
  return awaited.reduce<T[]>((results, current) => results.concat(current), target)
}
