import { APIGatewayProxyEventV2 as ApiGatewayEvent } from "aws-lambda";

export const isArithmeticExpression = (expression: string): boolean => {
  const invalidCharactersRegex = /[^\d\+\-\*/\(\)\s\.]/gm;
  return expression.match(invalidCharactersRegex) === null;
};

export const isHttpMethodUnsupported = (event: ApiGatewayEvent): boolean => {
  const method = event.requestContext.http.method.toUpperCase();
  return method !== "GET";
};
