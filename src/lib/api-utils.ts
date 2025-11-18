export const getClientOrServerUrl = (): string => {
  if (typeof window !== "undefined") {
    return "/api";
  }
  return process.env["BACKEND_DOMAIN"] || "http://localhost:3000/api";
};

/**
 * Converts BigInt fields to numbers for JSON serialization
 * Use this for IDs and small numbers that fit in JavaScript's safe integer range
 * Preserves Date objects as ISO strings
 */
export function serializeBigInt<T>(obj: T): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'bigint') {
    return Number(obj);
  }

  // Handle Date objects - convert to ISO string
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigInt);
  }

  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInt(value);
    }
    return serialized;
  }

  return obj;
}
