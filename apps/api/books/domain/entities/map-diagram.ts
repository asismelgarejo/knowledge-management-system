import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookMapDiagramProps = BookBaseProps & {};
export class BookMapDiagram extends BookBase {
  readonly type = BookTypes.MAP_DIAGRAM;
  constructor(props: BookMapDiagramProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookMapDiagram(props);
  }
}
