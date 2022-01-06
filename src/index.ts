import {
  APIGatewayProxyEventV2 as ApiGatewayEvent,
  APIGatewayProxyStructuredResultV2 as ApiGatewayResponse,
} from "aws-lambda";
import { isArithmeticExpression, isHttpMethodUnsupported } from "./assert";
import {
  unsupportedHttpMethodError,
  missingRequiredQueryParameterError,
  unsupportedSymbolsError,
} from "./error";

export const handler = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  console.log("incoming event:", JSON.stringify(event));
  return calculus(event);
};

export const calculus = async (
  event: ApiGatewayEvent
): Promise<ApiGatewayResponse> => {
  if (isHttpMethodUnsupported(event)) {
    return unsupportedHttpMethodError(event);
  }

  if (!event.queryStringParameters?.["input"]) {
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

export const buildResponse = (
  statusCode: number,
  body: LambdaResponseBody
): ApiGatewayResponse => {
  return {
    statusCode,
    body: JSON.stringify(body),
  };
};

interface LambdaResponseBody {
  error: boolean;
  message?: string;
  result?: number;
}

const decodeFromBase64 = (input: string): string =>
  Buffer.from(input, "base64").toString("utf-8");



