import {
  createTestDb,
  runAppForTesting,
  TestContextType,
} from "@skyslit/ark-backend/build/test-utils";
import App from "../../../server/main.app";
import mongodb from "mongodb";
import { getModelName } from "@skyslit/ark-backend";

const dbServer = createTestDb();

afterEach(() => dbServer.stop());

describe("list-user-details", () => {
  let testContext: TestContextType = null;

  beforeEach(async () => {
    const dbConnectionString = await dbServer.getDbConnectionString();

    testContext = await runAppForTesting(App, {
      MONGO_CONNECTION_STRING: dbConnectionString,
    });
  });

  afterEach(async () => {
    await testContext.instance.deactivate();
  });

  test(
    "general usage",
    async () => {
      const dbConnection = await mongodb.connect(
        await dbServer.getDbConnectionString()
      );
      const db = dbConnection.db(await dbServer.mongod.getDbName());
      const modelName = getModelName("main", "member-assignments");

      const insertOperation = await db.collection(modelName).insert({
        userId: "Standard"
      });

      const userId = insertOperation.insertedIds["0"];

      const serviceId = "main/list-user-details";
      const requestBody = {
        userId
      };
      const serviceResponse = await testContext.invokeService(
        serviceId,
        requestBody
      );

      expect(serviceResponse.statusCode).toStrictEqual(200);
      expect(serviceResponse.body.meta.message).toStrictEqual(
        "Details listed"
      );
      console.log("Test running good");
      console.log(serviceResponse.body);
    },
    120 * 1000
  );
});


