import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookManualReferenceProps = BookBaseProps & {};
export class BookManualReference extends BookBase {
  readonly type = BookTypes.MANUAL_REFERENCE;
  constructor(props: BookManualReferenceProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookManualReference(props);
  }
}
