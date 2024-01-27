const { chromium } = require("playwright");
const { test, expect } = require("playwright/test");

test.describe("Lab 4 Tests", async () => {
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

  test("PUT /notes/:id is working fine with valid note and valid id", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);

    const getResponse = await request.get(`${BASE_SERVER_URL}/notes`);

    const notes = await getResponse.json();

    const validId = notes[0].id;

    const updatedNote = {
      content: `updated note content ${Date.now()}`,
      important: true,
    };

    const putResponse = await request.put(
      `${BASE_SERVER_URL}/notes/${validId}`,
      {
        data: updatedNote,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(putResponse.status()).toBe(200);

    const expectedResponse = {
      message: `Note with id ${validId} updated successfully`,
      note: {
        content: updatedNote.content,
        important: true,
      },
    };

    const actualResponse = await putResponse.json();

    expect(actualResponse).toStrictEqual(expectedResponse);
  });

  test("PUT /notes/:id is working fine with valid note and not valid note id", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);

    const invalidId = Math.random().toString(36).substring(7);

    const updatedNote = {
      content: `updated note content ${Date.now()}`,
      important: true,
    };

    const putResponse = await request.put(
      `${BASE_SERVER_URL}/notes/${invalidId}`,
      {
        data: updatedNote,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(putResponse.status()).toBe(404);

    const expectedResponse = {
      error: `Note with id ${invalidId} cannot be updated because its not found!`,
    };

    const actualResponse = await putResponse.json();

    expect(actualResponse).toStrictEqual(expectedResponse);
  });
});
