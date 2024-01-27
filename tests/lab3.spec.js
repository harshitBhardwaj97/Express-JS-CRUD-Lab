const { chromium } = require("playwright");
const { test, expect } = require("playwright/test");

test.describe("Lab 3 Tests", async () => {
  let browser;
  let page;

  const BASE_DB_URL = `http://localhost:1338`;
  const BASE_SERVER_URL = `http://localhost:1337`;

  test.beforeAll(async () => {
    browser = await chromium.launch({
      headless: true,
    });
  });

  test.beforeEach(async () => {
    const context = await browser.newContext();
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await browser.close();
  });

  test("http://localhost:1337 is up and running", async ({ page }) => {
    await page.goto(BASE_SERVER_URL);
  });

  test("http://localhost:1338 is up and running", async ({ page }) => {
    await page.goto(BASE_DB_URL);
  });

  test("POST /notes is accessible and working fine for valid note", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);

    let getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const initialNotesLength = (await getResponse.json()).length;

    console.log(initialNotesLength);

    const validNote = {
      content: `Random Note ${Date.now()}`,
      important: true,
    };

    const postResponse = await request.post(`${BASE_SERVER_URL}/notes`, {
      data: validNote,
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(postResponse.status()).toBe(201);

    getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const finalNotesLength = (await getResponse.json()).length;

    console.log(finalNotesLength);

    expect(finalNotesLength).toBe(initialNotesLength + 1);
  });

  test("POST /notes handles case when content parameter is missing and returns appropriate response", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);

    let getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const initialNotesLength = (await getResponse.json()).length;

    console.log(initialNotesLength);

    const postResponse = await request.post(`${BASE_SERVER_URL}/notes`, {
      data: {
        important: true,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const expectedResponse = {
      error: "Note content parameter is missing.",
    };

    expect(postResponse.status()).toBe(400);

    const actualResponse = await postResponse.json();

    console.log(actualResponse);

    expect(actualResponse).toStrictEqual(expectedResponse);

    getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const finalNotesLength = (await getResponse.json()).length;

    console.log(finalNotesLength);

    expect(finalNotesLength).toBe(initialNotesLength);
  });

  test("POST /notes handles case when important parameter is missing and returns appropriate response", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);
    let getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const initialNotesLength = (await getResponse.json()).length;

    console.log(initialNotesLength);

    const postResponse = await request.post(`${BASE_SERVER_URL}/notes`, {
      data: {
        content: `Random Note without important parameter`,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const expectedResponse = {
      error: "Note important parameter is missing.",
    };

    expect(postResponse.status()).toBe(400);

    const actualResponse = await postResponse.json();

    console.log(actualResponse);

    expect(actualResponse).toStrictEqual(expectedResponse);

    getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const finalNotesLength = (await getResponse.json()).length;

    console.log(finalNotesLength);

    expect(finalNotesLength).toBe(initialNotesLength);
  });

  test("POST /notes handles case when both content and important parameters are missing and returns appropriate response", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);
    let getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const initialNotesLength = (await getResponse.json()).length;

    console.log(initialNotesLength);

    const postResponse = await request.post(`${BASE_SERVER_URL}/notes`, {
      data: {},
      headers: {
        "Content-Type": "application/json",
      },
    });

    const expectedResponse = {
      error: "Note content and important parameters are required.",
    };

    expect(postResponse.status()).toBe(400);

    const actualResponse = await postResponse.json();

    console.log(actualResponse);

    expect(actualResponse).toStrictEqual(expectedResponse);

    getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const finalNotesLength = (await getResponse.json()).length;

    console.log(finalNotesLength);

    expect(finalNotesLength).toBe(initialNotesLength);
  });

  test("POST /notes handles case when important parameter is not of boolean type and returns appropriate response", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);
    let getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const initialNotesLength = (await getResponse.json()).length;

    console.log(initialNotesLength);

    const postResponse = await request.post(`${BASE_SERVER_URL}/notes`, {
      data: {
        content: "Note with non-boolean important parameter",
        important: "non-boolean",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    const expectedResponse = {
      error:
        "Note important parameter can only be true or false, enter either of value without quotes.",
    };

    expect(postResponse.status()).toBe(400);

    const actualResponse = await postResponse.json();

    console.log(actualResponse);

    expect(actualResponse).toStrictEqual(expectedResponse);

    getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const finalNotesLength = (await getResponse.json()).length;

    console.log(finalNotesLength);

    expect(finalNotesLength).toBe(initialNotesLength);
  });
});
