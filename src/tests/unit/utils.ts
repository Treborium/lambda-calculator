import { APIGatewayProxyEventV2 } from "aws-lambda";
import { PartialDeep } from "type-fest";
import { merge, cloneDeep } from "lodash";

const sampleEvent = require("./resources/sample-event.json");

export const buildCustomEvent = (
  overrides: PartialDeep<APIGatewayProxyEventV2>
): APIGatewayProxyEventV2 => {
  const clonedEvent = cloneDeep(sampleEvent);
  return merge(clonedEvent, overrides);
};

export const encodeToBase64 = (input: string): string =>
  Buffer.from(input, "utf-8").toString("base64");
