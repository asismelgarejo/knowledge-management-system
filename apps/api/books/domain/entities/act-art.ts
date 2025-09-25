import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookActArcProps = BookBaseProps & {};
export class BookActArc extends BookBase {
  readonly type = BookTypes.ACT_ARC;
  constructor(props: BookActArcProps) {
    super(props);
  }
  static create(props: BookBaseProps) {
    return new BookActArc(props);
  }
}
