import { DynamoDB } from "aws-sdk";

export class HealthService {
    private dbClient: DynamoDB;

    constructor(dbClient: DynamoDB) {
        this.dbClient = dbClient;
    }

    async getDatabaseInfo (): Promise<DynamoDB.DescribeTableOutput> {
        return this.dbClient.describeTable({ TableName: "event_test" }).promise();
    }
}