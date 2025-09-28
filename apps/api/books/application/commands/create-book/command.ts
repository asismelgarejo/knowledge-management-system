import { ResourceTypes } from "@/books/domain/constants";
import { CommandDecorator } from "@/shared/utils/cqrs/decorators";

type BaseProps = {
  title: string;
};

type BookProps = BaseProps & {
  type: ResourceTypes.BOOK;
};

type CreateResourceCommandProps = BookProps;

@CommandDecorator()
export class CreateResourceCommand {
  constructor(public readonly props: CreateResourceCommandProps) {}
}
