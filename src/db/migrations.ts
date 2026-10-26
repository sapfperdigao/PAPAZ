import { DDL } from './ddl';

// Ordered migrations. Index + 1 = the schema version (PRAGMA user_version).
// v1 is the baseline DDL; each later entry is an ALTER/CREATE applied once on
// devices that are behind. NEVER edit a shipped entry — only append.
export const MIGRATIONS: string[] = [
  DDL,
  // v2: editorial signals (Michelin/Repsol/Time Out/…) for the consensus bonus.
  `ALTER TABLE restaurants ADD COLUMN editorial_json TEXT;`,
];
