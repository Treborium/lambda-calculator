import {
  APIGatewayProxyEventV2 as ApiGatewayEvent,
  APIGatewayProxyStructuredResultV2 as ApiGatewayResponse,
} from "aws-lambda";
import { buildResponse } from "./index";

export enum ErrorMessages {
  UnsupportedHttpMethod = "method not allowed. Supported methods are: 'GET'",
  MissingRequiredQueryParameter = "required query parameter is missing. Required parameters are: 'input'",
  UnsupportedSymbols = "unsupported symbols used for input expression. Supported symbols are: '+', '-', '*', '/', '(', ')', ' '",
}

export const unsupportedHttpMethodError = (
  event: ApiGatewayEvent
): ApiGatewayResponse => {
  console.log("unsupported http method:", event.requestContext.http.method);
  return buildResponse(405, {
    error: true,
    message: ErrorMessages.UnsupportedHttpMethod,
  });
};

export const missingRequiredQueryParameterError = (
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

export const unsupportedSymbolsError = (
  input: string
): ApiGatewayResponse => {
  console.log("input is not arithmetic expression:", input);
  return buildResponse(400, {
    error: true,
    message: ErrorMessages.UnsupportedSymbols,
  });
};