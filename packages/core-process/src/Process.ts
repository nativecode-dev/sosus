export interface Process {
  readonly name: string
  cancel(): Promise<void>
}
