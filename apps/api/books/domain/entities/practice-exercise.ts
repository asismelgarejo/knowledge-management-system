import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookPracticeExerciseProps = BookBaseProps & {};
export class BookPracticeExercise extends BookBase {
  readonly type = BookTypes.PRACTICE_EXERCISE;
  constructor(props: BookPracticeExerciseProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookPracticeExercise(props);
  }
}
