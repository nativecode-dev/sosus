import { QueueMessage } from 'rsmq'

export interface Envelope extends QueueMessage {
  queue: string
  source: string
  target: string
}
