const { chromium } = require("playwright");
const { test, expect } = require("playwright/test");

test.describe("Lab 2 Tests", async () => {
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

  test("/notes/:id is accessible with valid id", async ({ request }) => {
    const response = await request.get(`${BASE_SERVER_URL}/notes`);

    expect(response.status()).toBe(200);

    const allNotes = await response.json();
    const validId = allNotes[0].id;

    const responseNoteById = await request.get(
      `${BASE_SERVER_URL}/notes/${validId}`
    );
    expect(responseNoteById.status()).toBe(200);

    console.log(await responseNoteById.json());

    const expectedResponse = {
      content: "Coding is easy, if you learn from right place new.",
      important: true,
    };

    const actualResponse = await responseNoteById.json();

    expect(actualResponse.content).toBe(expectedResponse.content);
    expect(actualResponse.important).toBe(expectedResponse.important);
  });

  test("/notes/:id with returns 404 status with appropriate message with invalid id", async ({
    request,
  }) => {
    const randomId = Math.random().toString(36).substring(7);
    const response = await request.get(`${BASE_SERVER_URL}/notes/${randomId}`);

    // Log the response for debugging
    console.table({
      status: response.status(),
    });

    expect(response.status()).toBe(404);

    // Verify that the response contains the expected notes
    const expectedResponse = {
      error: `Note with id ${randomId} not found!`,
    };

    const actualResponse = await response.json();
    expect(actualResponse).toStrictEqual(expectedResponse);
  });

  test("/important-notes/ is accessible and returns the array of important-notes", async ({
    request,
  }) => {
    const response = await request.get(`${BASE_SERVER_URL}/important-notes`);

    console.table({
      status: response.status(),
    });

    expect(response.status()).toBe(200);

    const expectedResponse = {
      "total important-notes": 2,
      "important-notes": [
        {
          id: "L-u69WNX_JZRhqA8gdF-E",
          content: "Coding is easy, if you learn from right place new.",
          important: true,
        },
        {
          id: "UDZjM2KAEULdvKD7Ziaz0",
          content:
            "GET and POST are the most important methods of HTTP protocol",
          important: true,
        },
      ],
    };

    const actualResponse = await response.json();
    expect(actualResponse).toStrictEqual(expectedResponse);
  });
});
