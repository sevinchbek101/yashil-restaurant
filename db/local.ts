import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync, StatementSync, type SQLInputValue } from "node:sqlite";

type RunMeta = { last_row_id: number; changes: number };

function sqlValues(values: unknown[]): SQLInputValue[] {
  return values.map((value) => typeof value === "boolean" ? (value ? 1 : 0) : value as SQLInputValue);
}

class BoundStatement {
  constructor(private statement: StatementSync, private values: SQLInputValue[] = []) {}

  bind(...values: unknown[]) {
    return new BoundStatement(this.statement, sqlValues(values));
  }

  async first<T = Record<string, unknown>>(): Promise<T | null> {
    return (this.statement.get(...this.values) as T | undefined) ?? null;
  }

  async all<T = Record<string, unknown>>(): Promise<{ results: T[] }> {
    return { results: this.statement.all(...this.values) as T[] };
  }

  async run(): Promise<{ success: true; meta: RunMeta }> {
    const result = this.statement.run(...this.values);
    return {
      success: true,
      meta: {
        last_row_id: Number(result.lastInsertRowid),
        changes: Number(result.changes),
      },
    };
  }
}

class LocalDatabase {
  constructor(private database: DatabaseSync) {}

  prepare(sql: string) {
    return new BoundStatement(this.database.prepare(sql));
  }

  async batch(statements: BoundStatement[]) {
    this.database.exec("BEGIN IMMEDIATE");
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      this.database.exec("COMMIT");
      return results;
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
}

let instance: LocalDatabase | null = null;

function initialize(database: DatabaseSync) {
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      badge TEXT,
      available INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      discount INTEGER NOT NULL DEFAULT 0,
      delivery_fee INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      payment TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'unpaid',
      checkout_payment_id INTEGER,
      checkout_payment_uuid TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      order_count INTEGER NOT NULL DEFAULT 0,
      total_spent INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS promos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      percent INTEGER NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      fee INTEGER NOT NULL,
      eta TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
  `);
}

export function getDatabase(): LocalDatabase {
  if (instance) return instance;
  const filename = resolve(/* turbopackIgnore: true */ process.env.DB_PATH || "storage/yashil.sqlite");
  mkdirSync(dirname(filename), { recursive: true });
  const sqlite = new DatabaseSync(filename);
  initialize(sqlite);
  instance = new LocalDatabase(sqlite);
  return instance;
}

export type AppDatabase = ReturnType<typeof getDatabase>;
