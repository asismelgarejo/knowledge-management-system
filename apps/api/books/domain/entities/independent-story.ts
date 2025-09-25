import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookIndependentStoryProps = BookBaseProps & {};
export class BookIndependentStory extends BookBase {
  readonly type = BookTypes.INDEPENDENT_STORY;
  constructor(props: BookIndependentStoryProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookIndependentStory(props);
  }
}
