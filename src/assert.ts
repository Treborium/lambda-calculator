import { APIGatewayProxyEventV2 as ApiGatewayEvent } from "aws-lambda";

export const isArithmeticExpression = (expression: string): boolean => {
  // TODO: add exhaustive unit tests
  const invalidCharactersRegex = /[^\d\+\-\*/\(\)\s]/gm;
  return expression.match(invalidCharactersRegex) === null;
};

export const isHttpMethodUnsupported = (event: ApiGatewayEvent): boolean =>
  event.requestContext.http.method !== "GET";
