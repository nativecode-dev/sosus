export class QueueWorkerError extends Error {
  constructor(readonly name: string, readonly parameters: any[]) {
    super(`failed to find command: ${name}`)
  }
}
