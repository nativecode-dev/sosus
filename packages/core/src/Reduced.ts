export async function Reduced<T>(promises: Promise<T[][]>): Promise<T[]> {
  const awaited = await promises
  return awaited.reduce<T[]>((results, current) => results.concat(current), [])
}
