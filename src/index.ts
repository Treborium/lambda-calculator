import {
  APIGatewayProxyEventV2 as ApiGatewayEvent,
  APIGatewayProxyStructuredResultV2 as ApiGatewayResponse,
} from "aws-lambda";
import { ErrorMessages } from "./error";

export const handler = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  console.log("incoming event:", JSON.stringify(event));
  return calculus(event);
};

export const calculus = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  if (event.requestContext.http.method !== "GET") {
    return unsupportedHttpMethodError(event);
  }

  if (!event.queryStringParameters || !event.queryStringParameters["input"]) {
    return missingRequiredQueryParameterError(event);
  }

  const input = event.queryStringParameters["input"];
  const decoded = decodeFromBase64(input);

  if (!isArithmeticExpression(decoded)) {
    return unsupportedSymbolsError(decoded);
  }

  const result = eval(decoded);
  console.log("input:", decoded, "result:", result);

  return buildResponse(200, { error: false, result });
};

const buildResponse = (
  statusCode: number,
  body: LambdaResponseBody
): ApiGatewayResponse => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

const decodeFromBase64 = (input: string): string =>
  Buffer.from(input, "base64").toString("utf-8");

const isArithmeticExpression = (expression: string): boolean => {
  // TODO: add exhaustive unit tests
  const invalidCharactersRegex = /[^\d\+\-\*/\(\)\s]/gm;
  return expression.match(invalidCharactersRegex) === null;
};

const unsupportedHttpMethodError = (
  event: ApiGatewayEvent
): ApiGatewayResponse => {
  console.log("unsupported http method:", event.requestContext.http.method);
  return buildResponse(405, {
    error: true,
    message: ErrorMessages.UnsupportedHttpMethod,
  });
};

const missingRequiredQueryParameterError = (
  event: ApiGatewayEvent
): ApiGatewayResponse => {
  console.log(
    "missing required query parameters. Provided parameters:",
    JSON.stringify(event.queryStringParameters)
  );

  return buildResponse(400, {
    error: true,
    message: ErrorMessages.MissingRequiredQueryParameter,
  });
};

const unsupportedSymbolsError = (
  input: string
): ApiGatewayResponse => {
  console.log("input is not arithmetic expression:", input);
  return buildResponse(400, {
    error: true,
    message: ErrorMessages.UnsupportedSymbols,
  });
};

interface LambdaResponseBody {
  error: boolean;
  message?: string;
  result?: number;
}
