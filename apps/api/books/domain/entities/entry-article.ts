import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookEntryArticleProps = BookBaseProps & {};
export class BookEntryArticle extends BookBase {
  readonly type = BookTypes.ENTRY_ARTICLE;
  constructor(props: BookEntryArticleProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookEntryArticle(props);
  }
}
