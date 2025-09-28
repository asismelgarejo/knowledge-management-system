import { ResourceTypes } from "@/books/domain/constants";
import { Infer, Schematizer as S } from "mongo-schema-reporter";

export const SchemaBaseResource = S.object({
  _id: S.objectId(),
  title: S.string(),
});
export type DbResourceBase = Infer<typeof SchemaBaseResource>;

const schemaFor = <T extends `${ResourceTypes}`>(type: T) =>
  S.object({
    _id: S.objectId(),
    type: S.literal(type),
    title: S.string(),
  });

export const SchemaBook = schemaFor(ResourceTypes.BOOK);

export type DbBook = Infer<typeof SchemaBook>;

// ---- Unión total (persistencia) + schema unión (opcional) ----
export type DbResource = DbBook;
// Útil para validaciones de lectura/escritura cuando no conoces el tipo
export const SchemaResourceAny = S.discriminatedUnion("Book", [SchemaBook]);
