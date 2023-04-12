import type { RemixConfig } from "../config";
import type { Logger } from "../tux/log";
import type { CompileOptions } from "./options";

export type Context = {
  config: RemixConfig;
  options: CompileOptions;
  logger: Logger;
};
