import {https} from "firebase-functions";
import {expect, jest, test} from "@jest/globals";
import {Response} from "express";
import {helloWorld} from "./index";
import * as admin from "firebase-admin";
import {
  clearFirestoreData,
} from "firebase-functions-test/lib/providers/firestore";
import initializeFFT from "firebase-functions-test";

process.env["FIRESTORE_EMULATOR_HOST"]="127.0.0.1:8080";
const projectConfig = {projectId: "demo-test"};

const fft = initializeFFT(projectConfig);

const app = admin.initializeApp(projectConfig);

describe("functions", () => {
  beforeEach(async () => {
    await clearFirestoreData(projectConfig);
  });

  test("helloWorld", async () => {
    // A fake request object, with req.query.text set to 'input'
    const req = {} as https.Request;

    // A fake response object, with a stubbed redirect function which does some
    // assertions
    const res = {
      send: jest.fn(),
    } as unknown as Response;

    /**
     * Invoke the function once using default {@link CloudEvent}.
     */
    await helloWorld(req as unknown as https.Request, res);
    expect(res.send).toBeCalledTimes(1);
    const messages = await app.firestore().collection("messages").get();
    expect(messages.docs[0].data()).toEqual({text: "Hello World"});
  });

  afterAll(async () => {
    await app.delete();
    fft.cleanup();
  });
});
