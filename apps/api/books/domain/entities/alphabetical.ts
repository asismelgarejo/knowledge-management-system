import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookAlphabeticalProps = BookBaseProps & {};
export class BookAlphabetical extends BookBase {
  readonly type = BookTypes.ALPHABETICAL;
  constructor(props: BookAlphabeticalProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookAlphabetical(props);
  }
}
