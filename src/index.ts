import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { stringify } from "querystring";
import { ErrorMessages } from "./error";

export const handler = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> => {
  console.log("incoming event:", JSON.stringify(event));
  return calculus(event);
};

export const calculus = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyStructuredResultV2> => {
  if (event.requestContext.http.method !== "GET") {
    console.log("unsupported http method:", event.requestContext.http.method);
    return buildResponse(405, {
      error: true,
      message: ErrorMessages.UnsupportedHttpMethod,
    });
  }

  if (!event.queryStringParameters || !event.queryStringParameters["input"]) {
    console.log(
      "missing required query parameters. Provided parameters:",
      JSON.stringify(event.queryStringParameters)
    );

    return buildResponse(400, {
      error: true,
      message: ErrorMessages.MissingRequiredQueryParameter,
    });
  }

  const input = event.queryStringParameters["input"];
  const decoded = decodeFromBase64(input);

  if (!isArithmeticExpression(decoded)) {
    console.log("input is not arithmetic expression:", decoded);
    return buildResponse(400, {
      error: true,
      message: ErrorMessages.UnsupportedSymbols,
    });
  }

  const result = eval(decoded);
  console.log("input:", decoded, "result:", result);

  return buildResponse(200, { error: false, result})
};

const buildResponse = (
  statusCode: number,
  body: LambdaResponseBody
): APIGatewayProxyStructuredResultV2 => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

const decodeFromBase64 = (input: string): string =>
  Buffer.from(input, "base64").toString("utf-8");

const isArithmeticExpression = (expression: string): boolean => {
  // TODO: add exhaustive unit tests
  const invalidCharactersRegex = /[^\d\+\-\*/\(\)\s]/gm
  return expression.match(invalidCharactersRegex) === null;
};

interface LambdaResponseBody {
  error: boolean;
  message?: string;
  result?: number;
}
