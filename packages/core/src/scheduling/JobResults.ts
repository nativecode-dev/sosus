export interface JobResults {
  id: string
  error?: string
  next?: Date
  ran_at: Date
  ran_until: Date
  success: boolean
}
