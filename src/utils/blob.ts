export const blobToBuffer = async (blob: Blob) => {
  return Buffer.from(await blob.arrayBuffer());
};
