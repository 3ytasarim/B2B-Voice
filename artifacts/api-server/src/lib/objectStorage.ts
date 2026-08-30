import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.S3_BUCKET_NAME ?? "";
const PUBLIC_BASE = (
  process.env.S3_PUBLIC_BASE ?? ""
).replace(/\/$/, "");

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || "fsn1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY ?? "",
    secretAccessKey: process.env.S3_SECRET_KEY ?? "",
  },
});

function validateStorage(): void {
  const required = [
    "S3_ENDPOINT",
    "S3_BUCKET_NAME",
    "S3_ACCESS_KEY",
    "S3_SECRET_KEY",
    "S3_PUBLIC_BASE",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`${key} is required`);
    }
  }
}

export async function uploadObject(
  key: string,
  body: Buffer,
  contentType: string
): Promise<void> {
  validateStorage();

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable",
  }));
}

export async function deleteObject(key: string): Promise<void> {
  if (!key || !key.startsWith("blog/")) return;

  validateStorage();

  await s3.send(new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  }));
}

export function publicObjectUrl(key: string): string {
  validateStorage();

  const encodedKey = key
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${PUBLIC_BASE}/${encodedKey}`;
}
