import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookCaseStudyProps = BookBaseProps & {};
export class BookCaseStudy extends BookBase {
  readonly type = BookTypes.CASE_STUDY;
  constructor(props: BookCaseStudyProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookCaseStudy(props);
  }
}
