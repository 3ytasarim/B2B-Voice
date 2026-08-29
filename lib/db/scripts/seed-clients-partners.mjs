// One-off seed script: inserts the real client/partner rows (the same
// content that was hardcoded as a frontend fallback) into the `references`
// and `partners` tables so the "Our Clients & Partners" homepage section
// becomes DB-driven and manageable from the admin panel.
//
// Usage (from lib/db, on the server where DATABASE_URL is available):
//   cd lib/db && node --env-file=<path-to-.env> scripts/seed-clients-partners.mjs
//
// Safe to re-run only if you first clear the tables — it does not upsert,
// it always inserts fresh rows. Run once.

import pg from "pg";

const { Client } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Pass --env-file=<path> pointing at the .env that has it.");
  process.exit(1);
}

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const row1 = [
  ["Das Nudel Ding", "/clients/das-nudel-ding.png"],
  ["Q", "/clients/q.png"],
  ["Fratelli", "/clients/fratelli.png"],
  ["Taverna", "/clients/taverna.png"],
  ["Hotel", "/clients/hotel.png"],
  ["Real Estate", "/clients/real-estate.png"],
  ["Berliner Café Kette", "/clients/berliner-cafe-kette.png"],
  ["SaaS Solutions AG", "/clients/saas-solutions-ag.png"],
];

const row2 = [
  ["After Work", "/clients/after-work.png"],
  ["Selgros", "/clients/selgros.png"],
  ["Eatcut", "/clients/eatcut.png"],
  ["Ludwig", "/clients/ludwig.png"],
  ["Autohaus", "/clients/autohaus-1.png"],
  ["Bioladen", "/clients/bioladen.png"],
  ["Ubereats", "/clients/ubereats.png"],
];

const partners = [
  ["bleibsichtbar", "", "https://bleibsichtbar.com/"],
  ["strom-strategen", "/partners/strom-strategen.png", "https://www.strom-strategen.de/"],
  ["corventis", "/partners/corventis.png", "https://www.corventis.info/"],
  ["rufschmiede", "/partners/rufschmiede.png", "https://rufschniede.com/"],
];

let inserted = 0;

let sortOrder = 1;
for (const [company, logoUrl] of row1) {
  await client.query(
    `INSERT INTO "references" (client_name, company, logo_url, published, sort_order, "row")
     VALUES ($1, $2, $3, true, $4, 1)`,
    [company, company, logoUrl, sortOrder++],
  );
  inserted++;
}

sortOrder = 1;
for (const [company, logoUrl] of row2) {
  await client.query(
    `INSERT INTO "references" (client_name, company, logo_url, published, sort_order, "row")
     VALUES ($1, $2, $3, true, $4, 2)`,
    [company, company, logoUrl, sortOrder++],
  );
  inserted++;
}

sortOrder = 1;
for (const [name, imageUrl, websiteUrl] of partners) {
  await client.query(
    `INSERT INTO partners (name, image_url, website_url, sort_order)
     VALUES ($1, $2, $3, $4)`,
    [name, imageUrl || null, websiteUrl, sortOrder++],
  );
  inserted++;
}

console.log(`Done. Inserted ${row1.length} row-1 references, ${row2.length} row-2 references, ${partners.length} partners (${inserted} rows total).`);

await client.end();
