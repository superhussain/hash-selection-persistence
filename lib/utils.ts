import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function constructUrl({
  path,
  query,
  hash,
}: {
  path?: string;
  query?: Record<string, string>;
  hash?: string;
}) {
  const url = new URL(window.location.href);
  if (path) url.pathname = path;
  if (query) {
    for (const key in query) {
      if (!query[key]) {
        url.searchParams.delete(key);
        continue;
      }
      url.searchParams.set(key, query[key]);
    }
  }
  if (hash) url.hash = hash;
  return url.toString();
}
