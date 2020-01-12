export function Sleep(timeout: number): Promise<void> {
  return new Promise(resolve => setInterval(resolve, timeout))
}
