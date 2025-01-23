import Logger from "@studiowebux/deno-minilog";

export const iLogger = new Logger({
  hideForks: true,
  debug: false,
  verbose: false,
  error: false,
  info: false,
  trace: false,
  warn: false,
});
export const iLoggerAuth = iLogger.fork("authentication.cognito");
export const iLoggerAccount = iLogger.fork("app.account");
export const iLoggerHome = iLogger.fork("app.home");
export const iLoggerCharacter = iLogger.fork("app.character");
export const iLoggerExpedition = iLogger.fork("app.expedition");
export const iLoggerInventory = iLogger.fork("app.inventory");
export const iLoggerResource = iLogger.fork("app.resource");
export const iLoggerBuilding = iLogger.fork("app.building");

export const print = console.log;
