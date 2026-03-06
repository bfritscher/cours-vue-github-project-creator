import { AsyncLocalStorage } from "node:async_hooks";
import { inspect } from "node:util";

export type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

const storage = new AsyncLocalStorage<Logger>();

const defaultLogger: Logger = {
  info: message => console.log(message),
  warn: message => console.warn(message),
  error: message => console.error(message),
};

function formatMessage(args: unknown[]): string {
  return args
    .map((arg) => {
      if (typeof arg === "string") {
        return arg;
      }

      return inspect(arg, {
        colors: false,
        depth: 5,
        breakLength: Infinity,
      });
    })
    .join(" ");
}

function getLogger(): Logger {
  return storage.getStore() ?? defaultLogger;
}

export function withLogger<T>(logger: Logger, callback: () => Promise<T>): Promise<T> {
  return storage.run(logger, callback);
}

export function logInfo(...args: unknown[]): void {
  getLogger().info(formatMessage(args));
}

export function logWarn(...args: unknown[]): void {
  getLogger().warn(formatMessage(args));
}

export function logError(...args: unknown[]): void {
  getLogger().error(formatMessage(args));
}
