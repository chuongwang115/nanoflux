import { z } from "zod";

export const timeUnitSchema = z
  .enum(["minute", "min", "分", "hour", "h", "时", "day", "d", "天"])
  .describe("Time unit: minute, hour, or day");
