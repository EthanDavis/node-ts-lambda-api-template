
import * as router from "aws-lambda-router";
import { RouteVerb } from "./types/route-verb";
import { HealthController } from "./health/health-controller";
import { HealthService } from "./health/health-service";
import { DynamoDB } from "aws-sdk";
import { ProxyIntegrationEvent, ProxyIntegrationResult } from "aws-lambda-router/lib/proxyIntegration";
import { APIGatewayEventRequestContext, Context } from "aws-lambda";

// tslint:disable-next-line:no-any
const handle: <TContext extends Context>(event: router.RouterEvent, context: TContext) => Promise<any> = router.handler({
    proxyIntegration: {
        cors: true,
        routes: [
            {
                path: "/api/health",
                method: RouteVerb.GET,
                action: async (_request: ProxyIntegrationEvent, _context: APIGatewayEventRequestContext): Promise<ProxyIntegrationResult> => {
                    return await new HealthController(new HealthService(new DynamoDB())).getHealth();
                }
            }
        ]
    }
});

export { handle };