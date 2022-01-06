import { calculus } from "../index";
import { ErrorMessages } from "../error";
import { buildCustomEvent } from "./utils";

describe("Calculus API", () => {
  it("returns 405 if http method is unsupported", async () => {
    const event = buildCustomEvent({
      requestContext: { http: { method: "POST" } },
    });

    const response = await calculus(event);
    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual(JSON.stringify({ error: true, message: ErrorMessages.UnsupportedHttpMethod}));
  });
});
