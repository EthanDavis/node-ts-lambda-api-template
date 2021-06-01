import { HealthService } from "./health-service";
import { HealthStatus } from "../types/health-status";
import { ProxyIntegrationResult } from "aws-lambda-router/lib/proxyIntegration";
import { DynamoDB } from "aws-sdk";

export class HealthController {
    private healthService: HealthService;

    constructor(healthService: HealthService) {
        this.healthService = healthService;
    }

    getHealth = async (): Promise<ProxyIntegrationResult> => {
        const healthStatus: HealthStatus = { status: "UP" };
        try {
            const dbInfo: DynamoDB.DescribeTableOutput = await this.healthService.getDatabaseInfo();
            console.info("Connected to ", dbInfo.Table);
        } catch (error) {
            healthStatus.status = "DOWN";
        }

        return {
            body: JSON.stringify(healthStatus)
        };
    }
}