import { Job } from 'bullmq'

export type QueueJob<T = any, R = any> = Job<T, R>
