export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const knownPost = {
  id: 1,
  userId: 1,
  title:
    "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
} as const;

export const newPost = {
  title: "Assessment post",
  body: "Created only to inspect the simulated POST response.",
  userId: 7,
} as const;

export const patchedTitle = "Assessment title update";

export function isPost(value: unknown): value is Post {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.userId === "number" &&
    typeof candidate.id === "number" &&
    typeof candidate.title === "string" &&
    typeof candidate.body === "string"
  );
}
