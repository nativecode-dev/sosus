export interface QueueMessage<T> {
  body: T
  queue: string
  source: string
  target: string
}
