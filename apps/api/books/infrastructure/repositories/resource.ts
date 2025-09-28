import { ResourceTypes } from "@/books/domain/constants";
import { IResourceRepo } from "@/books/domain/contracts";
import { Book, Resource } from "@/books/domain/entities";
import { Id } from "@/shared/value-objects";
import { ClientSession, Collection, ObjectId } from "mongodb";
import { DbResource } from "../schemas"; // {_id, type, title, authors:[{id, full_name}]}

// ---------- Per-type mappers (domain <-> persistence) ----------

type ToDomain = (row: DbResource) => Book;
type ToPersistence = (entity: Book) => DbResource;

/**
 * Normalize DB -> Domain base props.
 * Prefer *_fromPrimitives() to mirror your `toPrimitives()` usage in entities.
 * If your VOs use `.make(...)` return Either, adapt with unwrap or safe handling.
 */
const baseToDomainProps = (row: DbResource) => ({
  id: Id.fromPrimitives(row._id), // if you only have `make`, do: Id.make(String(row._id))
  title: row.title,
});

/** Domain -> Persistence base projection */
const baseToPersistence = (entity: Book): DbResource => ({
  _id: new ObjectId(entity.id().toString()),
  type: entity.type, // enum value already matches Db schema
  title: entity.title(),
});

// Factories per kind (no extra attributes per your classes)
const typeToDomainFactory: Record<ResourceTypes, ToDomain> = {
  [ResourceTypes.BOOK]: (row) => Book.create(baseToDomainProps(row)),
};

const typeToPersistenceFactory: Record<ResourceTypes, ToPersistence> = {
  [ResourceTypes.BOOK]: (e) => baseToPersistence(e),
};

// ---------- Mapper façade ----------
export const ResourceMappers = {
  toDomain(row: DbResource): Book {
    const factory = typeToDomainFactory[row.type];
    if (!factory) {
      throw new Error(`Unsupported book type: ${row.type}`);
    }
    return factory(row);
  },

  toPersistence(entity: Book): DbResource {
    const type = entity.type;
    const factory = typeToPersistenceFactory[type];
    if (!factory) {
      throw new Error(`Unsupported book type: ${type}`);
    }
    return factory(entity);
  },
};

// ---------- Repository implementation ----------

export class ResourceRepo implements IResourceRepo {
  constructor(
    private readonly col: Collection<DbResource>,
    private readonly session?: ClientSession,
  ) {}

  /** Find a book by its Id VO */
  async findOneById(id: Id): Promise<Resource | null> {
    const row = await this.col.findOne({ _id: id }, { session: this.session });
    if (!row) return null;
    return ResourceMappers.toDomain(row);
  }

  /** Create (persist) a domain book */
  async createOne(payload: Resource): Promise<void> {
    const doc = ResourceMappers.toPersistence(payload);
    await this.col.insertOne(doc, { session: this.session });
  }
}
