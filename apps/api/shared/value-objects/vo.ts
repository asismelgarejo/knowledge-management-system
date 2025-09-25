export abstract class ValueObject<T extends object> {
  protected readonly props: Readonly<T>;
  protected constructor(props: T) {
    this.props = Object.freeze({ ...props });
  }
  equals(other?: ValueObject<T>): boolean {
    if (!other) return false;
    if (this === other) return true;
    if (this.constructor !== other.constructor) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return JSON.stringify(this.props) === JSON.stringify((other as any).props);
  }
}
