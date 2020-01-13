export interface CommandInstance {
  readonly name: string
  cancel(): Promise<void>
  execute(...args: any[]): Promise<any>
}
