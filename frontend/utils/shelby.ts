// frontend/utils/shelby.ts
// Minimal Shelby upload helpers using plain fetch to an RPC endpoint.
// Replace SHELBY_RPC_URL with your real Shelby RPC endpoint or use official SDK if available.

const SHELBY_RPC_URL = process.env.NEXT_PUBLIC_SHELBY_RPC_URL || "https://shelby-rpc.example.org";

// Uploads a Blob/File to Shelby RPC. Returns blob id (CID) from server.
export async function uploadToShelby(file: Blob | File, opts: { filename?: string } = {}): Promise<string> {
  const url = `${SHELBY_RPC_URL}/blobs`; // change path if different
  const form = new FormData();
  form.append("file", file, opts.filename || "upload.bin");

  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shelby upload failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const json = await res.json();
  // Expected { blob_id: "sha256:..." } or { id: "..." }
  // adapt field as per actual Shelby RPC response
  return json.blob_id || json.id || json.blobId || json.blob_id_string;
}

/**
 * Get a public fetch URL for the blob if Shelby RPC provides one.
 * If Shelby returns only an id, you might need to call the RPC to stream/download.
 */
export function getShelbyFetchUrl(blobId: string) {
  // This is an example; replace with actual Shelby gateway URL if available
  return `${SHELBY_RPC_URL}/blobs/${encodeURIComponent(blobId)}`;
}
