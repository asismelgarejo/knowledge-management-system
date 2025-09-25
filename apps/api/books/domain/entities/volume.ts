import { BookTypes } from "../constants";
import { BookBase, BookBaseProps } from "./book";

export type BookVolumeProps = BookBaseProps & {};
export class BookVolume extends BookBase {
  readonly type = BookTypes.VOLUME;
  constructor(props: BookVolumeProps) {
    super(props);
  }
  static create(props: BookBaseProps){
    return new BookVolume(props);
  }
}
