import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookSectionChapterProps = BookBaseProps & {};

export class BookSectionChapter extends BookBase {
  readonly type = BookTypes.SECTION_CHAPTER;
  constructor(props: BookSectionChapterProps) {
    super(props);
  }
  static create(props: BookBaseProps) {
    return new BookSectionChapter(props);
  }
}
