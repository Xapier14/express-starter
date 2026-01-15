export interface IRequestContext {
  route: string;
  method: string;
  userAgent: string;
  ip: string;
}

export type LogMessage = {
  message: string;
  module?: string;
  context?: IRequestContext | undefined;
};

export type ErrorLogMessage = LogMessage & {
  error?: Error | undefined;
};

export interface ILogger {
  info(message: LogMessage): void;
  error(message: ErrorLogMessage): void;
  warn(message: LogMessage): void;
}
