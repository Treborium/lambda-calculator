import { calculus } from "../../index";
import { ErrorMessages } from "../../error";
import { buildCustomEvent, encodeToBase64 } from "./utils";

describe("Calculus API", () => {
  it("returns 405 if http method is unsupported", async () => {
    const event = buildCustomEvent({
      requestContext: { http: { method: "POST" } },
    });

    const response = await calculus(event);

    expect(response.statusCode).toBe(405);
    expect(response.body).toEqual(
      JSON.stringify({
        error: true,
        message: ErrorMessages.UnsupportedHttpMethod,
      })
    );
  });

  it("returns 400 if required query parameter is missing", async () => {
    const event = buildCustomEvent({
      queryStringParameters: { testKey: "testValue" },
    });

    const response = await calculus(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      JSON.stringify({
        error: true,
        message: ErrorMessages.MissingRequiredQueryParameter,
      })
    );
  });

  it("returns 400 if no query parameter is present", async () => {
    const event = buildCustomEvent({
      queryStringParameters: undefined,
    });

    const response = await calculus(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      JSON.stringify({
        error: true,
        message: ErrorMessages.MissingRequiredQueryParameter,
      })
    );
  });

  it("returns 400 if query parameter is not base64 encoded", async () => {
    const event = buildCustomEvent({
      queryStringParameters: { input: "not-base64-encoded" },
    });

    const response = await calculus(event);

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual(
      JSON.stringify({
        error: true,
        message: ErrorMessages.UnsupportedSymbols,
      })
    );
  });

  it("returns 200 if required query parameter is present", async () => {
    const event = buildCustomEvent({
      queryStringParameters: { input: encodeToBase64("1 + 1") },
    });

    const response = await calculus(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      JSON.stringify({
        error: false,
        result: 2,
      })
    );
  });
});
