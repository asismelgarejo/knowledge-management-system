import { WaiterOption } from "./option";

type WaitFunc = () => void;
export interface Waiter {
  add(...fns: WaitFunc[]): void;
  wait(): void;
}
class waiter implements Waiter {
  fns: WaitFunc[] = [];
  add(...fns: WaitFunc[]): void {
    this.fns.push(...fns);
  }
  wait(): void {
    this.fns.forEach((f) => f());
  }
}

export class waiterCfg {
  catchSignals: boolean = false;
}

export function NewWaiter(...options: WaiterOption[]): Waiter {
  const cfg = new waiterCfg();
  options.forEach((option) => option(cfg));
  const w = new waiter();

  return w;
}
