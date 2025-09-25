import { waiterCfg } from "./waiter";

export type WaiterOption = (cfg: waiterCfg) => void;

export const CatchSignals = (): WaiterOption => {
  return (cfg: waiterCfg) => {
    cfg.catchSignals = true;
  };
};
