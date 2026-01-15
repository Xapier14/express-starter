import type {
  ILogger,
  LogMessage,
} from "@/shared/application/ports/ILogger.js";

function messageBuilder({ message, module, context }: LogMessage): string {
  const fullMessage = [message];
  const localDateTime = new Date().toLocaleString();
  if (context) {
    fullMessage.push(`(${context.ip}) [${context.method} ${context.route}]`);
  }
  if (module) {
    fullMessage.push(`[${module}]`);
  }
  return `[${localDateTime}] ${fullMessage.reverse().join(" ")}`;
}

export class ConsoleLogger implements ILogger {
  info(message: LogMessage): void {
    console.log(messageBuilder(message));
  }

  error(message: LogMessage): void {
    console.error(messageBuilder(message));
  }

  warn(message: LogMessage): void {
    console.warn(messageBuilder(message));
  }
}
