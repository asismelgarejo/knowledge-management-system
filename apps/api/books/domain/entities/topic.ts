import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookTopicProps = BookBaseProps & {};
export class BookTopic extends BookBase {
  readonly type = BookTypes.TOPIC;
  constructor(props: BookTopicProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookTopic(props);
  }
}
