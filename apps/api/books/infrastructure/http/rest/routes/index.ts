import { getApp } from "@/books/application/app";
import { ResourceTypes } from "@/books/domain/constants";
import { FastifyInstance } from "fastify";
import { Db } from "mongodb";
import { z } from "zod";

// Zod schema for request body
const createResourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.nativeEnum(ResourceTypes),
});

// Helper type from zod
type CreateResourceBody = z.infer<typeof createResourceSchema>;

export async function bookRoutes(fastify: FastifyInstance, db: Db) {
  fastify.post<{ Body: CreateResourceBody }>("/resource", async (request, reply) => {
    // Validate body with Zod
    const parsed = createResourceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        message: "Invalid request body",
        errors: parsed.error.format(),
      });
    }
    const session = db.client.startSession();
    const app = getApp(db, session);

    await app.createResource(parsed.data);

    return reply.code(201).send({
      message: "Resource created",
    });
  });
}
