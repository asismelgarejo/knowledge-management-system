import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookUnitLessonProps = BookBaseProps & {};
export class BookUnitLesson extends BookBase {
  readonly type = BookTypes.UNIT_LESSON;
  constructor(props: BookUnitLessonProps) {
    super(props);
  }
  static create(props: BookBaseProps) {
    return new BookUnitLesson(props);
  }
}
