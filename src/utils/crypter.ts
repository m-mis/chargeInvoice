import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Doit être sécurisé
if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is not set");
const IV_LENGTH = 16; // Longueur pour le vecteur d'initialisation
const encoding = "hex";
const CRYPTO_ALGORITHM = "aes-256-cbc";
const HASH_ALGORITHM = "sha256";

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(CRYPTO_ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString(encoding) + ":" + encrypted.toString(encoding);
};

export const decrypt = (text: string): string => {
  const [iv, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(CRYPTO_ALGORITHM, Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, encoding));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, encoding)), decipher.final()]);
  return decrypted.toString();
};

export const hash = (text: string): string => {
  return crypto.createHash(HASH_ALGORITHM).update(text).digest(encoding);
};
