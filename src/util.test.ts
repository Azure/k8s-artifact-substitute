import { GetMultilineStr, TraverseObject, SplitMultilineInput } from "./util";

describe("Utils", () => {
  describe("GetMultilineStr", () => {
    it("creates a multiline string", () => {
      const arr = ["hello", "world", "!"];
      expect(GetMultilineStr(arr)).toEqual(`hello
world
!`);
    });
  });

  describe("TraverseObject", () => {
    it("iterates over an object performing a function on leafs", () => {
      const obj = {
        just: "testing",
        this: "object",
        lets: { see: "if", it: { works: "on", nested: "objs" } },
      };
      const opFn = (key, val) => val + "1";
      const expectedObj = {
        just: "testing1",
        this: "object1",
        lets: { see: "if1", it: { works: "on1", nested: "objs1" } },
      };

      TraverseObject(obj, opFn);
      expect(obj).toEqual(expectedObj);
    });
  });

  describe("SplitMultilineInput", () => {
    it("splits multiline input", () => {
      const input = `this
            is
            on
            multiple
            lines`;

      const expected = ["this", "is", "on", "multiple", "lines"];
      expect(SplitMultilineInput(input)).toEqual(expected);
    });
  });
});
