import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
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

  return {
    statusCode: 200,
    body: "hello from lambda!",
  };
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

interface LambdaResponseBody {
  error: boolean;
  message?: string;
  result?: number;
}
