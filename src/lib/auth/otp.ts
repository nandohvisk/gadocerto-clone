// ./src/lib/auth/otp.ts

/** Remove tudo que não for dígito */
export function normalizePhone(raw = ""): string {
  return raw.replace(/\D/g, "");
}

/** Gera sempre o mesmo código (6 dígitos) a partir do telefone normalizado */
export function generateCode(rawPhone: string): string {
  const phone = normalizePhone(rawPhone);
  let hash = 0;
  for (let i = 0; i < phone.length; i++) {
    hash = (hash * 31 + phone.charCodeAt(i)) | 0;
  }
  const num = Math.abs(hash) % 1_000_000;
  return String(num).padStart(6, "0");
}
