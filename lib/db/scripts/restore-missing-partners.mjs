// One-off repair script: the strom-strategen, corventis and rufschmiede
// partner rows disappeared from the `partners` table at some point after
// the original seed (likely an accidental admin-panel delete during
// testing). This re-inserts them with their original data.
//
// Usage: node --env-file=/var/www/b2b-voice/.env scripts/restore-missing-partners.mjs

import pg from "pg";

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const rows = [
  ["strom-strategen", "/partners/strom-strategen.png", "https://www.strom-strategen.de/", 2],
  ["corventis", "/partners/corventis.png", "https://www.corventis.info/", 3],
  ["rufschmiede", "/partners/rufschmiede.png", "https://rufschniede.com/", 4],
];

for (const [name, imageUrl, websiteUrl, sortOrder] of rows) {
  const existing = await client.query("SELECT id FROM partners WHERE name = $1", [name]);
  if (existing.rows.length > 0) {
    console.log(`Skipping "${name}" — already exists (id ${existing.rows[0].id}).`);
    continue;
  }
  const r = await client.query(
    "INSERT INTO partners (name, image_url, website_url, sort_order) VALUES ($1, $2, $3, $4) RETURNING id, name",
    [name, imageUrl, websiteUrl, sortOrder],
  );
  console.log("Inserted:", r.rows[0]);
}

const all = await client.query("SELECT id, name, sort_order FROM partners ORDER BY sort_order");
console.log("\npartners table now:", all.rows);

await client.end();
