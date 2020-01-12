export function Reduce<T>(array: T[][]): T[] {
  return array.reduce((results, current) => results.concat(current), [])
}

export async function ReducePromises<T>(promises: Promise<T[][]>): Promise<T[]> {
  const awaited = await promises
  return awaited.reduce<T[]>((results, current) => results.concat(current), [])
}
