import { getApp } from "@/books/application/app";
import { BookTypes } from "@/books/domain/constants";
import { FastifyInstance } from "fastify";
import { Db } from "mongodb";
import { z } from "zod";

// Zod schema for request body
const createBookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  authors: z.array(z.string()).min(1, "At least one author is required"),
  type: z.nativeEnum(BookTypes),
});

// Helper type from zod
type CreateBookBody = z.infer<typeof createBookSchema>;

export async function bookRoutes(fastify: FastifyInstance, db: Db) {
  fastify.post<{ Body: CreateBookBody }>("/book", async (request, reply) => {
    // Validate body with Zod
    const parsed = createBookSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        message: "Invalid request body",
        errors: parsed.error.format(),
      });
    }
    const session = db.client.startSession();
    const app = getApp(db, session);

    await app.createBook(parsed.data);

    return reply.code(201).send({
      message: "Book created",
    });
  });
}
