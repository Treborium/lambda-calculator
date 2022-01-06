import { APIGatewayProxyEventV2 } from "aws-lambda";
import {PartialDeep} from 'type-fest';
import { merge } from 'lodash';

export const buildCustomEvent = (overrides: PartialDeep<APIGatewayProxyEventV2>): APIGatewayProxyEventV2 => {
  const sampleEvent = require('./resources/sample-event.json');
  return merge(sampleEvent, overrides);
};