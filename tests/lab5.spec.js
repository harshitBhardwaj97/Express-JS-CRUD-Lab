const { chromium } = require("playwright");
const { test, expect } = require("playwright/test");

test.describe("Lab 5 Tests", async () => {
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

  test("DELETE /notes/:id is working fine with valid id", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);

    const noteToBeDeleted = {
      content: `Note to be deleted ${Date.now()}`,
      important: true,
    };

    const postResponse = await request.post(`${BASE_SERVER_URL}/notes`, {
      data: noteToBeDeleted,
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(postResponse.status()).toBe(201);

    const actualResponse = await postResponse.json();

    const idToBeDeleted = actualResponse.note.id;

    const deleteResponse = await request.delete(
      `${BASE_SERVER_URL}/notes/${idToBeDeleted}`
    );

    expect(deleteResponse.status()).toBe(204);

    const notesAfterDeletion = await request.get(`${BASE_SERVER_URL}/notes`);

    const notes = await notesAfterDeletion.json();

    const deletedNoteFound = notes.find((note) => note.id === idToBeDeleted);

    console.log(deletedNoteFound);

    expect(deletedNoteFound).toBeUndefined();
  });

  test("DELETE /notes/:id is working fine with invalid id", async ({
    page,
    request,
  }) => {
    await page.waitForTimeout(2000);

    const invalidId = Math.random().toString(36).substring(7);

    const deleteResponse = await request.delete(
      `${BASE_SERVER_URL}/notes/${invalidId}`
    );

    expect(deleteResponse.status()).toBe(404);

    const expectedResponse = {
      error: `Note with id ${invalidId} cannot be deleted because it is not found!`,
    };

    const actualResponse = await deleteResponse.json();

    expect(actualResponse).toStrictEqual(expectedResponse);
  });
});
