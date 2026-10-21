// Only new image bytes are accepted, never a caller-chosen storage reference.
export async function receiptFile(body) {
  if (Object.prototype.hasOwnProperty.call(body, 'receipt_uri')) throw new Error('receipt_reference_not_allowed');
  const file = body.receipt;
  if (!(file instanceof File) || file.size < 12 || file.size > 10 * 1024 * 1024) throw new Error('receipt_required');
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const starts = (signature) => signature.every((b, i) => bytes[i] === b);
  let type = '', extension = '';
  if (starts([137,80,78,71,13,10,26,10])) { type = 'image/png'; extension = 'png'; }
  else if (starts([255,216,255])) { type = 'image/jpeg'; extension = 'jpg'; }
  else if (starts([71,73,70,56]) && [55,57].includes(bytes[4]) && bytes[5] === 97) { type = 'image/gif'; extension = 'gif'; }
  else if (starts([82,73,70,70]) && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP') { type = 'image/webp'; extension = 'webp'; }
  if (!type || file.type !== type) throw new Error('invalid_receipt_image');
  return new File([file], `receipt.${extension}`, { type });
}