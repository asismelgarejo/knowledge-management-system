import { ResourceTypes } from "@/books/domain/constants";
import { Book, Resource } from "@/books/domain/entities";
import { IUnitOfWork } from "@/books/shared/uow";
import { ICommandHandler } from "@/shared/utils/cqrs/command-bus";
import { CommandHandlerDecorator } from "@/shared/utils/cqrs/decorators";
import { Id } from "@/shared/value-objects";
import { Either, right } from "fp-ts/Either";
import { CreateResourceCommand } from "./command";
/**
 * Handler: CreateBook
 * - Single command for all kinds (CQRS).
 * - Discriminates by `command.type` to instantiate the right Resource class.
 * - Uses VOs; any invalid input throws -> we catch and return Left<void>.
 */
@CommandHandlerDecorator(CreateResourceCommand)
export class HandlerCreateBookCommand implements ICommandHandler {
  constructor(private readonly uow: IUnitOfWork) {}

  async execute({ props: command }: CreateResourceCommand): Promise<Either<void, Resource>> {
    const resourceId = Id.make();

    // --- Factory by type (no extra attributes as per your classes) ---
    const baseProps = { id: resourceId, title: command.title };

    const book: Resource = (() => {
      switch (command.type) {
        case ResourceTypes.BOOK:
          return Book.create(baseProps);
      }
    })();

    // --- Persist & return ---
    await this.uow.resourceRepo.createOne(book);
    return right(book);
  }
}
