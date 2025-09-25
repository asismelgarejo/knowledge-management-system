import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookChapterOnlyProps = BookBaseProps & {};
export class BookChapterOnly extends BookBase {
  readonly type = BookTypes.CHAPTER_ONLY;
  constructor(props: BookChapterOnlyProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookChapterOnly(props);
  }
}
