import { isArithmeticExpression, isHttpMethodUnsupported } from "../../assert";
import { buildCustomEvent } from "./utils";

describe("Asserts", () => {
  it("returns true if http method is unsupported", () => {
    const unsupportedMethods = [
      "POST",
      "DELETE",
      "PUT",
      "HEAD",
      "OPTION",
      "PATCH",
      "RANDOM_STRING",
    ];

    for (const method of unsupportedMethods) {
      const event = buildCustomEvent({
        requestContext: { http: { method } },
      });
      expect(isHttpMethodUnsupported(event)).toBe(true);
    }
  });

  it("returns false if http method is supported", () => {
    const event = buildCustomEvent({
      requestContext: { http: { method: "GET" } },
    });

    expect(isHttpMethodUnsupported(event)).toBe(false);
  });

  it("returns false if http method is supported and lower case", () => {
    const event = buildCustomEvent({
      requestContext: { http: { method: "get" } },
    });

    expect(isHttpMethodUnsupported(event)).toBe(false);
  });

  it("returns true if expression only contains valid symbols", () => {
    const expressions = [
      "1 + 2",
      "3 - 4",
      "5 * 6",
      "7 / 8",
      "(9 * (0 - 10)) / 3 - 5",
      "3.5 * 2.1",
      "1 + 2",  // unicode spaces
      "1 + -5",
      "0123456789+-*/(). ",
    ];

    for (const expression of expressions) {
      expect(isArithmeticExpression(expression)).toBe(true);
    }
  });

  it("return false if expression contains invalid symbols", () => {
    const expressions = [
      "x + 5",
      "2 % 3",
      "3,5 * 2,1"
    ];

    for (const expression of expressions) {
      expect(isArithmeticExpression(expression)).toBe(false);
    }

  });
});
