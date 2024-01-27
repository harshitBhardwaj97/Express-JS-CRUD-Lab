const { chromium } = require("playwright");
const { test, expect } = require("playwright/test");

test.describe("Lab 1 Tests", async () => {
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

  test("/notes is accessible and working as expected", async ({ request }) => {
    const response = await request.get(`${BASE_SERVER_URL}/notes`);

    expect(response.status()).toBe(200);

    const expectedResponse = [
      {
        id: "L-u69WNX_JZRhqA8gdF-E",
        content: "Coding is easy, if you learn from right place new.",
        important: true,
      },
      {
        id: "Z8CFLzBHabY1eU0vks8zf",
        content: "Browser can execute only JavaScript",
        important: false,
      },
      {
        id: "UDZjM2KAEULdvKD7Ziaz0",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true,
      },
    ];

    const actualResponse = await response.json();
    expect(actualResponse).toStrictEqual(expectedResponse);
  });
});
