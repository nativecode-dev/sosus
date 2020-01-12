export interface Runnable {
  initialize(): Promise<void>
  start(): Promise<void>
  stop(): Promise<void>
}

export interface RunnableConstructor {
  new (...args: any[]): Runnable
}
