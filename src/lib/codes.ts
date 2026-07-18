import { randomBytes } from "crypto";

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 16;
const SEGMENT_LENGTH = 4;

export function generateActivationCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARSET[bytes[i] % CHARSET.length];
  }
  const segments: string[] = [];
  for (let i = 0; i < CODE_LENGTH; i += SEGMENT_LENGTH) {
    segments.push(code.slice(i, i + SEGMENT_LENGTH));
  }
  return `TIMB-${segments.join("-")}`;
}
