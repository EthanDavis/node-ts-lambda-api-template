import { HealthController } from "../../src/health/health-controller";
import { createSandbox, SinonSandbox, SinonStubbedInstance } from "sinon";
import { HealthStatus } from "../../src/types/health-status";
import { HealthService } from "../../src/health/health-service";
import { ProxyIntegrationResult } from "aws-lambda-router/lib/proxyIntegration";
import { expect } from "chai";

describe("HealthControllerTests", () => {

    let controller: HealthController;
    let healthServiceStub: SinonStubbedInstance<HealthService>;
    let sinonSandbox: SinonSandbox;

    beforeEach(() => {
        sinonSandbox = createSandbox();
        healthServiceStub = sinonSandbox.createStubInstance(HealthService);

        // tslint:disable:no-any
        controller = new HealthController(<HealthService><any>healthServiceStub);
        // tslint:enable:no-any
    });

    afterEach(() => {
        sinonSandbox.restore();
    });

    describe("Function -> getHealth", () => {
        it("Should return status of DOWN if db query fails", async () => {
            healthServiceStub.getDatabaseInfo.returns(Promise.reject(new Error("error")));

            const result: ProxyIntegrationResult = await controller.getHealth();
            const expected: HealthStatus = JSON.parse(result.body);

            expect(expected.status).to.equal("DOWN");
        });

        it("Should return status of UP", async () => {
            healthServiceStub.getDatabaseInfo.returns(Promise.resolve({ Table: {} }));

            const result: ProxyIntegrationResult = await controller.getHealth();
            const expected: HealthStatus = JSON.parse(result.body);

            expect(expected.status).to.equal("UP");
        });
    });
});