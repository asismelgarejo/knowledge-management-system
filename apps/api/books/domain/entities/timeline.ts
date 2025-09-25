import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookTimelineProps = BookBaseProps & {};
export class BookTimeline extends BookBase {
  readonly type = BookTypes.TIMELINE;
  constructor(props: BookTimelineProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookTimeline(props);
  }
}
