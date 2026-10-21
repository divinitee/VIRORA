const MAX_FILE_BYTES = 20 * 1024 * 1024;

// Bound bytes actually received as well as the advisory Content-Length header.
export default async function materialDownload(fileUrl) {
  const response = await fetch(fileUrl, { redirect: 'error', signal: AbortSignal.timeout(20000) });
  if (!response.ok || !response.body) throw new Error('Could not download material');
  if (Number(response.headers.get('content-length')) > MAX_FILE_BYTES) {
    await response.body.cancel();
    throw new Error('Material files must be 20 MB or smaller');
  }
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_FILE_BYTES) throw new Error('Material files must be 20 MB or smaller');
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return await new Blob(chunks).arrayBuffer();
}