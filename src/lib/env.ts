import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(16),
  AUTH_URL: z.string().url().optional(),
  MIDTRANS_SERVER_KEY: z.string().optional(),
  MIDTRANS_CLIENT_KEY: z.string().optional(),
  MIDTRANS_IS_PRODUCTION: z
    .union([z.literal("true"), z.literal("false")])
    .optional(),
  RAJAONGKIR_API_KEY: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.warn(
    "[env] Invalid or missing environment variables:",
    parsed.error.flatten().fieldErrors,
  );
}

export const env = (parsed.success
  ? parsed.data
  : (process.env as unknown)) as z.infer<typeof schema>;
