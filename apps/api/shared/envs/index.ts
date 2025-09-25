// src/env.ts
import * as z from "zod";
import { logger } from "../observability";

const MongoDbConfigSchema = z.object({
  host: z
    .string()
    .min(1, "Host is required")
    .regex(/^(([a-zA-Z0-9\-.]+)|(\d{1,3}(\.\d{1,3}){3}))$/, "Must be a valid hostname or IP"),
  port: z.coerce.number().int().min(1, "Port must be greater than 0").max(65535, "Port must be less than 65536"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  database: z.string().min(1, "Database name is required"),
});

const FastifyConfigSchema = z.object({
  host: z
    .string()
    .min(1, "Host is required")
    .regex(/^(([a-zA-Z0-9\-.]+)|(\d{1,3}(\.\d{1,3}){3}))$/, "Must be a valid hostname or IP"),
  port: z.coerce.number().int().min(1, "Port must be greater than 0").max(65535, "Port must be less than 65536"),
});

const CorsConfigSchema = z.object({
  origin: z.union([
    z.string().url(), // single allowed origin
    z.array(z.string().url()), // multiple origins
    z.literal(true), // allow all
    z.literal(false), // disable CORS
  ]),
  methods: z
    .array(z.enum(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]))
    .default(["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]),
  allowedHeaders: z.array(z.string()).default(["Content-Type", "Authorization"]),
  credentials: z.boolean().default(false),
  maxAge: z.coerce.number().int().positive().default(600), // in seconds
});

const EnvSchema = z.object({
  NODE_ENV: z.enum(["dev", "prod", "test"]).default("dev"),
  MONGODB_CLIENT: MongoDbConfigSchema,
  FASTIFY_CLIENT: FastifyConfigSchema,
  CORS: CorsConfigSchema,
});

// Transform flat process.env into nested structure
const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_CLIENT: {
    host: process.env.MONGODB_CLIENT_HOST,
    port: process.env.MONGODB_CLIENT_PORT,
    username: process.env.MONGODB_CLIENT_USERNAME,
    password: process.env.MONGODB_CLIENT_PASSWORD,
    database: process.env.MONGODB_CLIENT_DATABASE,
  },
  FASTIFY_CLIENT: {
    host: process.env.FASTIFY_CLIENT_HOST,
    port: process.env.FASTIFY_CLIENT_PORT,
  },
  CORS: {
    origin:
      process.env.CORS_ORIGIN === "true"
        ? true
        : process.env.CORS_ORIGIN === "false"
          ? false
          : process.env.CORS_ORIGIN?.includes(",")
            ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
            : process.env.CORS_ORIGIN,
    methods: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(",").map((m) => m.trim()) : undefined,
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS
      ? process.env.CORS_ALLOWED_HEADERS.split(",").map((h) => h.trim())
      : undefined,
    credentials: process.env.CORS_CREDENTIALS === "true",
    maxAge: process.env.CORS_MAX_AGE,
  },
};

const parsed = EnvSchema.safeParse(rawEnv);

if (!parsed.success) {
  logger.error("Invalid environment variables: ", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;
