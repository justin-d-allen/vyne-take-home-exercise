import { expect, test } from "@playwright/test";
import {
  isPost,
  knownPost,
  newPost,
  patchedTitle,
  type Post,
} from "../../test-data/api";

function expectJson(response: { headers: () => Record<string, string> }): void {
  expect(response.headers()["content-type"]).toMatch(/application\/json/i);
}

test.describe("JSONPlaceholder posts", () => {
  test("returns the posts collection with a stable shape @smoke", async ({
    request,
  }) => {
    const response = await request.get("/posts");

    expect(response.status()).toBe(200);
    expectJson(response);

    const body = (await response.json()) as unknown;
    expect(Array.isArray(body)).toBe(true);

    const posts = body as Post[];
    expect(posts).toHaveLength(100);
    expect(posts.every(isPost)).toBe(true);
    expect(posts[0]).toMatchObject({ id: 1, userId: 1 });
    expect(posts[99]?.id).toBe(100);
  });

  test("returns a known post by id", async ({ request }) => {
    const response = await request.get(`/posts/${knownPost.id}`);

    expect(response.status()).toBe(200);
    expectJson(response);

    const post = (await response.json()) as unknown;
    expect(isPost(post)).toBe(true);
    expect(post).toMatchObject(knownPost);
    expect((post as Post).body.length).toBeGreaterThan(0);
  });

  test("filters posts by userId and keeps the relationship", async ({
    request,
  }) => {
    const userId = knownPost.userId;
    const response = await request.get("/posts", {
      params: { userId },
    });

    expect(response.status()).toBe(200);
    expectJson(response);

    const posts = (await response.json()) as Post[];
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every(isPost)).toBe(true);
    expect(posts.every((post) => post.userId === userId)).toBe(true);
  });

  test("returns a simulated created post without requiring persistence", async ({
    request,
  }) => {
    const response = await request.post("/posts", { data: newPost });

    expect(response.status()).toBe(201);
    expectJson(response);

    const created = (await response.json()) as Post;
    expect(created).toMatchObject(newPost);
    expect(created.id).toBe(101);
  });

  test("returns a simulated patch that echoes the updated field", async ({
    request,
  }) => {
    const response = await request.patch(`/posts/${knownPost.id}`, {
      data: { title: patchedTitle },
    });

    expect(response.status()).toBe(200);
    expectJson(response);

    const patched = (await response.json()) as Post;
    expect(patched.id).toBe(knownPost.id);
    expect(patched.title).toBe(patchedTitle);
    expect(patched.userId).toBe(knownPost.userId);
    expect(patched.body.length).toBeGreaterThan(0);
  });

  test("treats DELETE as simulated and does not remove the original post", async ({
    request,
  }) => {
    const deleted = await request.delete(`/posts/${knownPost.id}`);
    expect(deleted.status()).toBe(200);

    const afterDelete = await request.get(`/posts/${knownPost.id}`);
    expect(afterDelete.status()).toBe(200);
    expectJson(afterDelete);
    expect((await afterDelete.json()) as Post).toMatchObject(knownPost);
  });

  test("returns 404 for a post that does not exist", async ({ request }) => {
    const missing = await request.get("/posts/999");
    expect(missing.status()).toBe(404);
    expectJson(missing);
    expect(await missing.json()).toEqual({});
  });
});
