import { isLeft } from "fp-ts/Either";
import { Id, InvalidIdError } from "./id";

//#region id
describe("Id", () => {
  const validIds = [
    {
      expected: Id,
      input: "000000000000000000000000",
      name: "24 ceros",
    },
  ];

  validIds.map(({ name, input, expected }) => {
    test(`Valid - ${name}`, () => {
      const response = Id.create(input);
      if (isLeft(response)) return expect(response.left).toBeInstanceOf(expected);
      expect(response.right).toBeInstanceOf(expected);
    });
  });

  const invalidIds = [
    {
      expected: InvalidIdError,
      input: "asdasd",
      name: "Short 6 character length string",
    },
  ];

  invalidIds.map(({ name, input, expected }) => {
    test(`Invalid - ${name}`, () => {
      const response = Id.create(input);
      if (isLeft(response)) return expect(response.left).toBeInstanceOf(expected);
      expect(response.right).toBeInstanceOf(expected);
    });
  });
});
//#endregion id
