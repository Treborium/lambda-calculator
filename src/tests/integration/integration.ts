import axios, { AxiosError } from "axios";
import { ErrorMessages } from "../../error";
import { encodeToBase64 } from "../unit/utils";

const url =
  "https://1venjqkejd.execute-api.eu-central-1.amazonaws.com/default/calculus";

describe("Integration Tests of calculus/", () => {
  it("returns status code 200 and result is 20", async () => {
    const response = await axios.get(url, {
      params: { input: encodeToBase64("(5 + 5) * 2") },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ error: false, result: 20 });
  });

  it("returns status code 405 for unsupported http method", async () => {
    let isResponseReceived = false;

    await axios
      .post(url, {
        params: { input: encodeToBase64("(5 + 5) * 2") },
      })
      .catch((err: AxiosError) => {
        expect(err.response?.status).toBe(405);
        expect(err.response?.data).toEqual({
          error: true,
          message: ErrorMessages.UnsupportedHttpMethod,
        });
        isResponseReceived = true;
      });

    expect(isResponseReceived).toBe(true);
  });

  it("returns status code 400 for missing query param", async () => {
    let isResponseReceived = false;

    await axios
      .get(url, {
        params: { something: encodeToBase64("(5 + 5) * 2") },
      })
      .catch((err: AxiosError) => {
        expect(err.response?.status).toBe(400);
        expect(err.response?.data).toEqual({
          error: true,
          message: ErrorMessages.MissingRequiredQueryParameter,
        });
        isResponseReceived = true;
      });

    expect(isResponseReceived).toBe(true);
  });

  it("returns status code 400 for input with unallowed symbols", async () => {
    let isResponseReceived = false;

    await axios
      .get(url, {
        params: { input: encodeToBase64("(5 + 5) * 2x") },
      })
      .catch((err: AxiosError) => {
        expect(err.response?.status).toBe(400);
        expect(err.response?.data).toEqual({
          error: true,
          message: ErrorMessages.UnsupportedSymbols,
        });
        isResponseReceived = true;
      });

    expect(isResponseReceived).toBe(true);
  });

  it("returns status code 400 for input that is not base64", async () => {
    let isResponseReceived = false;

    await axios
      .get(url, {
        params: { input: "(5 + 5) * 2x" },
      })
      .catch((err: AxiosError) => {
        expect(err.response?.status).toBe(400);
        expect(err.response?.data).toEqual({
          error: true,
          message: ErrorMessages.UnsupportedSymbols,
        });
        isResponseReceived = true;
      });

    expect(isResponseReceived).toBe(true);
  });
});
