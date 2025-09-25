import { type JestConfigWithTsJest } from "ts-jest";
import { defaults as tjsPreset } from "ts-jest/presets";

const jestConfig: JestConfigWithTsJest = {
  moduleNameMapper: {
    "^@/(.*)$": ["<rootDir>/$1"],
  },
  transform: {
    ...tjsPreset.transform,
  },
};

export default jestConfig;
