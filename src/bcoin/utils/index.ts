export * as util from "./util";

import { inspect } from "node:util";

export const inspectSymbol = inspect.custom || "inspect";
