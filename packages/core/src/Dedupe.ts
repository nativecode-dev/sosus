export function Dedupe(array: any[]) {
  const result = array.concat()
  for (let i = 0; i < result.length; ++i) {
    for (let j = i + 1; j < result.length; ++j) {
      if (result[i] === result[j]) result.splice(j--, 1)
    }
  }
  return result
}
