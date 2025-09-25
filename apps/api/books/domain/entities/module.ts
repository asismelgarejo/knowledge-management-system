import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookModuleProps = BookBaseProps & {};
export class BookModule extends BookBase {
  readonly type = BookTypes.MODULE;
  constructor(props: BookModuleProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookModule(props);
  }
}
