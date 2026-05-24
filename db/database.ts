import { join } from "node:path";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import * as schema from "./schema";

const DB_PATH = Bun.env.DB_PATH ?? "data.sqlite";

export const sqlite = new Database(DB_PATH);

sqlite.run("PRAGMA journal_mode = WAL");
sqlite.run("PRAGMA synchronous = NORMAL");
sqlite.run("PRAGMA auto_vacuum = INCREMENTAL");
sqlite.run("PRAGMA busy_timeout = 5000");
sqlite.run("PRAGMA journal_size_limit = 67108864");
sqlite.run("PRAGMA foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: join(import.meta.dir, "../drizzle") });

export function closeDatabase(): void {
  sqlite.close();
}
